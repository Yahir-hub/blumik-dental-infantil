// Temporary, version-scoped OpenNext 1.20.10 / Next 16.4 compatibility.
// Next moved preview props into a server-only JSON manifest. Inline it using
// the adapter's existing manifest mechanism; never copy it to public assets.
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root = process.cwd();
const adapter = JSON.parse(await readFile(resolve(root, 'node_modules/@opennextjs/cloudflare/package.json'), 'utf8'));
const next = JSON.parse(await readFile(resolve(root, 'node_modules/next/package.json'), 'utf8'));
if (adapter.version !== '1.20.10' || next.version !== '16.4.0') {
  throw new Error('Review OpenNext compatibility patch before changing dependency versions');
}
const file = resolve(root, 'node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js');
const source = await readFile(file, 'utf8');
const before = '**/{*-manifest,required-server-files,prefetch-hints}.json';
const after = '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json';
if (!source.includes(after)) {
  if (source.split(before).length !== 2) throw new Error('Unexpected adapter source; patch refused');
  await writeFile(file, source.replace(before, after));
}
console.log('OpenNext Next 16.4 manifest compatibility: ready');
// Staging receives all runtime configuration from provider bindings. The
// adapter otherwise copies every .env.local value into a server bundle.
const envFile=resolve(root,'node_modules/@opennextjs/cloudflare/dist/cli/build/open-next/compile-env-files.js');
const envSource=await readFile(envFile,'utf8');
const envBefore='JSON.stringify(extractProjectEnvVars(mode, buildOpts))';
const envAfter='JSON.stringify({}) /* runtime provider bindings only */';
if(!envSource.includes(envAfter)) {
  if(envSource.split(envBefore).length!==2)throw Error('Unexpected adapter environment source; patch refused');
  await writeFile(envFile,envSource.replace(envBefore,envAfter));
}
