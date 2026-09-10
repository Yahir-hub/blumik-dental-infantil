import type { MetadataRoute } from 'next';
import { siteConfig } from './site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1 },
    { path: '/servicios', priority: 0.9 },
    { path: '/pacientes-neurodivergentes', priority: 0.9 },
    { path: '/preguntas-frecuentes', priority: 0.75 },
    { path: '/profesionales', priority: 0.8 },
    { path: '/contacto', priority: 0.85 },
    { path: '/aviso-de-privacidad', priority: 0.3 },
  ] as const;

  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date('2026-09-09'),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority,
  }));
}
