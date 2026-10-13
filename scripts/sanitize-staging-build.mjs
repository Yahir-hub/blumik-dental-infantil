import {readdir,readFile,unlink} from 'node:fs/promises';
import {resolve,join,basename} from 'node:path';
try {process.loadEnvFile('.env.local');} catch {}
const secrets=Object.entries(process.env).filter(([key,value])=>/SECRET|PASSWORD|TOKEN/.test(key)&&value?.length>=20).map(([,value])=>value);
let files=0,removed=0;
async function scan(dir) {
  for(const item of await readdir(dir,{withFileTypes:true})) {
    const path=join(dir,item.name);
    if(item.isSymbolicLink())continue;
    if(item.isDirectory()){await scan(path);continue;}
    if(!item.isFile())continue;
    if(/^\.env(?:\.|$)/.test(basename(path))){await unlink(path);removed++;continue;}
    const content=await readFile(path);files++;
    if(secrets.some(secret=>content.includes(Buffer.from(secret))))throw Error('SECRET_IN_GENERATED_ARTIFACT: '+path);
  }
}
for(const dir of ['.next','.open-next'])await scan(resolve(dir));
console.log(JSON.stringify({stagingArtifactsChecked:files,copiedEnvFilesRemoved:removed,secretsFound:false}));
