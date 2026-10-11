export type Json =
  | null
  | string
  | number
  | boolean
  | Json[]
  | { [key: string]: Json };
export type Media = {
  id: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  mime_type: string;
};
export type Seo = {
  meta_title: string;
  meta_description: string;
  canonical: string | null;
  robots: { index: boolean; follow: boolean };
  opengraph: {
    title: string | null;
    description: string | null;
    image: Media | null;
  };
  schema: Json;
};
export type Page = {
  name: string;
  slug: string;
  sections: {
    key: string;
    name: string;
    type: string;
    fields: Record<string, Json>;
  }[];
  seo: Seo | null;
};
export type PublicSettings = Record<string, string>;
export const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
export function isMedia(value: unknown): value is Media {
  return (
    record(value) &&
    typeof value.id === 'string' &&
    /^media_[a-f0-9]{32}$/.test(value.id) &&
    typeof value.url === 'string' &&
    new RegExp('^/api/content/v1/media/' + value.id + '\\?v=[1-9][0-9]*$').test(
      value.url,
    ) &&
    typeof value.alt === 'string' &&
    typeof value.mime_type === 'string' &&
    /^image\/(jpeg|png|webp|avif)$/.test(value.mime_type) &&
    [value.width, value.height].every(
      (v) =>
        v === null || (typeof v === 'number' && Number.isFinite(v) && v > 0),
    )
  );
}
function json(value: unknown, depth = 0): value is Json {
  if (depth > 12) return false;
  if (value === null || typeof value === 'boolean' || typeof value === 'string')
    return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value))
    return value.length <= 1000 && value.every((v) => json(v, depth + 1));
  return (
    record(value) &&
    Object.entries(value).every(
      ([k, v]) =>
        ![
          '__proto__',
          'constructor',
          'prototype',
          'draft_value',
          'storage_path',
        ].includes(k) && json(v, depth + 1),
    )
  );
}
export function isSeo(value: unknown): value is Seo {
  if (
    !record(value) ||
    typeof value.meta_title !== 'string' ||
    typeof value.meta_description !== 'string' ||
    !(value.canonical === null || typeof value.canonical === 'string')
  )
    return false;
  return (
    record(value.robots) &&
    typeof value.robots.index === 'boolean' &&
    typeof value.robots.follow === 'boolean' &&
    record(value.opengraph) &&
    [value.opengraph.title, value.opengraph.description].every(
      (v) => v === null || typeof v === 'string',
    ) &&
    (value.opengraph.image === null || isMedia(value.opengraph.image)) &&
    json(value.schema)
  );
}
export function isPage(value: unknown): value is Page {
  return (
    record(value) &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    Array.isArray(value.sections) &&
    value.sections.length <= 100 &&
    (value.seo === null || isSeo(value.seo)) &&
    value.sections.every(
      (s) =>
        record(s) &&
        typeof s.key === 'string' &&
        typeof s.name === 'string' &&
        typeof s.type === 'string' &&
        record(s.fields) &&
        json(s.fields),
    )
  );
}
