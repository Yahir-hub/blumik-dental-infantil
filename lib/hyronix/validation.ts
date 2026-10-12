import { isPage, isMedia, record } from './types';
import { isSlug, routeFor } from './config';
import type { Snapshot } from './contracts';
const settingsKeys = [
  'business_name',
  'phone',
  'whatsapp',
  'email',
  'address',
  'opening_hours',
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
  'linkedin',
];
const forbidden = new Set([
  'draft_value',
  'storage_path',
  'password',
  'secret',
  'access_token',
  'refresh_token',
  'users',
  'audit_logs',
  '__proto__',
  'constructor',
  'prototype',
]);
export function publicOnly(value: unknown, depth = 0): boolean {
  if (depth > 16) return false;
  if (typeof value === 'string')
    return !/sb_secret_|eyJ[A-Za-z0-9_-]+\.eyJ/.test(value);
  if (Array.isArray(value))
    return value.length <= 1000 && value.every((v) => publicOnly(v, depth + 1));
  if (record(value)) {
    if (
      ('mime_type' in value || ('id' in value && 'url' in value)) &&
      !isMedia(value)
    )
      return false;
    return Object.entries(value).every(
      ([k, v]) => !forbidden.has(k) && publicOnly(v, depth + 1),
    );
  }
  return (
    value === null ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}
export function validatedSnapshot(
  value: unknown,
  site: string,
  resource: string,
  etag: string | null,
  now = Date.now(),
): Snapshot | null {
  if (
    !record(value) ||
    !publicOnly(value) ||
    !record(value.site) ||
    value.site.key !== site ||
    !Number.isSafeInteger(value.site.content_version) ||
    Number(value.site.content_version) < 1 ||
    typeof value.site.updated_at !== 'string' ||
    !Number.isFinite(Date.parse(value.site.updated_at))
  )
    return null;
  let data: Snapshot['data'];
  if (resource === 'settings') {
    if (
      !record(value.site_settings) ||
      !Object.values(value.site_settings).every((v) => typeof v === 'string')
    )
      return null;
    const settings = value.site_settings as Record<string, string>;
    data = {
      site_settings: Object.fromEntries(
        settingsKeys
          .filter((k) => typeof settings[k] === 'string')
          .map((k) => [k, settings[k]]),
      ),
    };
  } else {
    if (
      !isSlug(resource) ||
      !isPage(value.page) ||
      value.page.slug !== routeFor(resource) ||
      !value.page.sections.length ||
      !value.page.seo ||
      !value.page.seo.meta_title.trim() ||
      !value.page.seo.meta_description.trim()
    )
      return null;
    // Project exact public contract, excluding unexpected top-level transport properties.
    data = {
      page: {
        name: value.page.name,
        slug: value.page.slug,
        sections: value.page.sections.map((s) => ({
          key: s.key,
          name: s.name,
          type: s.type,
          fields: s.fields,
        })),
        seo: value.page.seo,
      },
    };
  }
  return {
    schemaVersion: 1,
    siteKey: site,
    resource,
    contentVersion: Number(value.site.content_version),
    updatedAt: value.site.updated_at,
    validatedAt: new Date(now).toISOString(),
    etag: etag?.slice(0, 200) ?? null,
    data,
  };
}
export function validStored(
  value: unknown,
  site: string,
  resource: string,
): value is Snapshot {
  if (
    !record(value) ||
    value.schemaVersion !== 1 ||
    value.siteKey !== site ||
    value.resource !== resource ||
    !record(value.data)
  )
    return false;
  return !!validatedSnapshot(
    {
      site: {
        key: site,
        content_version: value.contentVersion,
        updated_at: value.updatedAt,
      },
      ...value.data,
    },
    site,
    resource,
    null,
  );
}
