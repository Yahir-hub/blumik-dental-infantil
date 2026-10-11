import { getBlumikSettings } from '@/lib/hyronix/settings';
import { SettingsProvider } from '@/lib/hyronix/settings-context';
import type { Metadata, Viewport } from 'next';
import '../public/assets/sen.css';
import '../public/assets/lato.css';
import './globals.css';
import { Header, Footer } from './shared';
import { VisualEffects } from './motion';
import { seoDescriptions } from './seo';
import { siteConfig } from './site-config';
import { AnalyticsConsent } from './analytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.75,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Odontopediatra en León, Guanajuato | Blümik',
    template: '%s | Blümik',
  },
  icons: {
    icon: [
      {
        url: '/assets/favicon-blumik.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: '/assets/favicon-blumik.png',
  },
  description: seoDescriptions.home,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Odontopediatra en León, Guanajuato | Blümik',
    description: seoDescriptions.home,
    url: '/',
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
    title: 'Odontopediatra en León, Guanajuato | Blümik',
    description: seoDescriptions.home,
    images: ['/assets/IMG_0909-hero.webp'],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getBlumikSettings();
  return (
    <html lang="es">
      <body>
        <SettingsProvider value={settings}>
          <VisualEffects />
          <Header />
          {children}
          <Footer />
          <AnalyticsConsent />
        </SettingsProvider>
      </body>
    </html>
  );
}
