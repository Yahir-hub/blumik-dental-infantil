'use client';

/* eslint-disable react/react-compiler -- The browser-only Google tag callback is outside React's compilation model. */

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

const measurementId = 'G-F054KCY0CX';
const consentKey = 'blumik-analytics-consent';

type Consent = 'accepted' | 'declined' | null;
const consentEvent = 'blumik-consent-change';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
) {
  window.gtag?.('event', eventName, parameters);
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener(consentEvent, callback);
  return () => window.removeEventListener(consentEvent, callback);
}

function getConsentSnapshot(): Consent {
  const saved = window.localStorage.getItem(consentKey);
  return saved === 'accepted' || saved === 'declined' ? saved : null;
}

function getConsentServerSnapshot(): Consent {
  return null;
}

export function AnalyticsConsent() {
  'use no memo';

  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || consent !== 'accepted') return;

    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [consent, pathname, ready]);

  useEffect(() => {
    if (!ready || consent !== 'accepted') return;

    const trackLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const href = link.href;
      if (href.includes('wa.me/')) {
        trackAnalyticsEvent('click_whatsapp', { page_path: pathname });
      } else if (
        href.includes('facebook.com') ||
        href.includes('instagram.com')
      ) {
        trackAnalyticsEvent('click_social', {
          page_path: pathname,
          social_network: href.includes('facebook.com')
            ? 'facebook'
            : 'instagram',
        });
      } else if (
        href.includes('google.com/maps') ||
        href.includes('waze.com')
      ) {
        trackAnalyticsEvent('click_directions', { page_path: pathname });
      }
    };

    document.addEventListener('click', trackLink);
    return () => document.removeEventListener('click', trackLink);
  }, [consent, pathname, ready]);

  function chooseConsent(value: Exclude<Consent, null>) {
    window.localStorage.setItem(consentKey, value);
    window.dispatchEvent(new Event(consentEvent));
  }

  function reopenPreferences() {
    window.localStorage.removeItem(consentKey);
    window.dispatchEvent(new Event(consentEvent));
  }

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
            onLoad={() => {
              window.dataLayer = window.dataLayer || [];
              window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
              window.gtag('js', new Date());
              window.gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
              });
              window.gtag('config', measurementId, {
                send_page_view: false,
                anonymize_ip: true,
              });
              setReady(true);
            }}
          />
        </>
      )}

      {consent === null && (
        <aside
          className="analytics-consent"
          role="dialog"
          aria-label="Preferencias de medición del sitio"
          aria-live="polite"
        >
          <div>
            <strong>Tu privacidad importa</strong>
            <p>
              Usamos Google Analytics para conocer qué contenidos son útiles y
              mejorar el sitio. Solo se activa si aceptas.
            </p>
            <a href="/aviso-de-privacidad">Ver aviso de privacidad</a>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => chooseConsent('declined')}>
              Solo necesarias
            </button>
            <button
              className="analytics-consent-accept"
              type="button"
              onClick={() => chooseConsent('accepted')}
            >
              Aceptar analítica
            </button>
          </div>
        </aside>
      )}

      {consent !== null && (
        <button
          className="analytics-preferences"
          type="button"
          onClick={reopenPreferences}
        >
          Privacidad
        </button>
      )}
    </>
  );
}
