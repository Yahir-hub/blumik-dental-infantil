import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import d1Tags from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache';
import type { IncrementalCache } from '@opennextjs/aws/types/overrides.js';

// KV is only a regenerable Next cache. PostgreSQL owns authoritative snapshots/CAS.
// SSR/Data Cache refresh is handled within the request; no full-page ISR queue.
const observedCache: IncrementalCache = {
  name: kvCache.name,
  async get(key, type) {
    const entry = await kvCache.get(key, type);
    if (type === 'fetch') console.info('[Hyronix cache]', JSON.stringify({ operation: 'get', hit: !!entry, ageMs: entry?.lastModified ? Date.now() - entry.lastModified : null, clockDelta: performance.timeOrigin + performance.now() - Date.now() }));
    return entry;
  },
  async set(key, value, type) {
    await kvCache.set(key, value, type);
    if (type === 'fetch') console.info('[Hyronix cache]', JSON.stringify({ operation: 'set' }));
  },
  delete: (key) => kvCache.delete(key),
};
export default defineCloudflareConfig({ incrementalCache: observedCache, tagCache: d1Tags, queue: 'direct' });
