import 'server-only';
import { cache } from 'react';
import { isPage, record, type Page, type PublicSettings } from './types';

const TIMEOUT_MS = 1200;
export function apiOrigin() {
  const value = process.env.HYRONIX_CONTENT_API_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
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
async function request(path: string): Promise<Record<string, unknown> | null> {
  const start = Date.now();
  let status = 0;
  let fallbackUsed = true;
  try {
    const base = apiOrigin(),
      key = process.env.HYRONIX_SITE_KEY;
    if (!base || !key || !/^site_[a-f0-9]{32}$/.test(key)) return null;
    const response = await fetch(
      `${base.href.replace(/\/$/, '')}/sites/${key}${path}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: 'application/json' },
      },
    );
    status = response.status;
    if (!response.ok) return null;
    const text = await response.text();
    if (text.length > 1000000) return null;
    const value: unknown = JSON.parse(text);
    if (
      !record(value) ||
      !record(value.site) ||
      value.site.key !== key ||
      typeof value.site.content_version !== 'number'
    )
      return null;
    if (path) {
      if (
        !isPage(value.page) ||
        value.page.slug !== (path === '/pages/home' ? '/' : path.slice(6))
      )
        return null;
    } else if (
      !record(value.site_settings) ||
      !Object.values(value.site_settings).every((v) => typeof v === 'string')
    )
      return null;
    fallbackUsed = false;
    return value;
  } catch {
    return null;
  } finally {
    console.info(
      '[Hyronix]',
      JSON.stringify({
        route: path || '/settings',
        status,
        latency: Date.now() - start,
        fallbackUsed,
      }),
    );
  }
}
export const getPublishedPage = cache(
  async (slug: string): Promise<Page | null> => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
    const response = await request('/pages/' + slug);
    return (response?.page as Page | null) ?? null;
  },
);
export const getPublishedSettings = cache(
  async (): Promise<PublicSettings | null> => {
    const response = await request('');
    return (response?.site_settings as PublicSettings | null) ?? null;
  },
);
export function mediaUrl(path: string) {
  const base = apiOrigin();
  return base ? new URL(path, base.origin).href : null;
}
