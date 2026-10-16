import type { MetadataRoute } from 'next';
import { siteConfig } from './site-config';
import { isStaging } from '@/lib/hyronix/environment';
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (isStaging()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
