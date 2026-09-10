import { CTA, LocationSection, Photo, SocialLinks } from '../shared';
import ContactForm from './form';
import { Banknote, CreditCard, Landmark, Link2 } from 'lucide-react';
import { BreadcrumbJsonLd, pageMetadata, seoDescriptions } from '../seo';
export const metadata = pageMetadata({
  title: 'Contacto y citas de odontopediatría en León',
  description: seoDescriptions.contact,
  path: '/contacto',
});
export default function Contact() {
  return (
    <main>
      <BreadcrumbJsonLd path="/contacto" />
      <section className="contact-hero lavender wide two-col">
        <div>
          <h1>
            Contacto de
            <br />
            odontopediatra en León
            <br />
            Guanajuato
          </h1>
          <p>
            En Blümik Odontopediatría de Alto Nivel estamos listos para
            acompañar el cuidado dental infantil de tu familia.
          </p>
          <CTA>Información y citas</CTA>
        </div>
        <Photo
          className="arch"
          src="IMG_0466"
          alt="Recepción de la clínica Blümik"
        />
      </section>
      <section className="contact-content">
        <div>
          <h2>
            Agenda una valoración
            <br />
            odontopediátrica
          </h2>
          <p>
            Brindamos atención odontopediátrica para bebés, niños y adolescentes
            en León, Guanajuato. Nuestro enfoque busca generar experiencias
            dentales positivas mediante atención cálida, respetuosa y
            profesional.
          </p>
          <p>
            También contamos con atención adaptada para pacientes
            neurodivergentes y acompañamiento cercano para madres y padres
            durante cada etapa.
          </p>
          <div className="follow center">
            <h3>Síguenos</h3>
            <SocialLinks />
          </div>
          <div className="contact-payments center">
            <p>Aceptamos las siguientes formas de pago:</p>
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
        <ContactForm />
      </section>
      <LocationSection className="contact-location" />
    </main>
  );
}
