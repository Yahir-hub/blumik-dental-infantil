import { publishedMetadata } from '@/lib/hyronix/metadata';
import type { ReactNode } from 'react';
import { pageMetadata, seoDescriptions } from '../seo';

const fallbackMetadata = pageMetadata({
  title: 'Preguntas frecuentes de odontopediatría',
  description: seoDescriptions.faq,
  path: '/preguntas-frecuentes',
});

export default function FAQLayout({ children }: { children: ReactNode }) {
  return children;
}

export async function generateMetadata() {
  return publishedMetadata('preguntas-frecuentes', fallbackMetadata);
}
