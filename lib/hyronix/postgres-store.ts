import type { Reservation, Snapshot, SnapshotStore, WebhookEvent, WebhookReplayStore } from './contracts';
import { validStored } from './validation';
import { readBounded } from './loader';

/** Shared PostgreSQL RPC adapter. Only a scoped staging capability, never an admin key. */
export class PostgresStore implements SnapshotStore, WebhookReplayStore {
  private endpoint: string;
  constructor(private config: { url: string; publishableKey: string; token: string; namespace: string; site: string }, private fetcher: typeof fetch = (input, init) => fetch(input, init)) {
    const url = new URL(config.url);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' ||
      !config.publishableKey.startsWith('sb_publishable_') || config.token.length < 32 ||
      !/^[a-z0-9-]{1,60}$/.test(config.namespace) || !/^site_[a-f0-9]{32}$/.test(config.site)) throw Error('INVALID_STORE_CONFIG');
    this.endpoint = new URL('/rest/v1/rpc/hyronix_staging_store', url).href;
  }
  private async rpc(operation: string, input: Record<string, unknown>): Promise<unknown> {
    let response: Response;
    try { response = await this.fetcher(this.endpoint, {
      method: 'POST', cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(2500),
      headers: { 'Content-Type': 'application/json', apikey: this.config.publishableKey, 'x-hyronix-store-token': this.config.token },
      body: JSON.stringify({ operation, input: { ...input, namespace: this.config.namespace } }),
    }); } catch (error) { throw Error(error instanceof TypeError ? 'STORE_TRANSPORT_TYPE_ERROR' : 'STORE_TRANSPORT_FAILED'); }
    if (!response.ok) { await response.body?.cancel(); throw Error('DURABLE_STORE_UNAVAILABLE'); }
    let body: string;
    try { body = await readBounded(response, 1100000); } catch { throw Error('STORE_BODY_READ_FAILED'); }
    try { return JSON.parse(body); } catch { throw Error('STORE_JSON_INVALID'); }
  }
  private scope(site: string) { if (site !== this.config.site) throw Error('STORE_SITE_MISMATCH'); }
  async get(site: string, resource: string): Promise<Snapshot | null> {
    this.scope(site);
    const started=Date.now();
    const value = await this.rpc('get', { resource }).finally(()=>{
      if(process.env.HYRONIX_ENVIRONMENT==='staging')console.info('[Hyronix timing]',JSON.stringify({operation:'snapshot_read',resource,start:started,ms:Date.now()-started}));
    });
    if (value === null) return null;
    if (!validStored(value, site, resource)) throw Error('INVALID_STORED_SNAPSHOT');
    return value;
  }
  async set(snapshot: Snapshot): Promise<Snapshot> {
    this.scope(snapshot.siteKey);
    if (!validStored(snapshot, this.config.site, snapshot.resource)) throw Error('INVALID_SNAPSHOT');
    const value = await this.rpc('set', { snapshot });
    if (!validStored(value, this.config.site, snapshot.resource)) throw Error('INVALID_STORED_SNAPSHOT');
    return value;
  }
  async begin(event: WebhookEvent, digest: string, resources: string[], _now: number): Promise<Reservation> {
    this.scope(event.site_key);
    const value = await this.rpc('begin', { event_id: event.event_id, digest, resources, version: event.content_version });
    if (!value || typeof value !== 'object' || !('status' in value)) throw Error('INVALID_RESERVATION');
    if (value.status === 'accepted' && 'token' in value && typeof value.token === 'string') return value as Reservation;
    if (['duplicate', 'obsolete', 'busy', 'limited', 'conflict'].includes(String(value.status))) return value as Reservation;
    throw Error('INVALID_RESERVATION');
  }
  async complete(event: WebhookEvent, token: string, _resources: string[], _now: number) {
    this.scope(event.site_key);
    await this.rpc('complete', { event_id: event.event_id, token });
  }
  async release(event: WebhookEvent, token: string) {
    this.scope(event.site_key);
    await this.rpc('release', { event_id: event.event_id, token });
  }
}
