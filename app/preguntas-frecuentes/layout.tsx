import type { ReactNode } from 'react';
import { pageMetadata, seoDescriptions } from '../seo';

export const metadata = pageMetadata({
  title: 'Preguntas frecuentes de odontopediatría',
  description: seoDescriptions.faq,
  path: '/preguntas-frecuentes',
});

export default function FAQLayout({ children }: { children: ReactNode }) {
  return children;
}
