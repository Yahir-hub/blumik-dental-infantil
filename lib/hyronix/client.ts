import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { connection } from 'next/server';
import { type Page, type PublicSettings } from './types';
import { isSlug, revalidateSeconds, tagsFor } from './config';
import { snapshotStore } from './stores';
import { refreshSnapshot } from './loader';
import type { Snapshot } from './contracts';

export function apiOrigin() {
  // Runtime rollback switch; returns original JSX/settings/assets on all routes.
  if (process.env.HYRONIX_ENABLED === 'false') return null;
  const value = process.env.HYRONIX_CONTENT_API_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    const fault = process.env.HYRONIX_STAGING_API_MODE;
    if (process.env.HYRONIX_ENVIRONMENT === 'staging' && ['unavailable','corrupt'].includes(fault ?? ''))
      url.pathname = `/__staging_harness/${fault}/api/content/v1`;
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.pathname.replace(/\/$/, '').endsWith('/api/content/v1')
    )
      return null;
    if (
      url.protocol !== 'https:' &&
      !(
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)
      )
    )
      return null;
    return url;
  } catch {
    return null;
  }
}
export async function loadResource(resource: string): Promise<Snapshot | null> {
  const base = apiOrigin(),
    key = process.env.HYRONIX_SITE_KEY;
  if (
    !base ||
    !key ||
    !/^site_[a-f0-9]{32}$/.test(key) ||
    (resource !== 'settings' && !isSlug(resource))
  )
    return null;
  const started = Date.now();
  try {
    const store = snapshotStore();
    const snapshot = await unstable_cache(
      () => refreshSnapshot(base.href, key, resource, store),
      ['hyronix-v2', base.href, key, resource],
      { revalidate: revalidateSeconds(), tags: tagsFor(key, resource) },
    )();
    const latest = await store.get(key, resource);
    return latest && latest.contentVersion > snapshot.contentVersion
      ? latest
      : snapshot;
  } catch {
    try {
      const snapshot = await snapshotStore().get(key, resource);
      console.info(
        '[Hyronix]',
        JSON.stringify({
          route: resource,
          latency: Date.now() - started,
          fallbackUsed: snapshot ? 'snapshot' : 'original',
        }),
      );
      return snapshot;
    } catch (error) {
      const code = error instanceof Error && ['STORE_TRANSPORT_TYPE_ERROR','STORE_TRANSPORT_FAILED','STORE_BODY_READ_FAILED','STORE_JSON_INVALID','INVALID_STORE_CONFIG','DURABLE_STORE_UNAVAILABLE','DURABLE_STORE_NOT_CONFIGURED','LOCAL_STORE_DISABLED_IN_STAGING','EMPTY_BODY','INVALID_STORED_SNAPSHOT'].includes(error.message) ? error.message : 'STORE_READ_FAILED';
      console.warn('[Hyronix store]', JSON.stringify({ route: resource, result: code }));
      return null;
    }
  }
}
export async function prewarmResources(resources: string[]) {
  const base = apiOrigin(),
    key = process.env.HYRONIX_SITE_KEY;
  if (!base || !key) return false;
  const results = await Promise.allSettled(
    resources.map((resource) =>
      refreshSnapshot(base.href, key, resource, snapshotStore()),
    ),
  );
  return results.every((r) => r.status === 'fulfilled');
}
export const getPublishedPage = cache(
  async (slug: string): Promise<Page | null> => {
    await connection();
    if (!isSlug(slug)) return null;
    const snapshot = await loadResource(slug);
    return snapshot && 'page' in snapshot.data ? snapshot.data.page : null;
  },
);
export const getPublishedSettings = cache(
  async (): Promise<PublicSettings | null> => {
    await connection();
    const snapshot = await loadResource('settings');
    return snapshot && 'site_settings' in snapshot.data
      ? snapshot.data.site_settings
      : null;
  },
);
export function mediaUrl(path: string) {
  const base = apiOrigin();
  // The controlled staging outage also exercises the existing image onError
  // fallback. This fixed fixture returns 503 and never accesses real media.
  if (base && process.env.HYRONIX_ENVIRONMENT === 'staging' && process.env.HYRONIX_STAGING_API_MODE === 'unavailable')
    return new URL(`${base.pathname}/sites/${process.env.HYRONIX_SITE_KEY}/pages/home`, base.origin).href;
  return base ? new URL(path, base.origin).href : null;
}
