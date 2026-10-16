import {mkdir,cp,readdir,readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const source=process.cwd();await mkdir('.static-build',{recursive:true});
const work=await mkdtemp(resolve('.static-build/run-'));
// Build in an isolated source copy. The live SSR branch and its route handler remain recoverable.
for(const entry of await readdir(source,{withFileTypes:true})){
 const allowed=entry.isDirectory()?['app','components','lib','hooks','public','scripts'].includes(entry.name):['package.json','package-lock.json','tsconfig.json','next.config.ts','next-env.d.ts','postcss.config.mjs'].includes(entry.name);
 if(allowed)await cp(join(source,entry.name),join(work,entry.name),{recursive:true,filter:p=>!/[\\/]app[\\/]api(?:[\\/]|$)/.test(p)&&!/[\\/]public[\\/]published-media(?:[\\/]|$)/.test(p)});
}
// Node resolves dependencies from the parent project; no install or copy of secrets.
const env={...process.env,HYRONIX_BUILD_ROOT:source,HYRONIX_DELIVERY_MODE:'static',NEXT_TELEMETRY_DISABLED:'1'};
for(const args of [[join(work,'scripts/prepare-static-content.mjs')],[join(source,'node_modules/next/dist/bin/next'),'build']]){
 const r=spawnSync(process.execPath,args,{cwd:work,env,stdio:'inherit',windowsHide:true});if(r.status!==0)throw Error('STATIC_BUILD_FAILED');
}
const input=JSON.parse(await readFile(join(work,'.hyronix-static/content.json'),'utf8'));
let previous;
try{previous=JSON.parse(await readFile(resolve('.hyronix-static-build.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
assert.ok(!previous||input.contentVersion>=previous.contentVersion,'STATIC_VERSION_REGRESSION');
if(process.env.HYRONIX_BUILD_CONTENT_VERSION)assert.equal(input.contentVersion,Number(process.env.HYRONIX_BUILD_CONTENT_VERSION),'STATIC_VERSION_CHANGED');
await writeFile(join(work,'out/deployment.json'),JSON.stringify({schemaVersion:1,siteKey:input.siteKey,contentVersion:input.contentVersion,generatedAt:input.generatedAt,assets:input.assets}));
await writeFile(join(work,'out/_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${env.HYRONIX_ENVIRONMENT==='staging'?'  X-Robots-Tag: noindex, nofollow\n':''}\n/published-media/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
let count=0,total=0;async function check(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await check(p);else{const b=await readFile(p);count++;total+=b.length;assert.ok(b.length<25000000,'STATIC_ASSET_LIMIT');if(/\.(?:html|js|json|txt|xml|map)$/.test(e.name))assert.ok(!/draft_value|sb_secret_[A-Za-z0-9_-]{20,}|SUPABASE_SECRET_KEY/.test(b.toString()),'PUBLIC_ARTIFACT_SECRET');}}}
await check(join(work,'out'));assert.ok(count<20000,'STATIC_ASSET_COUNT');
const slugs=['','servicios','pacientes-neurodivergentes','preguntas-frecuentes','profesionales','contacto','aviso-de-privacidad'];
for(const slug of slugs){const html=await readFile(join(work,'out',slug?slug+'.html':'index.html'),'utf8');assert.match(html,/<h1[ >]/);assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/application\/ld\+json/);assert.ok(!html.includes('/api/content/v1/media/'),'REMOTE_MEDIA_IN_STATIC_HTML');}
// Publish pointer only after all build checks. Failed runs cannot replace a known-good output.
await writeFile(resolve('.hyronix-static-build.json'),JSON.stringify({output:join(work,'out'),contentVersion:input.contentVersion,files:count,bytes:total}));
console.log(JSON.stringify({result:'STATIC_BUILD_PASS',contentVersion:input.contentVersion,files:count,bytes:total,output:join(work,'out')}));
