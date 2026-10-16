import 'server-only';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Snapshot } from './contracts';
import { validStored } from './validation';

type StaticContent = {siteKey:string; contentVersion:number; snapshots:Record<string,Snapshot>; media:Record<string,string>};
// Immutable input of one build, never a distributed runtime cache.
let input: StaticContent | undefined;
function manifest() {
  if(process.env.HYRONIX_DELIVERY_MODE!=='static')throw Error('STATIC_BUILD_ONLY');
  if(!input){
    const parsed=JSON.parse(readFileSync(resolve('.hyronix-static/content.json'),'utf8')) as StaticContent;
    if(!parsed||parsed.siteKey!==process.env.HYRONIX_SITE_KEY||!Number.isSafeInteger(parsed.contentVersion)||parsed.contentVersion<1||!parsed.snapshots||!parsed.media)throw Error('INVALID_STATIC_MANIFEST');
    for(const [resource,snapshot]of Object.entries(parsed.snapshots))
      if(!validStored(snapshot,parsed.siteKey,resource)||snapshot.contentVersion!==parsed.contentVersion)throw Error('INVALID_STATIC_SNAPSHOT');
    input=parsed;
  }
  return input;
}
export function staticResource(resource:string): Snapshot {
  const snapshot=manifest().snapshots[resource];
  if(!snapshot)throw Error('STATIC_RESOURCE_MISSING');
  return snapshot;
}
export function staticMedia(path:string):string {
  const mapped=manifest().media[path];
  if(!mapped||!/^\/published-media\/[a-f0-9]{64}\.(png|jpg|webp|avif)$/.test(mapped))throw Error('STATIC_MEDIA_MISSING');
  return mapped;
}
