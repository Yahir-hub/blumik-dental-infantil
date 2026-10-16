import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const root=resolve('.hyronix-static');await mkdir(root,{recursive:true});
// Reuse the exact public validation contract used by the certified SSR client.
for(const name of ['types','config','validation']){
 const source=await readFile(`lib/hyronix/${name}.ts`,'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/from '(\.\/[^']+)'/g,"from '$1.mjs'");
 await writeFile(`${root}/${name}.mjs`,js);
}
const {validatedSnapshot}=await import(pathToFileURL(`${root}/validation.mjs`));
const {SLUGS}=await import(pathToFileURL(`${root}/config.mjs`));
const key=process.env.HYRONIX_SITE_KEY,origin=new URL(process.env.HYRONIX_CONTENT_API_URL);
assert.match(key??'',/^site_[a-f0-9]{32}$/);
assert.ok(origin.protocol==='https:'||(process.env.HYRONIX_STATIC_TEST==='1'&&origin.hostname==='127.0.0.1'));
assert.ok(!origin.username&&!origin.password&&!origin.search&&!origin.hash&&['/api/content/v1','/functions/v1/content-api/api/content/v1'].includes(origin.pathname));
const apiPrefix=origin.pathname.slice(0,-'/api/content/v1'.length);
async function bounded(response,limit){
 assert.ok(Number(response.headers.get('content-length')??0)<=limit,'BODY_LIMIT');
 const chunks=[];let size=0;for await(const bytes of response.body){size+=bytes.length;assert.ok(size<=limit,'BODY_LIMIT');chunks.push(bytes);}return Buffer.concat(chunks);
}
async function json(resource){
 const r=await fetch(`${origin.href}/sites/${key}${resource==='settings'?'':'/pages/'+resource}`,{redirect:'error',signal:AbortSignal.timeout(15000)});
 assert.equal(r.status,200,'CONTENT_API_UNAVAILABLE');assert.match(r.headers.get('content-type')??'',/application\/json/);
 const value=JSON.parse((await bounded(r,1000000)).toString('utf8'));
 const snapshot=validatedSnapshot(value,key,resource,r.headers.get('etag'));assert.ok(snapshot,'INVALID_PUBLISHED_CONTENT');return snapshot;
}
const snapshots={};snapshots.settings=await json('settings');const version=snapshots.settings.contentVersion;
// Bounded, no mixed versions: discard build if a publication races acquisition.
for(let i=0;i<SLUGS.length;i+=3)await Promise.all(SLUGS.slice(i,i+3).map(async slug=>{snapshots[slug]=await json(slug);assert.equal(snapshots[slug].contentVersion,version,'PUBLICATION_CHANGED_DURING_BUILD');}));
const references=new Map();
function visit(v){if(v&&typeof v==='object'){if(typeof v.url==='string'&&v.url.startsWith('/api/content/v1/media/'))references.set(v.url,v.mime_type);for(const value of Object.values(v))visit(value);}}
Object.values(snapshots).forEach(visit);assert.ok(references.size<=300,'MEDIA_COUNT_LIMIT');
await mkdir('public/published-media',{recursive:true});const media={},assets=[];let total=0;
for(const [path,mime]of references){
 assert.match(path,/^\/api\/content\/v1\/media\/media_[a-f0-9]{32}\?v=[1-9][0-9]*$/);
 const r=await fetch(new URL(apiPrefix+path,origin.origin),{redirect:'error',signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,'PUBLISHED_MEDIA_UNAVAILABLE');
 const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/avif':'avif'}[mime];assert.ok(ext&&r.headers.get('content-type')?.split(';')[0]===mime,'INVALID_MEDIA_MIME');
 const bytes=await bounded(r,10485760);total+=bytes.length;assert.ok(total<=25000000&&bytes.length>8,'MEDIA_BUDGET');
 const valid=ext==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==='jpg'?bytes[0]===255&&bytes[1]===216:ext==='webp'?bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP':bytes.subarray(4,8).toString()==='ftyp';assert.ok(valid,'INVALID_MEDIA_BYTES');
 const sha=createHash('sha256').update(bytes).digest('hex'),file=`/published-media/${sha}.${ext}`;await writeFile('public'+file,bytes);media[path]=file;assets.push({path:file,sha256:sha,bytes:bytes.length});
}
assert.equal((await json('settings')).contentVersion,version,'PUBLICATION_CHANGED_DURING_BUILD');
const manifest={schemaVersion:1,siteKey:key,contentVersion:version,generatedAt:new Date().toISOString(),snapshots,media,assets};
await writeFile(root+'/content.json',JSON.stringify(manifest));
console.log(JSON.stringify({result:'VALIDATED_STATIC_INPUT',contentVersion:version,pages:SLUGS.length,assets:assets.length,mediaBytes:total}));
