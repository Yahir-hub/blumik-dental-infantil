import type { Metadata } from 'next';
import { siteConfig } from './site-config';

export const seoDescriptions = {
  home: 'Odontopediatría en León, Guanajuato para bebés, niños y adolescentes, con prevención, atención adaptada y acompañamiento familiar.',
  services:
    'Servicios de odontopediatría en León para bebés, niños y adolescentes: prevención, restauración, crecimiento, traumatismos y primera visita.',
  neuro:
    'Atención odontopediátrica adaptada en León para pacientes neurodivergentes, con acompañamiento gradual, sensorial y respetuoso.',
  faq: 'Respuestas sobre primera visita, prevención, atención neurodivergente, traumatismos, formas de pago y ubicación de Blümik en León.',
  professionals:
    'Conoce el enfoque profesional, las instalaciones infantiles y la atención odontopediátrica especializada de Blümik en León, Guanajuato.',
  contact:
    'Agenda una valoración odontopediátrica en Blümik. Consulta ubicación, horarios, WhatsApp, formas de pago y formulario de contacto.',
  privacy:
    'Aviso de privacidad de Blümik Odontopediatría de Alto Nivel para pacientes, madres, padres, tutores y visitantes del sitio web.',
} as const;

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: 'es_MX',
      type: 'website',
      images: [
        {
          url: '/assets/IMG_0909-hero.webp',
          width: 1920,
          height: 795,
          alt: 'Fachada de Blümik Odontopediatría de Alto Nivel en León',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/IMG_0909-hero.webp'],
    },
  };
}

export const businessJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      inLanguage: 'es-MX',
      publisher: { '@id': `${siteConfig.url}/#business` },
    },
    {
      '@type': ['Dentist', 'LocalBusiness'],
      '@id': `${siteConfig.url}/#business`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/assets/logo.png`,
      image: `${siteConfig.url}/assets/IMG_0909-hero.webp`,
      telephone: `+${siteConfig.phoneInternational}`,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Juan Nepomuceno Herrera 827 A',
        addressLocality: 'León',
        addressRegion: 'Guanajuato',
        postalCode: '37150',
        addressCountry: 'MX',
      },
      sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '13:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '15:30',
          closes: '19:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '14:00',
        },
      ],
    },
  ],
};

const pageNames: Record<string, string> = {
  '/servicios': 'Servicios',
  '/pacientes-neurodivergentes': 'Pacientes neurodivergentes',
  '/preguntas-frecuentes': 'Preguntas frecuentes',
  '/profesionales': 'Conoce a tus profesionales',
  '/contacto': 'Contacto',
  '/aviso-de-privacidad': 'Aviso de privacidad',
};

export function BreadcrumbJsonLd({ path }: { path: keyof typeof pageNames }) {
  const data = {
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
        name: pageNames[path],
        item: `${siteConfig.url}${path}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
