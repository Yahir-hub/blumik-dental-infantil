import type { Media } from '@/lib/hyronix/types';
import {
  Activity,
  Baby,
  Camera,
  HeartPulse,
  Notebook,
  Smile,
  SmilePlus,
} from 'lucide-react';
import { AutoCarousel } from './motion';
import { CTA, Checks, Mascot, Missing, Photo } from './shared';

const serviceIcons = {
  diente: SmilePlus,
  crecimiento: Activity,
  habitos: Smile,
  tecnologia: Camera,
  primera: Notebook,
  bebe: Baby,
  trauma: HeartPulse,
};
export function ServiceBlock({
  title,
  description,
  items,
  icon = 'diente',
  button,
  buttonHref,
}: {
  title: string;
  description?: string;
  items: string[];
  icon?: string;
  button?: string;
  buttonHref?: string;
}) {
  const Icon = serviceIcons[icon as keyof typeof serviceIcons] || SmilePlus;
  return (
    <article className="service-block">
      <span className="dental-icon" aria-hidden="true">
        <Icon />
      </span>
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <Checks items={items} />
        {button && <CTA href={buttonHref}>{button}</CTA>}
      </div>
    </article>
  );
}
export function Split({
  title,
  description,
  items,
  photo,
  media,
  missing,
  reverse = false,
  color = 'pink',
  button,
  buttonHref,
  extra,
  carousel,
}: {
  title: string;
  description: string;
  items?: string[];
  photo?: string;
  media?: Media;
  missing?: string;
  reverse?: boolean;
  color?: string;
  button?: string;
  buttonHref?: string;
  extra?: string;
  carousel?: { src: string; alt: string; media?: Media }[];
}) {
  return (
    <section className={'split ' + (reverse ? 'reverse ' : '') + color}>
      <div className="split-media">
        {carousel ? (
          <AutoCarousel images={carousel} />
        ) : photo ? (
          <Photo src={photo} alt={title} media={media} />
        ) : (
          <Missing description={missing || title} />
        )}
      </div>
      <div className="split-copy">
        <Mascot />
        <h2>{title}</h2>
        <p>{description}</p>
        {extra && <p>{extra}</p>}
        {items && <Checks items={items} />}{' '}
        {button && <CTA href={buttonHref}>{button}</CTA>}
      </div>
    </section>
  );
}
