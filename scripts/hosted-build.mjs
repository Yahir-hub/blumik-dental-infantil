import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const phase=process.argv[2],attemptId=process.env.HYRONIX_ATTEMPT_ID;
const target=process.env.HYRONIX_TARGET,coordinator=process.env.HYRONIX_BUILD_COORDINATOR;
const expected={staging:'https://gtvwovlcotccpfgmhcas.supabase.co/functions/v1/hosted-build',production:'https://xmaxabppzlfbhuwdqemr.supabase.co/functions/v1/hosted-build'};
assert.equal(coordinator,expected[target],'UNAUTHORIZED_COORDINATOR');
assert.match(attemptId??'',/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/);
assert.equal(process.env.GITHUB_REPOSITORY,'Yahir-hub/blumik-dental-infantil');
assert.equal(process.env.GITHUB_REF,'refs/heads/hyronix-zero-cost');
assert.equal(process.env.GITHUB_EVENT_NAME,'workflow_dispatch');
const json=async file=>JSON.parse(await readFile(file,'utf8'));
const api=async(action,extra={})=>{
 // OIDC is minted per step; no Supabase secret, reusable JWT or DB lease enters CI.
 const url=new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
 assert.ok(url.protocol==='https:'&&/\.actions\.githubusercontent\.com$/.test(url.hostname),'OIDC_ENDPOINT');
 url.searchParams.set('audience',coordinator);
 const issued=await fetch(url,{headers:{Authorization:'Bearer '+process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN},redirect:'error',signal:AbortSignal.timeout(15000)});
 assert.ok(issued.ok,'OIDC_UNAVAILABLE');const {value}=await issued.json();assert.equal(typeof value,'string');
 const result=await fetch(coordinator+'/job',{method:'POST',headers:{Authorization:'Bearer '+value,'Content-Type':'application/json'},
  body:JSON.stringify({action,attemptId,...extra}),redirect:'error',signal:AbortSignal.timeout(15000)});
 assert.ok(result.ok,'COORDINATOR_DENIED');return result.json();
};
const run=(args,env=process.env,timeout=18*60*1000)=>{
 const r=spawnSync(process.execPath,args,{env,encoding:'utf8',timeout,maxBuffer:8*1024*1024});
 // Do not retain arbitrary subprocess logs (including potential upstream secret echoes).
 assert.equal(r.status,0,'BUILD_COMMAND_FAILED');return r.stdout??'';
};
try{
 if(phase==='authorize'){
  const job=await api('start');assert.equal(job.ok,true);assert.equal(job.sourceSha,process.env.GITHUB_SHA);
  assert.equal(job.environment,target);assert.equal(job.workerName,target==='staging'?'blumik-static-staging':'blumik-static-production');
  assert.ok(Number.isSafeInteger(job.contentVersion)&&job.contentVersion>0);
  await writeFile('.hosted-job.json',JSON.stringify(job));
  console.log(JSON.stringify({result:'AUTHORIZED',commit:job.sourceSha,publishedVersion:job.contentVersion,attemptId}));
 }else if(phase==='build'){
  const job=await json('.hosted-job.json');assert.equal(job.testFailure,false,'CONTROLLED_STAGING_BUILD_FAILURE');
  const env={...process.env,HYRONIX_CONTENT_API_URL:job.contentApiUrl,HYRONIX_SITE_KEY:job.siteKey,
   HYRONIX_BUILD_CONTENT_VERSION:String(job.contentVersion),HYRONIX_ENVIRONMENT:target};
  // Never pass identity or provider credentials to build code or generated content.
  for(const key of Object.keys(env))if(/TOKEN|SECRET|PASSWORD|COOKIE|AUTHORIZATION/.test(key))delete env[key];
  run(['node_modules/oxlint/bin/oxlint'],env);run(['node_modules/typescript/bin/tsc','--noEmit'],env);
  run(['scripts/build-static.mjs'],env);
  const artifact=await json('.hyronix-static-build.json');assert.equal(artifact.contentVersion,job.contentVersion);
  const manifest=await json(join(artifact.output,'deployment.json'));
  manifest.sourceCommit=job.sourceSha;manifest.hostedRunId=process.env.GITHUB_RUN_ID;
  await writeFile(join(artifact.output,'deployment.json'),JSON.stringify(manifest));
  console.log(JSON.stringify({result:'STATIC_BUILD_PASS',commit:job.sourceSha,publishedVersion:job.contentVersion,files:artifact.files}));
 }else if(phase==='deploy'){
  const job=await json('.hosted-job.json'),artifact=await json('.hyronix-static-build.json');
  assert.equal(artifact.contentVersion,job.contentVersion);
  const root=resolve('.static-build')+'/';assert.ok(resolve(artifact.output).startsWith(root)&&artifact.output.endsWith('/out'));
  const token=process.env.CLOUDFLARE_API_TOKEN;assert.ok(token?.length>=32,'DEDICATED_DEPLOY_TOKEN_REQUIRED');
  async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){assert.ok(!e.isSymbolicLink());const p=join(dir,e.name);if(e.isDirectory())await scan(p);else{const b=await readFile(p);assert.ok(!b.includes(Buffer.from(token)),'SECRET_IN_ARTIFACT');if(/\.(html|js|json|map|txt|xml)$/.test(p))assert.ok(!/draft_value|sb_secret_[A-Za-z0-9_-]{20,}|github_pat_[A-Za-z0-9_]{20,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(b.toString()),'PRIVATE_DATA_IN_ARTIFACT');}}}
  await scan(artifact.output);
  if(!(await api('can_commit')).ok){assert.equal((await api('finish',{failure:'version_changed'})).ok,true);console.log('SUPERSEDED');process.exit(0);}
  const config={name:job.workerName,account_id:'afbf82bb0732b155e201ed658dd9f58c',compatibility_date:'2026-10-16',workers_dev:true,preview_urls:false,
   assets:{directory:artifact.output,html_handling:'auto-trailing-slash',not_found_handling:'404-page'}};
  await writeFile('.hosted-wrangler.json',JSON.stringify(config));
  await writeFile('.hosted-deploy-started.json',JSON.stringify({attemptId}));
  // A CLI timeout after upload is ambiguous; failure phase will not release the lease.
  const output=run(['node_modules/wrangler/bin/wrangler.js','deploy','--config','.hosted-wrangler.json'],process.env,180000);
  const deploymentId=output.match(/Current Version ID:\s*([a-f0-9-]{36})/)?.[1];assert.ok(deploymentId,'DEPLOY_RECONCILIATION_REQUIRED');
  await writeFile('.hosted-deployed.json',JSON.stringify({deploymentId}));
  assert.equal((await api('finish',{deploymentId})).ok,true,'ACK_RECONCILIATION_REQUIRED');
  console.log(JSON.stringify({result:'DEPLOYED',commit:job.sourceSha,publishedVersion:job.contentVersion,deploymentId,runId:process.env.GITHUB_RUN_ID}));
 }else if(phase==='failure'){
  let deployed;try{deployed=await json('.hosted-deployed.json');}catch(error){if(error.code!=='ENOENT')throw error;}
  if(deployed){assert.equal((await api('finish',deployed)).ok,true,'ACK_RECONCILIATION_REQUIRED');}
  else{
   let started=false;try{await readFile('.hosted-deploy-started.json');started=true;}catch(error){if(error.code!=='ENOENT')throw error;}
   if(started)throw Error('DEPLOY_RECONCILIATION_REQUIRED');
   assert.equal((await api('finish',{failure:'build_failed'})).ok,true);
  }
 }else throw Error('INVALID_PHASE');
}catch(error){console.error(['CONTROLLED_STAGING_BUILD_FAILURE','DEPLOY_RECONCILIATION_REQUIRED','ACK_RECONCILIATION_REQUIRED'].includes(error.message)?error.message:'HOSTED_BUILD_FAILED');process.exitCode=1;}
