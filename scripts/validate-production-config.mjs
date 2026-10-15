import {readFile} from 'node:fs/promises';
import {guardEnvironment} from './guard-environment.mjs';
const file=process.argv[2]??'wrangler.production.jsonc';
const config=JSON.parse(await readFile(file,'utf8'));
guardEnvironment({...process.env,...config.vars,HYRONIX_ENVIRONMENT:'production'},config);
if(/REPLACE_|<placeholder>/.test(JSON.stringify(config)))throw Error('PRODUCTION_TEMPLATE_NOT_CONFIGURED');
console.log('Production provider configuration isolated; no deployment performed');
