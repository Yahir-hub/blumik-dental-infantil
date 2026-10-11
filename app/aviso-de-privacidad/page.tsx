import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { pageMetadata, seoDescriptions } from '../seo';
import { siteConfig } from '../site-config';

const fallbackMetadata = pageMetadata({
  title: 'Aviso de privacidad',
  description: seoDescriptions.privacy,
  path: '/aviso-de-privacidad',
});

export default async function PrivacyNotice() {
  const content = await getPageContent('aviso-de-privacidad');
  return (
    <main>
      <PageSchema slug="aviso-de-privacidad" />
      <article className="privacy-page wide">
        <span className="eyebrow">Protección de datos</span>
        <h1>
          {content.rich(
            'hero',
            'title',
            <>Aviso de privacidad integral</>,
            'Aviso de privacidad integral',
          )}
        </h1>
        <p className="privacy-updated">
          {content.rich(
            'hero',
            'content',
            <>Última actualización: 10 de septiembre de 2026.</>,
            'Última actualización: 10 de septiembre de 2026.',
            0,
          )}
        </p>

        <p>
          {content.rich(
            'hero',
            'content',
            <>
              <strong>{siteConfig.name}</strong>, con domicilio en{' '}
              {siteConfig.address}, es responsable del tratamiento y protección
              de los datos personales que recaba de pacientes, madres, padres,
              tutores y visitantes de este sitio web.
            </>,
            'Blümik Odontopediatría de Alto Nivel, con domicilio en Calle Juan Nepomuceno Herrera 827 A, Valle del Campestre, León, Guanajuato 37150, es responsable del tratamiento y protección de los datos personales que recaba de pacientes, madres, padres, tutores y visitantes de este sitio web.',
            1,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Datos personales que podemos recabar</>,
            'Datos personales que podemos recabar',
            0,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              A través del formulario de contacto podemos recibir nombre, correo
              electrónico, teléfono y el mensaje que la persona decida enviar.
              Al solicitar o recibir atención clínica también podrán recabarse
              datos de identificación, contacto, facturación, antecedentes y
              datos de salud necesarios para la valoración y atención
              odontopediátrica.
            </>,
            'A través del formulario de contacto podemos recibir nombre, correo electrónico, teléfono y el mensaje que la persona decida enviar. Al solicitar o recibir atención clínica también podrán recabarse datos de identificación, contacto, facturación, antecedentes y datos de salud necesarios para la valoración y atención odontopediátrica.',
            2,
          )}
        </p>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Los datos de salud son datos personales sensibles y se tratarán
              con medidas reforzadas de confidencialidad y únicamente cuando
              resulten necesarios para la atención solicitada y conforme al
              consentimiento aplicable.
            </>,
            'Los datos de salud son datos personales sensibles y se tratarán con medidas reforzadas de confidencialidad y únicamente cuando resulten necesarios para la atención solicitada y conforme al consentimiento aplicable.',
            3,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Finalidades del tratamiento</>,
            'Finalidades del tratamiento',
            1,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>Los datos personales podrán utilizarse para:</>,
            'Los datos personales podrán utilizarse para:',
            4,
          )}
        </p>
        <ul>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Responder solicitudes de información y dar seguimiento a citas.
              </>,
              'Responder solicitudes de información y dar seguimiento a citas.',
              0,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Identificar al paciente y mantener comunicación con su madre,
                padre o tutor.
              </>,
              'Identificar al paciente y mantener comunicación con su madre, padre o tutor.',
              1,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Realizar valoraciones, diagnósticos y tratamientos
                odontopediátricos solicitados.
              </>,
              'Realizar valoraciones, diagnósticos y tratamientos odontopediátricos solicitados.',
              2,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Integrar y conservar el expediente clínico conforme a las
                obligaciones aplicables.
              </>,
              'Integrar y conservar el expediente clínico conforme a las obligaciones aplicables.',
              3,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Emitir comprobantes de pago o facturación cuando sean
                solicitados.
              </>,
              'Emitir comprobantes de pago o facturación cuando sean solicitados.',
              4,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Atender dudas, aclaraciones y solicitudes relacionadas con el
                servicio.
              </>,
              'Atender dudas, aclaraciones y solicitudes relacionadas con el servicio.',
              5,
            )}
          </li>
          <li>
            {content.rich(
              'hero',
              'items',
              <>
                Cumplir obligaciones sanitarias, fiscales, administrativas y
                legales.
              </>,
              'Cumplir obligaciones sanitarias, fiscales, administrativas y legales.',
              6,
            )}
          </li>
        </ul>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Blümik no utilizará los datos del formulario para publicidad sin
              el consentimiento correspondiente.
            </>,
            'Blümik no utilizará los datos del formulario para publicidad sin el consentimiento correspondiente.',
            5,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Transferencias y encargados</>,
            'Transferencias y encargados',
            2,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Los datos podrán ser tratados por proveedores que apoyen la
              operación del sitio, mensajería, correo, alojamiento, facturación
              o servicios tecnológicos, bajo obligaciones de confidencialidad y
              únicamente para las finalidades descritas. También podrán
              comunicarse a autoridades competentes cuando exista una obligación
              legal. Cualquier transferencia que requiera consentimiento se
              realizará después de obtenerlo.
            </>,
            'Los datos podrán ser tratados por proveedores que apoyen la operación del sitio, mensajería, correo, alojamiento, facturación o servicios tecnológicos, bajo obligaciones de confidencialidad y únicamente para las finalidades descritas. También podrán comunicarse a autoridades competentes cuando exista una obligación legal. Cualquier transferencia que requiera consentimiento se realizará después de obtenerlo.',
            6,
          )}
        </p>
        <p>
          Para entregar los mensajes del formulario utilizamos FormSubmit. Los
          datos escritos en ese formulario se transmiten a dicho proveedor y
          pueden conservarse temporalmente conforme a su{' '}
          <a
            href="https://formsubmit.co/privacy"
            target="_blank"
            rel="noreferrer"
          >
            política de privacidad
          </a>
          .
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Derechos ARCO y revocación</>,
            'Derechos ARCO y revocación',
            3,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Puedes solicitar acceso, rectificación, cancelación u oposición al
              tratamiento de tus datos, revocar tu consentimiento o limitar su
              uso. Envía tu solicitud a{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> e
              incluye tu nombre, un medio para recibir respuesta, la descripción
              clara del derecho que deseas ejercer y la información necesaria
              para localizar tus datos. Cuando corresponda, se solicitará
              documentación para acreditar identidad o representación.
            </>,
            'Puedes solicitar acceso, rectificación, cancelación u oposición al tratamiento de tus datos, revocar tu consentimiento o limitar su uso. Envía tu solicitud a paolagonzalez.odontopediatra@gmail.com e incluye tu nombre, un medio para recibir respuesta, la descripción clara del derecho que deseas ejercer y la información necesaria para localizar tus datos. Cuando corresponda, se solicitará documentación para acreditar identidad o representación.',
            8,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Seguridad y conservación</>,
            'Seguridad y conservación',
            4,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Aplicamos medidas administrativas y técnicas razonables para
              proteger los datos contra daño, pérdida, alteración, destrucción o
              acceso no autorizado. La información se conservará durante el
              tiempo necesario para cumplir las finalidades descritas y las
              obligaciones legales correspondientes.
            </>,
            'Aplicamos medidas administrativas y técnicas razonables para proteger los datos contra daño, pérdida, alteración, destrucción o acceso no autorizado. La información se conservará durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales correspondientes.',
            9,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Cookies, medición y enlaces externos</>,
            'Cookies, medición y enlaces externos',
            5,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              El sitio puede cargar servicios externos, como mapas, WhatsApp,
              Facebook e Instagram. Al abrirlos, sus proveedores pueden tratar
              datos conforme a sus propios avisos.
            </>,
            'El sitio puede cargar servicios externos, como mapas, WhatsApp, Facebook e Instagram. Al abrirlos, sus proveedores pueden tratar datos conforme a sus propios avisos.',
            10,
          )}
        </p>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Con tu consentimiento utilizamos Google Analytics para medir
              visitas, páginas consultadas e interacciones generales, como clics
              en enlaces de contacto. Esta información nos ayuda a comprender el
              uso del sitio y mejorar su contenido. La medición permanece
              desactivada si eliges “Solo necesarias”. Google puede tratar
              identificadores en línea e información técnica del dispositivo
              conforme a su propia política de privacidad. No activamos
              funciones publicitarias ni enviamos a Google los datos escritos en
              el formulario de contacto.
            </>,
            'Con tu consentimiento utilizamos Google Analytics para medir visitas, páginas consultadas e interacciones generales, como clics en enlaces de contacto. Esta información nos ayuda a comprender el uso del sitio y mejorar su contenido. La medición permanece desactivada si eliges “Solo necesarias”. Google puede tratar identificadores en línea e información técnica del dispositivo conforme a su propia política de privacidad. No activamos funciones publicitarias ni enviamos a Google los datos escritos en el formulario de contacto.',
            11,
          )}
        </p>

        <h2>
          {content.rich(
            'hero',
            'subheadings',
            <>Cambios al aviso</>,
            'Cambios al aviso',
            6,
          )}
        </h2>
        <p>
          {content.rich(
            'hero',
            'content',
            <>
              Las actualizaciones a este aviso se publicarán en esta misma
              página. Para dudas sobre el tratamiento de datos personales,
              escribe a{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </>,
            'Las actualizaciones a este aviso se publicarán en esta misma página. Para dudas sobre el tratamiento de datos personales, escribe a paolagonzalez.odontopediatra@gmail.com.',
            12,
          )}
        </p>
      </article>
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('aviso-de-privacidad', fallbackMetadata);
}
