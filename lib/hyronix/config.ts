export const SLUGS = [
  'home',
  'servicios',
  'pacientes-neurodivergentes',
  'preguntas-frecuentes',
  'profesionales',
  'contacto',
  'aviso-de-privacidad',
] as const;
export type Slug = (typeof SLUGS)[number];
export const isSlug = (v: unknown): v is Slug =>
  typeof v === 'string' && (SLUGS as readonly string[]).includes(v);
export const routeFor = (slug: Slug) => (slug === 'home' ? '/' : '/' + slug);
export const TIMEOUT_MS = 1200;
export function revalidateSeconds() {
  // Events provide freshness; this TTL only recovers a missed delivery.
  const value = Number(process.env.HYRONIX_CONTENT_REVALIDATE_SECONDS ?? 7200);
  if (!Number.isInteger(value) || value < 1 || value > 7200)
    throw Error('INVALID_REVALIDATE_SECONDS');
  return value;
}
export const tagsFor = (site: string, resource: string) => [
  `hyronix:site:${site}`,
  resource === 'settings'
    ? `hyronix:settings:${site}`
    : `hyronix:page:${site}:${resource}`,
];
