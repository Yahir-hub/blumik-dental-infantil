'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Menu, Navigation, X } from 'lucide-react';
import {
  mapsEmbedUrl,
  mapsUrl,
  siteConfig,
  wazeUrl,
  whatsappMessageForPath,
  whatsappUrl,
} from './site-config';
import { dimensionsFor } from './image-data';

const links = [
  ['/', 'Inicio'],
  ['/servicios', 'Servicios'],
  ['/pacientes-neurodivergentes', 'Pacientes Neurodivergentes'],
  ['/preguntas-frecuentes', 'Preguntas Frecuentes'],
  ['/profesionales', 'Conoce a tus profesionales'],
  ['/contacto', 'Contacto'],
] as const;

export function CTA({
  children = '¡Contáctanos!',
}: {
  children?: React.ReactNode;
}) {
  const path = usePathname();
  return (
    <a
      className="cta"
      href={whatsappUrl(whatsappMessageForPath(path))}
      target="_blank"
      rel="noreferrer"
    >
      <span className="wa" aria-hidden="true">
        <img src="/assets/whatsapp.png" alt="" />
      </span>
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M504 256C504 119 393 8 256 8S8 119 8 256c0 124 91 226 209 245V328h-63v-72h63v-55c0-62 37-96 94-96 27 0 55 5 55 5v61h-31c-31 0-40 19-40 39v46h69l-11 72h-58v173c118-19 209-121 209-245Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <rect
        x="64"
        y="64"
        width="384"
        height="384"
        rx="100"
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
      />
      <circle
        cx="256"
        cy="256"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
      />
      <circle cx="382" cy="130" r="24" fill="currentColor" />
    </svg>
  );
}

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`contact-social ${className}`.trim()}>
      <a
        href={siteConfig.social.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Visitar Facebook de Blümik"
      >
        <FacebookIcon />
      </a>
      <a
        className="instagram-link"
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Visitar Instagram de Blümik"
      >
        <InstagramIcon />
      </a>
    </div>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="brand-bar site-shell">
        <a href="/" aria-label="Blümik, inicio">
          <img
            src="/assets/logo.png"
            alt="Blümik Odontopediatría de Alto Nivel"
          />
        </a>
        <CTA />
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>Menú</span>
        </button>
      </div>
      <nav
        id="main-navigation"
        className={open ? 'navigation open' : 'navigation'}
        aria-label="Navegación principal"
      >
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className={path === href ? 'active' : ''}
            aria-current={path === href ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
            {href === '/pacientes-neurodivergentes' && (
              <span className="nav-detail">
                Autismo, TDAH y Síndrome de Down
              </span>
            )}
          </a>
        ))}
      </nav>
      <a
        className="mobile-whatsapp-float"
        href={whatsappUrl(whatsappMessageForPath(path))}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar a Blümik por WhatsApp"
      >
        <img src="/assets/whatsapp.png" alt="" />
      </a>
    </header>
  );
}

