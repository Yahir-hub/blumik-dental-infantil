import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { CTA, LocationSection, Photo, SocialLinks } from '../shared';
import ContactForm from './form';
import { Banknote, CreditCard, Landmark, Link2 } from 'lucide-react';
import { pageMetadata, seoDescriptions } from '../seo';
const fallbackMetadata = pageMetadata({
  title: 'Contacto y citas de odontopediatría en León',
  description: seoDescriptions.contact,
  path: '/contacto',
});
export default async function Contact() {
  const content = await getPageContent('contacto');
  return (
    <main>
      <PageSchema slug="contacto" />
      <section className="contact-hero lavender wide two-col">
        <div>
          <h1>
            {content.rich(
              'hero',
              'title',
              <>
                Contacto de
                <br />
                odontopediatra en León
                <br />
                Guanajuato
              </>,
              'Contacto de odontopediatra en León Guanajuato',
            )}
          </h1>
          <p>
            {content.rich(
              'hero',
              'content',
              <>
                En Blümik Odontopediatría de Alto Nivel estamos listos para
                acompañar el cuidado dental infantil de tu familia.
              </>,
              'En Blümik Odontopediatría de Alto Nivel estamos listos para acompañar el cuidado dental infantil de tu familia.',
              0,
            )}
          </p>
          <CTA href={content.href('hero', 0)}>
            {content.rich(
              'hero',
              'links',
              <>Información y citas</>,
              'Información y citas',
              0,
            )}
          </CTA>
        </div>
        <Photo
          className="arch"
          src="IMG_0466"
          alt="Recepción de la clínica Blümik"
          media={content.media('hero', 'image1')}
        />
      </section>
      <section className="contact-content">
        <div>
          <h2>
            {content.rich(
              'section_2',
              'title',
              <>
                Agenda una valoración
                <br />
                odontopediátrica
              </>,
              'Agenda una valoración odontopediátrica',
            )}
          </h2>
          <p>
            {content.rich(
              'section_2',
              'content',
              <>
                Brindamos atención odontopediátrica para bebés, niños y
                adolescentes en León, Guanajuato. Nuestro enfoque busca generar
                experiencias dentales positivas mediante atención cálida,
                respetuosa y profesional.
              </>,
              'Brindamos atención odontopediátrica para bebés, niños y adolescentes en León, Guanajuato. Nuestro enfoque busca generar experiencias dentales positivas mediante atención cálida, respetuosa y profesional.',
              0,
            )}
          </p>
          <p>
            {content.rich(
              'section_2',
              'content',
              <>
                También contamos con atención adaptada para pacientes
                neurodivergentes y acompañamiento cercano para madres y padres
                durante cada etapa.
              </>,
              'También contamos con atención adaptada para pacientes neurodivergentes y acompañamiento cercano para madres y padres durante cada etapa.',
              1,
            )}
          </p>
          <div className="follow center">
            <h3>
              {content.rich(
                'section_2',
                'subheadings',
                <>Síguenos</>,
                'Síguenos',
                0,
              )}
            </h3>
            <SocialLinks />
          </div>
          <div className="contact-payments center">
            <p>
              {content.rich(
                'section_2',
                'content',
                <>Aceptamos las siguientes formas de pago:</>,
                'Aceptamos las siguientes formas de pago:',
                2,
              )}
            </p>
            <div className="payment-methods">
              <span>
                <Banknote aria-hidden="true" /> Efectivo
              </span>
              <span>
                <CreditCard aria-hidden="true" /> Tarjetas
              </span>
              <span>
                <Landmark aria-hidden="true" /> Transferencia
              </span>
              <span>
                <Link2 aria-hidden="true" /> Link de pago
              </span>
            </div>
            <small>Meses sin intereses. Aplican restricciones.</small>
          </div>
        </div>
        <ContactForm
          title={content.text('section_2', 'subheadings', 'Contáctenos', 1)}
          description={content.text(
            'section_2',
            'content',
            'Completa tus datos y el mensaje llegará directamente al correo de Blümik.',
            3,
          )}
          helper={content.text(
            'section_2',
            'content',
            'Evita incluir diagnósticos, expedientes o datos médicos sensibles en este formulario.',
            4,
          )}
          privacyLabel={content.link('section_2', 0, 'aviso de privacidad')}
        />
      </section>
      <LocationSection
        className="contact-location"
        title={content.text('section_3', 'title', 'Visítanos')}
      />
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('contacto', fallbackMetadata);
}
