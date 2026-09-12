import type { MetadataRoute } from 'next';
import { seoDescriptions } from './seo';
import { siteConfig } from './site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: seoDescriptions.home,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#5000ae',
    lang: 'es-MX',
    icons: [
      {
        src: '/assets/favicon-blumik.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/favicon-blumik.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
