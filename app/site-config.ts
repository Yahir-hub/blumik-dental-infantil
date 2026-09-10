export const siteConfig = {
  name: 'Blümik Odontopediatría de Alto Nivel',
  shortName: 'Blümik',
  url: 'https://blumikdentalinfantil.com',
  phoneDisplay: '477 910 1127',
  phoneInternational: '524779101127',
  email: 'paolagonzalez.odontopediatra@gmail.com',
  address:
    'Calle Juan Nepomuceno Herrera 827 A, Valle del Campestre, León, Guanajuato 37150',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100086932754767',
    instagram:
      'https://www.instagram.com/blumik_odontopediatria?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
  },
  hours: [
    {
      days: 'Lunes a viernes',
      first: '10:00 a.m. – 1:30 p.m.',
      second: '3:30 p.m. – 7:30 p.m.',
    },
    { days: 'Sábados', first: '10:00 a.m. – 2:00 p.m.', second: '' },
    { days: 'Domingos', first: 'Cerrado', second: '' },
  ],
  payments: [
    'Efectivo',
    'Tarjetas',
    'Transferencia',
    'Link de pago',
    'Meses sin intereses con restricciones',
  ],
} as const;

export const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${siteConfig.name}, ${siteConfig.address}`);
export const mapsEmbedUrl =
  'https://www.google.com/maps?q=' +
  encodeURIComponent(`${siteConfig.name}, ${siteConfig.address}`) +
  '&output=embed';
export const wazeUrl =
  'https://waze.com/ul?q=' + encodeURIComponent(siteConfig.address);

export function whatsappUrl(
  message = 'Hola, me gustaría solicitar información sobre una valoración odontopediátrica.',
) {
  return `https://wa.me/${siteConfig.phoneInternational}?text=${encodeURIComponent(message)}`;
}