export function Missing({
  type = 'foto',
  description = '',
  className = '',
}: {
  type?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={'missing ' + className}
      role="img"
      aria-label={'Falta ' + type + ': ' + description}
    >
      <span>Falta {type}</span>
      {description && <small>{description}</small>}
    </div>
  );
}
export function Photo({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const dimensions = dimensionsFor(src);
  return (
    <img
      data-reveal
      className={'photo ' + className}
      src={'/assets/' + src + '.webp'}
      srcSet={`/assets/${src}-480.webp 480w, /assets/${src}-960.webp 960w`}
      sizes="(max-width: 800px) 88vw, 50vw"
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      loading="lazy"
      decoding="async"
    />
  );
}
export function Mascot() {
  return (
    <img
      data-reveal
      className="mascot"
      src="/assets/mascota-transparente.png"
      alt="Mascota de Blümik"
    />
  );
}
export function Symbol({ green = false }: { green?: boolean }) {
  return (
    <img
      data-reveal
      className="symbol"
      src={'/assets/simbolo' + (green ? '-verde' : '') + '.png'}
      alt="Símbolo de Blümik"
    />
  );
}
export function Checks({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}
export function Hero({
  kind,
  title,
  subtitle,
  description,
  button,
}: {
  kind: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  description: string;
  button: string;
}) {
  const posters: Record<string, string> = {
    inicio: '/assets/IMG_0513.webp',
    servicios: '/assets/IMG_0159.webp',
    neuro: '/assets/IMG_0513.webp',
  };
  const videos: Record<string, string> = {
    inicio: '/assets/adaptacion.mp4',
    servicios: '/assets/servicios.mp4',
    neuro: '/assets/neuro.mp4',
  };
  return (
    <section className={'hero hero-' + kind}>
      <video
        data-reveal
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posters[kind]}
        src={videos[kind]}
        aria-label={
          kind === 'inicio'
            ? 'Atención odontopediátrica adaptada durante una consulta infantil'
            : undefined
        }
      />
      <div className="hero-panel">
        <h1>
          {title}
          <small>{subtitle}</small>
        </h1>
        <p>{description}</p>
        <CTA>{button}</CTA>
      </div>
    </section>
  );
}

export function LocationSection({ className = '' }: { className?: string }) {
  const path = usePathname();
  return (
    <section className={`location-section wide ${className}`}>
      <div className="location-copy" data-reveal data-reveal-direction="left">
        <span className="eyebrow">Ubicación</span>
        <h2>Visítanos</h2>
        <address>{siteConfig.address}</address>
        <div className="location-details">
          <p>
            <strong>Horario:</strong>{' '}
            {siteConfig.hours.map((item, index) => (
              <span key={item.days}>
                {index > 0 ? ' ' : ''}
                {item.first === 'Cerrado' ? (
                  <>{item.days}: cerrado.</>
                ) : (
                  <>
                    {item.days}, de {item.first}
                    {item.second ? ` y de ${item.second}` : ''}.
                  </>
                )}
              </span>
            ))}
          </p>
          <p>
            <strong>WhatsApp:</strong>{' '}
            <a
              href={whatsappUrl(whatsappMessageForPath(path))}
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.phoneDisplay}
            </a>
          </p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
        <div className="location-actions">
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" /> Cómo llegar
          </a>
          <a href={wazeUrl} target="_blank" rel="noreferrer">
            <Navigation aria-hidden="true" /> Abrir Waze
          </a>
        </div>
      </div>
      <div className="location-map" data-reveal data-reveal-direction="right">
        <iframe
          src={mapsEmbedUrl}
          title="Ubicación de Blümik en Google Maps"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

export function Footer() {
  const path = usePathname();
  const footerLinks = [
    ['/servicios', 'Servicios'],
    ['/pacientes-neurodivergentes', 'Atención neurodivergente'],
    ['/servicios#primera-visita', 'Primera visita'],
    ['/#conoce-blumik', 'Conoce Blümik'],
    ['/profesionales', 'Conoce a tus profesionales'],
    ['/contacto', 'Contacto'],
    ['/preguntas-frecuentes', 'Preguntas frecuentes'],
    ['/aviso-de-privacidad', 'Aviso de privacidad'],
  ] as const;

  return (
    <footer className="footer">
      <div className="footer-inner site-shell">
        <div className="footer-identity">
          <img
            className="footer-logo"
            src="/assets/logo-blanco.png"
            alt="Blümik"
          />
          <p>
            Odontopediatría especializada para bebés, niños y adolescentes en
            León, Guanajuato.
          </p>
        </div>
        <nav className="footer-menu" aria-label="Navegación del pie de página">
          <h2>Navegación</h2>
          {footerLinks.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <section className="footer-contact-list">
          <h2>Contacto</h2>
          <p>{siteConfig.address}</p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a
            href={whatsappUrl(whatsappMessageForPath(path))}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: {siteConfig.phoneDisplay}
          </a>
          <p className="footer-schedule">
            Horario:{' '}
            {siteConfig.hours.map((item, index) => (
              <span key={item.days}>
                {index > 0 ? ' ' : ''}
                {item.first === 'Cerrado' ? (
                  <>{item.days}: cerrado.</>
                ) : (
                  <>
                    {item.days}, de {item.first}
                    {item.second ? ` y de ${item.second}` : ''}.
                  </>
                )}
              </span>
            ))}
          </p>
          <div className="footer-social-wrap">
            <strong>Síguenos</strong>
            <SocialLinks className="footer-social" />
          </div>
        </section>
        <div className="footer-bottom">
          <strong className="footer-advanta">ADVanta</strong>
          <p>© 2026 Blümik. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
