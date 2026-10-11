import 'server-only';
import { cache } from 'react';
import { siteConfig } from '@/app/site-config';
import { getPublishedSettings } from './client';
export type BlumikSettings = {
  name: string;
  address: string;
  email: string;
  phoneDisplay: string;
  phoneInternational: string;
  openingHours: string;
  social: { facebook: string; instagram: string };
};
export const defaultHours = siteConfig.hours
  .map((h) =>
    h.first === 'Cerrado'
      ? `${h.days}: cerrado.`
      : `${h.days}, de ${h.first}${h.second ? ' y de ' + h.second : ''}.`,
  )
  .join(' ');
export const getBlumikSettings = cache(async (): Promise<BlumikSettings> => {
  const s = await getPublishedSettings();
  const text = (key: string, fallback: string) => s?.[key]?.trim() || fallback;
  const url = (key: string, fallback: string) => {
    try {
      const v = new URL(text(key, fallback));
      return v.protocol === 'https:' ? v.href : fallback;
    } catch {
      return fallback;
    }
  };
  const email = text('email', siteConfig.email),
    phone = text('whatsapp', siteConfig.phoneInternational);
  return {
    name: text('business_name', siteConfig.name),
    address: text('address', siteConfig.address),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : siteConfig.email,
    phoneDisplay: text('phone', siteConfig.phoneDisplay),
    phoneInternational: /^[1-9][0-9]{7,14}$/.test(phone)
      ? phone
      : siteConfig.phoneInternational,
    openingHours: text('opening_hours', defaultHours),
    social: {
      facebook: url('facebook', siteConfig.social.facebook),
      instagram: url('instagram', siteConfig.social.instagram),
    },
  };
});
