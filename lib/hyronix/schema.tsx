import 'server-only';
import { businessJsonLd } from '@/app/seo';
import { siteConfig } from '@/app/site-config';
import { getPublishedPage } from './client';
import { getBlumikSettings } from './settings';
import { record, type Json } from './types';
export const safeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');
function nodes(value: Json): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!record(value)) return [];
  return Array.isArray(value['@graph'])
    ? value['@graph'].flatMap((v) => nodes(v as Json))
    : [value];
}
function hours(value: string) {
  const result: Record<string, unknown>[] = [];
  const groups: [RegExp, string[]][] = [
    [
      /Lunes a viernes[\s\S]*?(?=Sábados|$)/i,
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    ],
    [/Sábados[\s\S]*?(?=Domingos|$)/i, ['Saturday']],
    [/Domingos[\s\S]*$/i, ['Sunday']],
  ];
  for (const [pattern, dayOfWeek] of groups) {
    const part = value.match(pattern)?.[0] ?? '';
    const times = [
      ...part.matchAll(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/gi),
    ].map(
      (m) =>
        `${String((Number(m[1]) % 12) + (m[3].toLowerCase() === 'p' ? 12 : 0)).padStart(2, '0')}:${m[2]}`,
    );
    for (let i = 0; i + 1 < times.length; i += 2)
      result.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: times[i],
        closes: times[i + 1],
      });
  }
  return result;
}
export async function PageSchema({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([
    getPublishedPage(slug),
    getBlumikSettings(),
  ]);
  const published = nodes(page?.seo?.schema ?? null);
  const graph = (
    published.length ? published : nodes(businessJsonLd as unknown as Json)
  )
    .filter((n) => n['@type'] !== 'FAQPage' && n['@type'] !== 'BreadcrumbList')
    .map((node) => {
      const type = node['@type'];
      if (type === 'WebSite')
        return { ...node, name: settings.name, url: siteConfig.url };
      if (
        type === 'Dentist' ||
        type === 'LocalBusiness' ||
        (Array.isArray(type) &&
          type.some((t) => ['Dentist', 'LocalBusiness'].includes(String(t))))
      ) {
        const { openingHoursSpecification: previous, ...rest } = node;
        void previous;
        return {
          ...rest,
          name: settings.name,
          telephone: '+' + settings.phoneInternational,
          email: settings.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressCountry: 'MX',
          },
          sameAs: Object.values(settings.social),
          openingHoursSpecification: hours(settings.openingHours),
        };
      }
      return node;
    });
  if (slug !== 'home')
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: siteConfig.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page?.name ?? slug,
          item: siteConfig.url + '/' + slug,
        },
      ],
    });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJson({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
