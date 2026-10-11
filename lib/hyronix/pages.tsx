import 'server-only';
import { Fragment, type ReactNode } from 'react';
import { getPublishedPage, mediaUrl } from './client';
import { isMedia, record, type Json } from './types';
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
export async function getPageContent(slug: string) {
  const page = await getPublishedPage(slug);
  const field = (section: string, key: string) =>
    page?.sections.find((s) => s.key === section)?.fields[key];
  function value(section: string, key: string, index?: number) {
    const v = field(section, key);
    return index === undefined
      ? v
      : Array.isArray(v)
        ? v[index]
        : typeof v === 'string'
          ? v.split('\n\n')[index]
          : undefined;
  }
  function text(
    section: string,
    key: string,
    fallback: string,
    index?: number,
  ) {
    const v = value(section, key, index);
    return typeof v === 'string' ? v : fallback;
  }
  return {
    page,
    text,
    rich(
      section: string,
      key: string,
      fallback: ReactNode,
      original: string,
      index?: number,
    ) {
      const raw = value(section, key, index);
      const v = key === 'links' && record(raw) ? raw.label : raw;
      if (typeof v !== 'string' || normalize(v) === normalize(original))
        return fallback;
      return v.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ));
    },
    list(
      section: string,
      key: string,
      fallback: string[],
      start = 0,
      end?: number,
    ) {
      const v = field(section, key);
      return Array.isArray(v) && v.every((x) => typeof x === 'string')
        ? (v.slice(start, end) as string[])
        : fallback;
    },
    link(section: string, index: number, fallback: string) {
      const v = field(section, 'links');
      const item = Array.isArray(v) ? v[index] : undefined;
      return record(item) && typeof item.label === 'string'
        ? item.label
        : fallback;
    },
    href(section: string, index: number) {
      const v = field(section, 'links');
      const item = Array.isArray(v) ? v[index] : undefined;
      if (!record(item) || typeof item.url !== 'string') return undefined;
      try {
        const u = new URL(item.url);
        return ['https:', 'mailto:', 'tel:'].includes(u.protocol)
          ? u.href
          : undefined;
      } catch {
        return undefined;
      }
    },
    media(section: string, key: string) {
      const v = field(section, key);
      return isMedia(v) ? { ...v, url: mediaUrl(v.url) ?? v.url } : undefined;
    },
    faq(fallback: { question: string; answer: string }[]) {
      const v = field('section_2', 'items');
      return Array.isArray(v) &&
        v.every(
          (x) =>
            record(x) &&
            typeof x.question === 'string' &&
            typeof x.answer === 'string',
        )
        ? (v as { question: string; answer: string }[])
        : fallback;
    },
    json(section: string, key: string, fallback: Json) {
      return field(section, key) ?? fallback;
    },
  };
}
