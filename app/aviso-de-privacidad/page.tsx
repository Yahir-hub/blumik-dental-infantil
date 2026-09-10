import { BreadcrumbJsonLd, pageMetadata, seoDescriptions } from '../seo';
import { siteConfig } from '../site-config';

export const metadata = pageMetadata({
  title: 'Aviso de privacidad',
  description: seoDescriptions.privacy,
  path: '/aviso-de-privacidad',
});

export default function PrivacyNotice() {
  return (
    <main>
      <BreadcrumbJsonLd path="/aviso-de-privacidad" />
      <article className="privacy-page wide">
        <span className="eyebrow">Protección de datos</span>
        <h1>Aviso de privacidad integral</h1>
        <p className="privacy-updated">
          Última actualización: 10 de septiembre de 2026.
        </p>

        <p>
          <strong>{siteConfig.name}</strong>, con domicilio en{' '}
          {siteConfig.address}, es responsable del tratamiento y protección de
          los datos personales que recaba de pacientes, madres, padres, tutores
          y visitantes de este sitio web.
        </p>

        <h2>Datos personales que podemos recabar</h2>
        <p>
          A través del formulario de contacto podemos recibir nombre, correo
          electrónico, teléfono y el mensaje que la persona decida enviar. Al
          solicitar o recibir atención clínica también podrán recabarse datos de
          identificación, contacto, facturación, antecedentes y datos de salud
          necesarios para la valoración y atención odontopediátrica.
        </p>
        <p>
          Los datos de salud son datos personales sensibles y se tratarán con
          medidas reforzadas de confidencialidad y únicamente cuando resulten
          necesarios para la atención solicitada y conforme al consentimiento
          aplicable.
        </p>

        <h2>Finalidades del tratamiento</h2>
        <p>Los datos personales podrán utilizarse para:</p>
        <ul>
          <li>
            Responder solicitudes de información y dar seguimiento a citas.
          </li>
          <li>
            Identificar al paciente y mantener comunicación con su madre, padre
            o tutor.
          </li>
          <li>
            Realizar valoraciones, diagnósticos y tratamientos odontopediátricos
            solicitados.
          </li>
          <li>
            Integrar y conservar el expediente clínico conforme a las
            obligaciones aplicables.
          </li>
          <li>
            Emitir comprobantes de pago o facturación cuando sean solicitados.
          </li>
          <li>
            Atender dudas, aclaraciones y solicitudes relacionadas con el
            servicio.
          </li>
          <li>
            Cumplir obligaciones sanitarias, fiscales, administrativas y
            legales.
          </li>
        </ul>
        <p>
          Blümik no utilizará los datos del formulario para publicidad sin el
          consentimiento correspondiente.
        </p>

        <h2>Transferencias y encargados</h2>
        <p>
          Los datos podrán ser tratados por proveedores que apoyen la operación
          del sitio, mensajería, correo, alojamiento, facturación o servicios
          tecnológicos, bajo obligaciones de confidencialidad y únicamente para
          las finalidades descritas. También podrán comunicarse a autoridades
          competentes cuando exista una obligación legal. Cualquier
          transferencia que requiera consentimiento se realizará después de
          obtenerlo.
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

        <h2>Derechos ARCO y revocación</h2>
        <p>
          Puedes solicitar acceso, rectificación, cancelación u oposición al
          tratamiento de tus datos, revocar tu consentimiento o limitar su uso.
          Envía tu solicitud a{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> e
          incluye tu nombre, un medio para recibir respuesta, la descripción
          clara del derecho que deseas ejercer y la información necesaria para
          localizar tus datos. Cuando corresponda, se solicitará documentación
          para acreditar identidad o representación.
        </p>

        <h2>Seguridad y conservación</h2>
        <p>
          Aplicamos medidas administrativas y técnicas razonables para proteger
          los datos contra daño, pérdida, alteración, destrucción o acceso no
          autorizado. La información se conservará durante el tiempo necesario
          para cumplir las finalidades descritas y las obligaciones legales
          correspondientes.
        </p>

        <h2>Cookies, medición y enlaces externos</h2>
        <p>
          El sitio puede cargar servicios externos, como mapas, WhatsApp,
          Facebook e Instagram. Al abrirlos, sus proveedores pueden tratar datos
          conforme a sus propios avisos.
        </p>
        <p>
          Con tu consentimiento utilizamos Google Analytics para medir visitas,
          páginas consultadas e interacciones generales, como clics en enlaces
          de contacto. Esta información nos ayuda a comprender el uso del sitio
          y mejorar su contenido. La medición permanece desactivada si eliges
          “Solo necesarias”. Google puede tratar identificadores en línea e
          información técnica del dispositivo conforme a su propia política de
          privacidad. No activamos funciones publicitarias ni enviamos a Google
          los datos escritos en el formulario de contacto.
        </p>

        <h2>Cambios al aviso</h2>
        <p>
          Las actualizaciones a este aviso se publicarán en esta misma página.
          Para dudas sobre el tratamiento de datos personales, escribe a{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </article>
    </main>
  );
}
