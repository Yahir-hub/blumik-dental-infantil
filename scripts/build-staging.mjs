import {spawnSync} from 'node:child_process';
// Keep the staging alias/noindex deterministic on Windows and Unix alike.
const env={...process.env,HYRONIX_ENVIRONMENT:'staging'};
for(const args of [
 ['scripts/patch-opennext.mjs'],
 ['node_modules/@opennextjs/cloudflare/dist/cli/index.js','build'],
 ['scripts/sanitize-staging-build.mjs'],
]) {
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit',windowsHide:true});
 if(result.error||result.status!==0)process.exit(result.status||1);
}
