import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { Hero, CTA, Photo, Symbol, Checks } from '../shared';
import { ServiceBlock, Split } from '../sections';
import { Building2, HeartPulse, Stethoscope } from 'lucide-react';
import { pageMetadata, seoDescriptions } from '../seo';
const fallbackMetadata = pageMetadata({
  title: 'Odontopediatra para pacientes neurodivergentes en León',
  description: seoDescriptions.neuro,
  path: '/pacientes-neurodivergentes',
});
export default async function Neuro() {
  const content = await getPageContent('pacientes-neurodivergentes');
  return (
    <main>
      <PageSchema slug="pacientes-neurodivergentes" />
      <Hero
        kind="neuro"
        title="Odontopediatra"
        subtitle="en León Guanajuato con atención adaptada para pacientes neurodivergentes"
        description={content.text(
          'hero',
          'content',
          'En Blümik Odontopediatría de Alto Nivel adaptamos la experiencia dental a las necesidades individuales de cada niño.',
          0,
        )}
        button={content.link('hero', 0, 'Solicitar primera visita adaptada')}
        cmsTitle={content.text('hero', 'title', '')}
        buttonHref={content.href('hero', 0)}
      />
      <section className="neuro-intro center">
        <Symbol />
        <span className="eyebrow">Atención adaptada</span>
        <h2>
          {content.rich(
            'section_2',
            'title',
            <>Atención respetuosa, cálida y personalizada</>,
            'Atención respetuosa, cálida y personalizada',
          )}
        </h2>
        <p>
          {content.rich(
            'section_2',
            'content',
            <>
              Respetamos la manera única en que cada paciente percibe el
              entorno. Trabajamos de forma gradual y orientamos a las familias
              durante el proceso odontológico.
            </>,
            'Respetamos la manera única en que cada paciente percibe el entorno. Trabajamos de forma gradual y orientamos a las familias durante el proceso odontológico.',
            0,
          )}
        </p>
      </section>
      <section id="atencion-adaptada" className="neuro-needs wide two-col">
        <div>
          <h2 className="oval-title">
            {content.rich(
              'atencion_adaptada',
              'title',
              <>
                Atención adaptada para
                <br />
                distintas necesidades
              </>,
              'Atención adaptada para distintas necesidades',
            )}
          </h2>
          <h3>
            {content.rich(
              'atencion_adaptada',
              'subheadings',
              <>Pacientes con TEA (Autismo)</>,
              'Pacientes con TEA (Autismo)',
              0,
            )}
          </h3>
          <Checks
            items={content.list(
              'atencion_adaptada',
              'items',
              [
                'Atención gradual',
                'Adaptación sensorial',
                'Lenguaje anticipatorio',
                'Respeto al ritmo del niño',
              ],
              0,
            )}
          />
          <CTA href={content.href('atencion_adaptada', 0)}>
            {content.link('atencion_adaptada', 0, '¡Contáctanos!')}
          </CTA>
        </div>
        <Photo
          className="neuro-needs-photo"
          src="IMG_0371"
          alt="Instalaciones del consultorio infantil de Blümik"
          media={content.media('atencion_adaptada', 'image1')}
        />
      </section>
      <section className="service-grid wide lavender neuro-grid">
        <div>
          <ServiceBlock
            title={content.text(
              'section_4',
              'title',
              'Pacientes con TDAH (Déficit de atención e hiperactividad)',
            )}
            items={content.list(
              'section_4',
              'items',
              [
                'Tiempos personalizados',
                'Comunicación clara',
                'Experiencias estructuradas',
                'Acompañamiento durante la consulta',
              ],
              0,
              4,
            )}
          />
          <ServiceBlock
            title={content.text(
              'section_4',
              'subheadings',
              'Pacientes con Síndrome de Down',
              0,
            )}
            items={content.list(
              'section_4',
              'items',
              [
                'Atención respetuosa',
                'Trabajo progresivo',
                'Adaptación individual',
                'Experiencias positivas',
              ],
              4,
              8,
            )}
          />
        </div>
        <ServiceBlock
          title={content.text(
            'section_4',
            'subheadings',
            'Manejo de miedo al dentista',
            1,
          )}
          icon="crecimiento"
          items={content.list(
            'section_4',
            'items',
            [
              'Primera visita adaptada',
              'Atención para pacientes sensibles',
              'Acompañamiento emocional',
              'Experiencias libres de miedo',
            ],
            8,
          )}
          button={content.link('section_4', 0, 'Solicitar orientación')}
          buttonHref={content.href('section_4', 0)}
        />
      </section>
      <section className="hospital-care wide">
        <div className="hospital-care-copy" data-reveal-group>
          <span className="eyebrow" data-reveal>
            Anestesia general hospitalaria
          </span>
          <h2 data-reveal>
            {content.rich(
              'section_5',
              'title',
              <>Cuando el tratamiento dental requiere un entorno diferente</>,
              'Cuando el tratamiento dental requiere un entorno diferente',
            )}
          </h2>
          <p data-reveal>
            {content.rich(
              'section_5',
              'content',
              <>
                En algunos niños, realizar múltiples tratamientos de manera
                convencional puede ser difícil o no ser la alternativa más
                adecuada. Después de una valoración individual, Blümik puede
                realizar una rehabilitación dental integral bajo anestesia
                general en un entorno hospitalario cuando las necesidades del
                paciente lo justifican.
              </>,
              'En algunos niños, realizar múltiples tratamientos de manera convencional puede ser difícil o no ser la alternativa más adecuada. Después de una valoración individual, Blümik puede realizar una rehabilitación dental integral bajo anestesia general en un entorno hospitalario cuando las necesidades del paciente lo justifican.',
              0,
            )}
          </p>
          <div className="hospital-cases" data-reveal>
            <h3>
              {content.rich(
                'section_5',
                'subheadings',
                <>¿En qué casos puede considerarse?</>,
                '¿En qué casos puede considerarse?',
                0,
              )}
            </h3>
            <ul>
              <li>
                {content.rich(
                  'section_5',
                  'items',
                  <>Niños pequeños que requieren tratamientos extensos.</>,
                  'Niños pequeños que requieren tratamientos extensos.',
                  0,
                )}
              </li>
              <li>
                {content.rich(
                  'section_5',
                  'items',
                  <>
                    Pacientes con necesidades específicas que dificultan la
                    atención dental convencional.
                  </>,
                  'Pacientes con necesidades específicas que dificultan la atención dental convencional.',
                  1,
                )}
              </li>
              <li>
                {content.rich(
                  'section_5',
                  'items',
                  <>
                    Casos en los que numerosos procedimientos en varias citas no
                    resulten convenientes para el paciente.
                  </>,
                  'Casos en los que numerosos procedimientos en varias citas no resulten convenientes para el paciente.',
                  2,
                )}
              </li>
              <li>
                {content.rich(
                  'section_5',
                  'items',
                  <>
                    Pacientes en quienes la valoración determine que esta opción
                    puede ofrecer un manejo más adecuado.
                  </>,
                  'Pacientes en quienes la valoración determine que esta opción puede ofrecer un manejo más adecuado.',
                  3,
                )}
              </li>
            </ul>
          </div>
          <div className="hospital-action" data-reveal>
            <CTA href={content.href('section_5', 0)}>
              {content.rich(
                'section_5',
                'links',
                <>Agendar una valoración</>,
                'Agendar una valoración',
                0,
              )}
            </CTA>
            <p>
              {content.rich(
                'section_5',
                'content',
                <>Conoce si esta alternativa es adecuada para tu pequeño.</>,
                'Conoce si esta alternativa es adecuada para tu pequeño.',
                1,
              )}
            </p>
          </div>
        </div>
        <Photo
          className="hospital-care-photo"
          src="IMG_9054"
          alt="Equipo odontopediátrico de Blümik realizando un procedimiento en un entorno hospitalario"
          media={content.media('section_5', 'image1')}
        />
        <div className="hospital-procedure" data-reveal-group>
          <h3 data-reveal>
            {content.rich(
              'section_5',
              'subheadings',
              <>Durante el procedimiento</>,
              'Durante el procedimiento',
              1,
            )}
          </h3>
          <div className="hospital-procedure-grid">
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <Stethoscope />
              </span>
              <h4>Atención odontopediátrica</h4>
              <p>
                {content.rich(
                  'section_5',
                  'content',
                  <>El tratamiento dental es realizado por odontopediatría.</>,
                  'El tratamiento dental es realizado por odontopediatría.',
                  2,
                )}
              </p>
            </article>
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <Building2 />
              </span>
              <h4>Entorno hospitalario</h4>
              <p>
                {content.rich(
                  'section_5',
                  'content',
                  <>El procedimiento se lleva a cabo dentro de un hospital.</>,
                  'El procedimiento se lleva a cabo dentro de un hospital.',
                  3,
                )}
              </p>
            </article>
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <HeartPulse />
              </span>
              <h4>Vigilancia médica</h4>
              <p>
                {content.rich(
                  'section_5',
                  'content',
                  <>
                    La anestesia general y la vigilancia están a cargo del
                    equipo médico de anestesiología.
                  </>,
                  'La anestesia general y la vigilancia están a cargo del equipo médico de anestesiología.',
                  4,
                )}
              </p>
            </article>
          </div>
        </div>
        <aside className="hospital-note" data-reveal>
          <strong>Valoración previa indispensable</strong>
          <p>
            {content.rich(
              'section_5',
              'content',
              <>
                Esta alternativa no se indica para todos los pacientes. Cada
                caso requiere valoración odontopediátrica, revisión de
                antecedentes y la evaluación médica correspondiente. El
                tratamiento se planifica previamente para realizar los
                procedimientos necesarios de manera segura y reducir
                experiencias odontológicas complejas cuando el caso lo requiere.
              </>,
              'Esta alternativa no se indica para todos los pacientes. Cada caso requiere valoración odontopediátrica, revisión de antecedentes y la evaluación médica correspondiente. El tratamiento se planifica previamente para realizar los procedimientos necesarios de manera segura y reducir experiencias odontológicas complejas cuando el caso lo requiere.',
              5,
            )}
          </p>
        </aside>
      </section>
      <Split
        color="lavender"
        title={content.text(
          'section_6',
          'title',
          'Nuestro enfoque de acompañamiento',
        )}
        description={content.text(
          'section_6',
          'content',
          'Creamos un entorno tranquilo y seguro, con comunicación clara para niños y familias.',
          0,
        )}
        carousel={[
          {
            src: 'IMG_0513',
            alt: 'Atención odontopediátrica adaptada durante una consulta infantil',
            media: content.media('section_6', 'image1'),
          },
          {
            src: 'IMG_0099',
            alt: 'Odontopediatra acompañando a una niña durante la consulta',
            media: content.media('section_6', 'image2'),
          },
          {
            src: 'IMG_6435',
            alt: 'Paciente infantil familiarizándose con el entorno de la clínica',
            media: content.media('section_6', 'image3'),
          },
          {
            src: 'IMG_0476',
            alt: 'Sala infantil preparada para el acompañamiento de las familias',
            media: content.media('section_6', 'image4'),
          },
          {
            src: 'IMG_0442',
            alt: 'Consultorio infantil diseñado para una atención respetuosa',
            media: content.media('section_6', 'image5'),
          },
        ]}
      />
      <Split
        color="lavender"
        reverse
        title={content.text(
          'section_7',
          'title',
          'Odontopediatra en León Guanajuato con atención infantil respetuosa y adaptada',
        )}
        description={content.text(
          'section_7',
          'content',
          'En Blümik Odontopediatría de Alto Nivel acompañamos a cada familia mediante experiencias dentales cálidas, seguras y adaptadas.',
          0,
        )}
        photo="IMG_0463"
        button={content.link('section_7', 0, 'Agendar atención')}
        buttonHref={content.href('section_7', 0)}
        media={content.media('section_7', 'image1')}
      />
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('pacientes-neurodivergentes', fallbackMetadata);
}
