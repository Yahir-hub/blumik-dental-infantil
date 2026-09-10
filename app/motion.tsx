'use client';

import { useEffect, useRef, useState } from 'react';
import { dimensionsFor } from './image-data';

export function VisualEffects() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const elements = Array.from(
      new Set(
        document.querySelectorAll<HTMLElement>(
          'main img:not(.carousel-slide), main video, main [data-reveal], main section > h2, main section > h3, main article, main .cta, .dental-icon, .split-copy > *, .two-col > div > h2, .two-col > div > h3, .two-col > div > p, .two-col > div > .checks',
        ),
      ),
    );

    elements.forEach((element, index) => {
      element.setAttribute('data-reveal', '');
      if (!element.dataset.revealDirection) {
        element.dataset.revealDirection =
          index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'up';
      }
    });

    document
      .querySelectorAll<HTMLElement>('[data-reveal-group]')
      .forEach((group) => {
        Array.from(
          group.querySelectorAll<HTMLElement>(':scope > [data-reveal]'),
        ).forEach((element, index) => {
          const interval = group.classList.contains('professional-grid')
            ? 0.16
            : 0.08;
          element.style.setProperty(
            '--reveal-delay',
            `${Math.min(index, 2) * interval}s`,
          );
        });
      });

    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.classList.add('is-revealed');
        if (element instanceof HTMLVideoElement) {
          element.play().catch(() => undefined);
        }
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          if (entry.target instanceof HTMLVideoElement) {
            entry.target.play().catch(() => undefined);
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}

type CarouselImage = { src: string; alt: string };

export function LazyVideo({
  className,
  src,
  poster,
  label,
}: {
  className: string;
  src: string;
  poster: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !('IntersectionObserver' in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '280px 0px', threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      data-reveal
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      src={ready ? src : undefined}
      aria-label={label}
    />
  );
}

export function AutoCarousel({
  images,
  label = 'Atención odontopediátrica adaptada',
}: {
  images: CarouselImage[];
  label?: string;
}) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced || images.length < 2) return;

    const interval = window.setInterval(() => {
      setActive((current) => {
        setPrevious(current);
        return (current + 1) % images.length;
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (previous === null) return;
    const timeout = window.setTimeout(() => setPrevious(null), 680);
    return () => window.clearTimeout(timeout);
  }, [previous]);

  return (
    <section className="visual-carousel" data-reveal aria-label={label}>
      <div className="carousel-stage">
        {images.map((image, index) => (
          <img
            key={image.src}
            className={`carousel-slide${index === active ? ' is-active' : ''}${index === previous ? ' is-previous' : ''}`}
            src={`/assets/${image.src}.webp`}
            srcSet={`/assets/${image.src}-480.webp 480w, /assets/${image.src}-960.webp 960w`}
            sizes="(max-width: 800px) 88vw, 596px"
            alt={image.alt}
            width={dimensionsFor(image.src).width}
            height={dimensionsFor(image.src).height}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            aria-hidden={index !== active}
          />
        ))}
      </div>
      <div className="carousel-indicators" aria-hidden="true">
        {images.map((image, index) => (
          <span
            key={image.src}
            className={index === active ? 'is-active' : ''}
          />
        ))}
      </div>
    </section>
  );
}

export function PhilosophyTransform() {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const element = root.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.94;
      const end = window.innerHeight * 0.18;
      setProgress(Math.max(0, Math.min(1, (start - rect.top) / (start - end))));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const rotate =
    progress <= 0.32 ? 0 : -82 * Math.min(1, (progress - 0.32) / 0.36);
  const uOpacity =
    progress <= 0.5 ? 1 : Math.max(0, 1 - (progress - 0.5) / 0.18);
  const nProgress = Math.max(0, Math.min(1, (progress - 0.62) / 0.16));
  const suffixProgress = Math.max(0, Math.min(1, (progress - 0.78) / 0.22));

  return (
    <figure ref={root} className="philosophy-mark">
      <div className="letter-stage" aria-hidden="true">
        <span
          className="letter-u"
          style={{
            opacity: uOpacity,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          u
        </span>
        <span
          className="word-neurodivergencia"
          style={{
            opacity: nProgress,
            transform: `translateX(${(1 - suffixProgress) * 134}px)`,
          }}
        >
          <b
            className="letter-n"
            style={{
              transform: `scale(${2.5 - suffixProgress * 1.5})`,
            }}
          >
            n
          </b>
          <span
            className="word-suffix"
            style={{
              opacity: suffixProgress,
              clipPath: `inset(0 ${(1 - suffixProgress) * 100}% 0 0)`,
              transform: `translateX(${(1 - suffixProgress) * -28}px)`,
            }}
          >
            eurodivergencia
          </span>
        </span>
      </div>
      <span className="sr-only">
        La letra u cambia de perspectiva y se convierte en la palabra
        neurodivergencia
      </span>
    </figure>
  );
}
