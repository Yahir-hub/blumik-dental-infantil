import type { Page, PublicSettings } from './types';
export type Snapshot = {
  schemaVersion: 1;
  siteKey: string;
  resource: string;
  contentVersion: number;
  updatedAt: string;
  validatedAt: string;
  etag: string | null;
  data: { page: Page } | { site_settings: PublicSettings };
};
export interface SnapshotStore {
  get(site: string, resource: string): Promise<Snapshot | null>;
  /** Atomic compare-and-set. Return the winner; never replace a higher version. */
  set(snapshot: Snapshot): Promise<Snapshot>;
}
export type WebhookEvent = {
  event_id: string;
  site_key: string;
  content_version: number;
  published_at: string;
  affected_slugs: string[];
  event_type:
    | 'content.published'
    | 'settings.updated'
    | 'post.published'
    | 'media.updated';
};
export type Reservation =
  | { status: 'accepted'; token: string }
  | {
      status: 'duplicate' | 'obsolete' | 'busy' | 'limited' | 'conflict';
      retryAfter?: number;
    };
export interface WebhookReplayStore {
  /** Atomic idempotency, per-resource ordering, lease and token bucket. */
  begin(
    event: WebhookEvent,
    digest: string,
    resources: string[],
    now: number,
  ): Promise<Reservation>;
  complete(
    event: WebhookEvent,
    token: string,
    resources: string[],
    now: number,
  ): Promise<void>;
  release(event: WebhookEvent, token: string): Promise<void>;
}
