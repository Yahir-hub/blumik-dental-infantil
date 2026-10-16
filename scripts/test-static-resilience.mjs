// Local fixtures cloned from validated public content. Does not claim a real CMS publish.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {spawn} from 'node:child_process';
const original=await readFile('.hyronix-static-build.json','utf8'),a=JSON.parse(original);
const manifest=JSON.parse(await readFile(join(dirname(a.output),'.hyronix-static/content.json'),'utf8'));
const marker='HYRONIX_STATIC_FIXTURE_B';let mode='B';
const api=createServer(async(req,res)=>{
 try{
  if(mode==='down'){res.writeHead(503);res.end();return;}
  if(mode==='corrupt'){res.setHeader('Content-Type','application/json');res.end('{invalid');return;}
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname.startsWith('/api/content/v1/media/')){
   const file=manifest.media[url.pathname+url.search];assert.ok(file);
   const ext=file.split('.').at(-1);res.setHeader('Content-Type',{png:'image/png',jpg:'image/jpeg',webp:'image/webp',avif:'image/avif'}[ext]);res.end(await readFile(join(a.output,file)));return;
  }
  const resource=url.pathname.includes('/pages/')?url.pathname.split('/').at(-1):'settings';
  const snapshot=structuredClone(manifest.snapshots[resource]);assert.ok(snapshot);
  if(mode==='B'&&resource==='home')snapshot.data.page.sections.find(s=>s.key==='hero').fields.content=marker+' '+snapshot.data.page.sections.find(s=>s.key==='hero').fields.content;
  const version=mode==='old'?manifest.contentVersion-1:manifest.contentVersion+1;
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify({site:{key:manifest.siteKey,content_version:version,updated_at:snapshot.updatedAt},...snapshot.data}));
 }catch{res.writeHead(500);res.end();}
});
await new Promise(r=>api.listen(0,'127.0.0.1',r));
const env={...process.env,HYRONIX_STATIC_TEST:'1',HYRONIX_ENVIRONMENT:'staging',HYRONIX_SITE_KEY:manifest.siteKey,HYRONIX_CONTENT_API_URL:`http://127.0.0.1:${api.address().port}/api/content/v1`};
async function build(){const p=spawn(process.execPath,['scripts/build-static.mjs'],{env,stdio:['ignore','pipe','pipe']});p.stdout.resume();p.stderr.resume();return new Promise((r,j)=>{p.on('error',j);p.on('exit',r);});}
const checks=[];
try{
 assert.equal(await build(),0,'B build');const b=await readFile('.hyronix-static-build.json','utf8'),out=JSON.parse(b).output;
 assert.match(await readFile(join(out,'index.html'),'utf8'),new RegExp(marker));checks.push('new B in initial HTML');
 mode='down';assert.equal(await build(),1);assert.equal(await readFile('.hyronix-static-build.json','utf8'),b);assert.match(await readFile(join(out,'index.html'),'utf8'),new RegExp(marker));checks.push('API outage retains B artifact');
 mode='corrupt';assert.equal(await build(),1);assert.equal(await readFile('.hyronix-static-build.json','utf8'),b);checks.push('corrupt response cannot replace B');
 mode='old';assert.equal(await build(),1);assert.equal(await readFile('.hyronix-static-build.json','utf8'),b);checks.push('older version cannot replace B');
 // Explicit rollback selects saved A bytes, without fetching or rebuilding.
 await writeFile('.hyronix-static-build.json',original);assert.ok(!(await readFile(join(a.output,'index.html'),'utf8')).includes(marker));checks.push('local rollback selects retained A without build');
 await writeFile('.static-build/resilience-results.json',JSON.stringify({date:new Date().toISOString(),scope:'local controlled API fixtures, no real CMS publication or provider rollback claimed',checks,status:'PASS'},null,2));console.log('PASS '+checks.join('; '));
}finally{await writeFile('.hyronix-static-build.json',original);await new Promise(r=>api.close(r));}
