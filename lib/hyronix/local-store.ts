import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type {
  Snapshot,
  SnapshotStore,
  WebhookEvent,
  WebhookReplayStore,
  Reservation,
} from './contracts';
import { validStored } from './validation';

/** Local/test adapter only. SQLite transactions synchronize processes on ONE persistent host. */
export class LocalStore implements SnapshotStore, WebhookReplayStore {
  private db: DatabaseSync;
  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=3000; PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS snapshots(site TEXT,resource TEXT,version INTEGER,payload TEXT NOT NULL,PRIMARY KEY(site,resource));
      CREATE TABLE IF NOT EXISTS events(site TEXT,id TEXT,digest TEXT,state TEXT,token TEXT,until_ms INTEGER,PRIMARY KEY(site,id));
      CREATE TABLE IF NOT EXISTS versions(site TEXT,resource TEXT,version INTEGER,PRIMARY KEY(site,resource));
      CREATE TABLE IF NOT EXISTS limits(site TEXT PRIMARY KEY,tokens REAL,at_ms INTEGER,event_id TEXT,until_ms INTEGER);`);
  }
  close() {
    this.db.close();
  }
  private transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn();
      this.db.exec('COMMIT');
      return result;
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }
  }
  private read(site: string, resource: string): Snapshot | null {
    const row = this.db
      .prepare('SELECT payload FROM snapshots WHERE site=? AND resource=?')
      .get(site, resource);
    try {
      const value = JSON.parse(String(row?.payload));
      return validStored(value, site, resource) ? value : null;
    } catch {
      return null;
    }
  }
  async get(site: string, resource: string) {
    return this.read(site, resource);
  }
  async set(snapshot: Snapshot) {
    if (!validStored(snapshot, snapshot.siteKey, snapshot.resource))
      throw Error('INVALID_SNAPSHOT');
    return this.transaction(() => {
      const old = this.read(snapshot.siteKey, snapshot.resource);
      if (old && old.contentVersion >= snapshot.contentVersion) return old;
      this.db
        .prepare(
          'INSERT INTO snapshots VALUES(?,?,?,?) ON CONFLICT(site,resource) DO UPDATE SET version=excluded.version,payload=excluded.payload',
        )
        .run(
          snapshot.siteKey,
          snapshot.resource,
          snapshot.contentVersion,
          JSON.stringify(snapshot),
        );
      return snapshot;
    });
  }
  async begin(
    event: WebhookEvent,
    digest: string,
    resources: string[],
    now: number,
  ): Promise<Reservation> {
    return this.transaction(() => {
      const { site_key: site, event_id: id } = event;
      // Retain idempotency records 7 days; version high-water marks have no TTL.
      this.db
        .prepare("DELETE FROM events WHERE until_ms < ? AND state='done'")
        .run(now - 7 * 86400000);
      const seen = this.db
        .prepare('SELECT * FROM events WHERE site=? AND id=?')
        .get(site, id);
      if (seen && seen.digest !== digest) return { status: 'conflict' };
      if (seen?.state === 'done') return { status: 'duplicate' };
      if (seen && Number(seen.until_ms) > now)
        return { status: 'busy', retryAfter: 2 };
      if (
        resources.every(
          (resource) =>
            Number(
              this.db
                .prepare(
                  'SELECT version FROM versions WHERE site=? AND resource=?',
                )
                .get(site, resource)?.version ?? 0,
            ) >= event.content_version,
        )
      ) {
        this.db.prepare("INSERT INTO events VALUES(?,?,?,'done',NULL,?) ON CONFLICT(site,id) DO UPDATE SET state='done',token=NULL,until_ms=excluded.until_ms").run(site,id,digest,now);
        return { status: 'obsolete' };
      }
      const limit = this.db
        .prepare('SELECT * FROM limits WHERE site=?')
        .get(site);
      if (limit?.event_id && Number(limit.until_ms) > now)
        return { status: 'busy', retryAfter: 2 };
      const tokens = limit
        ? Math.min(
            10,
            Number(limit.tokens) + (now - Number(limit.at_ms)) * 0.0005,
          )
        : 10;
      if (tokens < 1)
        return { status: 'limited', retryAfter: Math.ceil((1 - tokens) / 0.5) };
      const token = randomUUID(),
        until = now + 30000;
      this.db
        .prepare(
          'INSERT INTO limits VALUES(?,?,?,?,?) ON CONFLICT(site) DO UPDATE SET tokens=excluded.tokens,at_ms=excluded.at_ms,event_id=excluded.event_id,until_ms=excluded.until_ms',
        )
        .run(site, tokens - 1, now, id, until);
      this.db
        .prepare(
          "INSERT INTO events VALUES(?,?,?,'processing',?,?) ON CONFLICT(site,id) DO UPDATE SET state='processing',token=excluded.token,until_ms=excluded.until_ms",
        )
        .run(site, id, digest, token, until);
      return { status: 'accepted', token };
    });
  }
  async complete(
    event: WebhookEvent,
    token: string,
    resources: string[],
    now: number,
  ) {
    this.transaction(() => {
      const changed = this.db
        .prepare(
          "UPDATE events SET state='done',until_ms=? WHERE site=? AND id=? AND token=? AND state='processing'",
        )
        .run(now, event.site_key, event.event_id, token);
      if (!changed.changes) throw Error('LEASE_LOST');
      for (const resource of resources)
        this.db
          .prepare(
            'INSERT INTO versions VALUES(?,?,?) ON CONFLICT(site,resource) DO UPDATE SET version=max(version,excluded.version)',
          )
          .run(event.site_key, resource, event.content_version);
      this.db
        .prepare(
          'UPDATE limits SET event_id=NULL,until_ms=0 WHERE site=? AND event_id=?',
        )
        .run(event.site_key, event.event_id);
    });
  }
  async release(event: WebhookEvent, token: string) {
    this.transaction(() => {
      const changed = this.db
        .prepare(
          "DELETE FROM events WHERE site=? AND id=? AND token=? AND state='processing'",
        )
        .run(event.site_key, event.event_id, token);
      if (changed.changes)
        this.db
          .prepare(
            'UPDATE limits SET event_id=NULL,until_ms=0 WHERE site=? AND event_id=?',
          )
          .run(event.site_key, event.event_id);
    });
  }
}
