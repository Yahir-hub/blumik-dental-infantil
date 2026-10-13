import 'server-only';
import type { Metadata } from 'next';
import { getPublishedPage, mediaUrl } from './client';
import { siteConfig } from '@/app/site-config';
import { isStaging } from './environment';
export async function publishedMetadata(
  slug: string,
  fallback: Metadata,
): Promise<Metadata> {
  const seo = (await getPublishedPage(slug))?.seo;
  if (!seo) return isStaging() ? { ...fallback, robots: { index: false, follow: false } } : fallback;
  const canonical = siteConfig.url + (slug === 'home' ? '/' : '/' + slug);
  const image = seo.opengraph.image ? mediaUrl(seo.opengraph.image.url) : null;
  return {
    ...fallback,
    title: { absolute: seo.meta_title },
    description: seo.meta_description,
    alternates: { canonical },
    robots: { index: !isStaging() && seo.robots.index, follow: !isStaging() && seo.robots.follow },
    openGraph: {
      ...fallback.openGraph,
      title: seo.opengraph.title || seo.meta_title,
      description: seo.opengraph.description || seo.meta_description,
      url: canonical,
      ...(image
        ? { images: [{ url: image, alt: seo.opengraph.image!.alt }] }
        : {}),
    },
    twitter: {
      ...fallback.twitter,
      card: 'summary_large_image',
      title: seo.opengraph.title || seo.meta_title,
      description: seo.opengraph.description || seo.meta_description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
