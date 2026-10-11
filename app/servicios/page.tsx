import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { Notebook, Shield } from 'lucide-react';
import { Hero, CTA, Photo, Symbol, Checks } from '../shared';
import { ServiceBlock, Split } from '../sections';
import { pageMetadata, seoDescriptions } from '../seo';
const fallbackMetadata = pageMetadata({
  title: 'Servicios de odontopediatría en León',
  description: seoDescriptions.services,
  path: '/servicios',
});
export default async function Services() {
  const content = await getPageContent('servicios');
  return (
    <main>
      <PageSchema slug="servicios" />
      <Hero
        kind="servicios"
        title={
          <>
            {' '}
            <span className="hero-prefix">Servicios de </span>odontopediatra
          </>
        }
        subtitle="en León Guanajuato"
        description={content.text(
          'hero',
          'content',
          'En Blümik Odontopediatría de Alto Nivel ofrecemos atención dental infantil preventiva, restaurativa y adaptada.',
          0,
        )}
        button={content.link('hero', 0, 'Solicitar valoración')}
        cmsTitle={content.text('hero', 'title', '')}
        buttonHref={content.href('hero', 0)}
      />
      <section className="service-intro center">
        <Symbol green />
        <span className="eyebrow">Nuestros servicios</span>
        <h2>
          {content.rich(
            'section_2',
            'title',
            <>Atención odontopediátrica especializada</>,
            'Atención odontopediátrica especializada',
          )}
        </h2>
        <p>
          {content.rich(
            'section_2',
            'content',
            <>
              Acompañamos el crecimiento dental de bebés, niños y adolescentes
              con prevención y atención adaptada, respetando el ritmo de cada
              paciente.
            </>,
            'Acompañamos el crecimiento dental de bebés, niños y adolescentes con prevención y atención adaptada, respetando el ritmo de cada paciente.',
            0,
          )}
        </p>
        <Photo
          src="IMG_0466"
          alt="Recepción de la clínica Blümik"
          media={content.media('section_2', 'image1')}
        />
      </section>
      <section
        id="servicios-odontopediatricos"
        className="prevention wide two-col"
      >
        <div>
          <h2 className="oval-title">
            {content.rich(
              'servicios_odontopediatricos',
              'title',
              <>Servicios odontopediátricos</>,
              'Servicios odontopediátricos',
            )}
          </h2>
          <h3>
            {content.rich(
              'servicios_odontopediatricos',
              'subheadings',
              <>Prevención y cuidado temprano infantil</>,
              'Prevención y cuidado temprano infantil',
              0,
            )}
          </h3>
          <p>
            {content.rich(
              'servicios_odontopediatricos',
              'content',
              <>
                Trabajamos en la prevención dental desde las primeras etapas de
                crecimiento para favorecer una sonrisa saludable.
              </>,
              'Trabajamos en la prevención dental desde las primeras etapas de crecimiento para favorecer una sonrisa saludable.',
              0,
            )}
          </p>
          <Checks
            items={content.list(
              'servicios_odontopediatricos',
              'items',
              [
                'Limpiezas dentales infantiles',
                'Aplicación profesional de flúor',
                'Selladores: nuestros Escudos Anticaries',
                'Técnicas de cepillado según la etapa de crecimiento',
                'Evaluación de riesgo de caries',
                'Educación y orientación personalizada para madres y padres',
              ],
              0,
            )}
          />
          <CTA href={content.href('servicios_odontopediatricos', 0)}>
            {content.link('servicios_odontopediatricos', 0, '¡Contáctanos!')}
          </CTA>
        </div>
        <Photo
          className="arch"
          src="IMG_0159"
          alt="Doctora de Jessie, niña y doctor de Spider-Man en el sillón dental"
          media={content.media('servicios_odontopediatricos', 'image1')}
        />
      </section>
      <section className="service-grid wide" id="primera-visita">
        <div>
          <ServiceBlock
            title={content.text(
              'primera_visita',
              'title',
              'Odontología de mínima invasión',
            )}
            description={content.text(
              'primera_visita',
              'content',
              'Aplicamos tratamientos enfocados en el manejo preventivo y conservador de la salud bucal infantil.',
              0,
            )}
            items={content.list(
              'primera_visita',
              'items',
              [
                'Inactivación de lesiones de caries',
                'Fluoruro diamino de plata (SDF)',
                'Remoción selectiva de caries',
                'Selladores anti caries',
                'Manejo preventivo temprano',
              ],
              0,
              5,
            )}
          />
          <ServiceBlock
            title={content.text(
              'primera_visita',
              'subheadings',
              'Odontología restaurativa infantil',
              0,
            )}
            description={content.text(
              'primera_visita',
              'content',
              'Realizamos tratamientos restaurativos enfocados en la funcionalidad y cuidado dental de cada paciente.',
              1,
            )}
            items={content.list(
              'primera_visita',
              'items',
              [
                'Resinas estéticas infantiles',
                'Coronas estéticas pediátricas',
                'Coronas metálicas infantiles',
                'Terapias pulpares',
                'Reconstrucciones dentales',
              ],
              5,
              10,
            )}
          />
        </div>
        <div>
          <ServiceBlock
            icon="crecimiento"
            title={content.text(
              'primera_visita',
              'subheadings',
              'Crecimiento y desarrollo infantil',
              1,
            )}
            description={content.text(
              'primera_visita',
              'content',
              'Evaluamos el desarrollo maxilar y dental para detectar oportunamente alteraciones funcionales o de mordida.',
              2,
            )}
            items={content.list(
              'primera_visita',
              'items',
              [
                'Evaluación de crecimiento maxilar',
                'Aparatos ortopédicos infantiles',
                'Ortodoncia interceptiva',
                'Brackets 4 por 2',
                'Corrección temprana de mordida',
                'Manejo de hábitos orales',
              ],
              10,
              16,
            )}
          />
          <ServiceBlock
            icon="habitos"
            title={content.text(
              'primera_visita',
              'subheadings',
              'Tratamiento de hábitos orales',
              2,
            )}
            description={content.text(
              'primera_visita',
              'content',
              'Atendemos hábitos que pueden influir en el desarrollo oral y maxilar infantil.',
              3,
            )}
            items={content.list(
              'primera_visita',
              'items',
              [
                'Respiración bucal',
                'Succión digital',
                'Uso prolongado de chupón o biberón',
                'Interposición lingual',
              ],
              16,
            )}
          />
        </div>
      </section>
      <Split
        title={content.text('section_5', 'title', 'Odontología para bebés')}
        description={content.text(
          'section_5',
          'content',
          'Acompañamos el desarrollo oral desde los primeros meses de vida mediante atención preventiva y orientación personalizada.',
          0,
        )}
        items={content.list(
          'section_5',
          'items',
          [
            'Desarrollo de maxilares',
            'Erupción dental',
            'Encía y tejidos blandos',
            'Riesgo de lesiones de caries temprana',
            'Evaluación del frenillo lingual inferior',
            'Hábitos de alimentación y succión',
          ],
          0,
        )}
        photo="IMG_0121"
        media={content.media('section_5', 'image1')}
      />
      <Split
        reverse
        color="green"
        title={content.text(
          'section_6',
          'title',
          'Traumatismos dentales infantiles',
        )}
        description={content.text(
          'section_6',
          'content',
          'Atendemos lesiones dentales infantiles que requieren valoración profesional.',
          0,
        )}
        items={content.list(
          'section_6',
          'items',
          [
            'Fracturas dentales',
            'Golpes en dientes temporales y permanentes',
            'Luxaciones',
            'Avulsiones dentales',
            'Lesiones en labios y tejidos blandos',
          ],
          0,
        )}
        photo="IMG_0512"
        media={content.media('section_6', 'image1')}
      />
      <Split
        title={content.text(
          'section_7',
          'title',
          'Atención adaptada para pacientes neurodivergentes',
        )}
        description={content.text(
          'section_7',
          'content',
          'Nuestro enfoque contempla la adaptación de la experiencia dental para pacientes con distintas necesidades sensoriales y emocionales.',
          0,
        )}
        items={content.list(
          'section_7',
          'items',
          [
            'Atención para pacientes con TEA',
            'Atención para pacientes con TDAH',
            'Atención para pacientes con Síndrome de Down',
            'Manejo de miedo al dentista',
            'Adaptación sensorial',
            'Tiempos personalizados',
            'Lenguaje anticipatorio',
            'Primera visita adaptada',
            'Trabajo progresivo',
            'Respeto al ritmo del niño',
          ],
          0,
        )}
        photo="IMG_6435"
        media={content.media('section_7', 'image1')}
      />
      <Split
        reverse
        color="green"
        title={content.text(
          'section_8',
          'title',
          'Manejo de miedo al dentista',
        )}
        description={content.text(
          'section_8',
          'content',
          'Creamos experiencias más tranquilas y respetuosas para niños sensibles o con experiencias dentales previas difíciles.',
          0,
        )}
        items={content.list(
          'section_8',
          'items',
          [
            'Acompañamiento en primeras visitas',
            'Atención para pacientes sensibles',
            'Atención para niños neurodivergentes',
            'Manejo emocional durante la consulta',
          ],
          0,
        )}
        photo="IMG_0514"
        media={content.media('section_8', 'image1')}
      />
      <section className="service-grid wide">
        <ServiceBlock
          icon="tecnologia"
          title={content.text(
            'section_9',
            'title',
            'Tecnología y diagnóstico infantil',
          )}
          description={content.text(
            'section_9',
            'content',
            'Utilizamos herramientas de apoyo visual y diagnóstico para favorecer una atención más clara y preventiva.',
            0,
          )}
          items={content.list(
            'section_9',
            'items',
            [
              'Cámara intraoral',
              'Radiografías digitales',
              'Diagnóstico visual para papás',
              'Planificación preventiva',
            ],
            0,
            4,
          )}
        />
        <ServiceBlock
          icon="primera"
          title={content.text(
            'section_9',
            'subheadings',
            'Primera visita dental infantil',
            0,
          )}
          description={content.text(
            'section_9',
            'content',
            'Orientamos a las familias para que la primera visita dental sea positiva y segura.',
            1,
          )}
          items={content.list(
            'section_9',
            'items',
            [
              'Cuándo realizar la primera visita',
              'Qué esperar durante la consulta',
              'Cómo preparar al niño',
              'Evaluación integral',
              'Experiencia emocional positiva',
            ],
            4,
          )}
          button={content.link('section_9', 0, 'Servicios Odontopediátricos')}
          buttonHref={content.href('section_9', 0)}
        />
      </section>
      <section id="servicios-destacados" className="service-pricing wide">
        <span className="eyebrow">Opciones de atención</span>
        <h2 className="oval-title">
          {content.rich(
            'servicios_destacados',
            'title',
            <>Servicios destacados</>,
            'Servicios destacados',
          )}
        </h2>
        <p>
          {content.rich(
            'servicios_destacados',
            'content',
            <>
              Conoce qué incluye la primera visita y el paquete preventivo de
              Blümik.
            </>,
            'Conoce qué incluye la primera visita y el paquete preventivo de Blümik.',
            0,
          )}
        </p>
        <div className="price-grid" data-reveal-group>
          <article className="price-card" data-reveal>
            <span className="card-icon" aria-hidden="true">
              <Notebook />
            </span>
            <div>
              <h3>
                {content.rich(
                  'servicios_destacados',
                  'subheadings',
                  <>Primera visita Blümik</>,
                  'Primera visita Blümik',
                  0,
                )}
              </h3>
              <p>
                {content.rich(
                  'servicios_destacados',
                  'content',
                  <>
                    Incluye una consulta completa para conocer al paciente y
                    orientar a su familia.
                  </>,
                  'Incluye una consulta completa para conocer al paciente y orientar a su familia.',
                  1,
                )}
              </p>
              <Checks
                items={content.list(
                  'servicios_destacados',
                  'items',
                  [
                    'Valoración integral',
                    'Fotografías intraorales',
                    'Radiografía, en caso de ser necesario',
                    'Diagnóstico personalizado',
                    'Entrenamiento personalizado para mamá y papá',
                    'Cómo cepillar correctamente',
                    'Qué cepillo y pasta son adecuados según su edad',
                    'Cómo prevenir las lesiones de caries en casa',
                  ],
                  0,
                  8,
                )}
              />
              <CTA href={content.href('servicios_destacados', 0)}>
                {content.rich(
                  'servicios_destacados',
                  'links',
                  <>Agendar primera visita</>,
                  'Agendar primera visita',
                  0,
                )}
              </CTA>
            </div>
          </article>
          <article className="price-card" data-reveal>
            <span className="card-icon" aria-hidden="true">
              <Shield />
            </span>
            <div>
              <h3>
                {content.rich(
                  'servicios_destacados',
                  'subheadings',
                  <>Paquete preventivo Blümik</>,
                  'Paquete preventivo Blümik',
                  1,
                )}
              </h3>
              <p>
                {content.rich(
                  'servicios_destacados',
                  'content',
                  <>
                    Primera visita y limpieza dental preventiva. La mejor forma
                    de comenzar el cuidado dental de tu pequeño.
                  </>,
                  'Primera visita y limpieza dental preventiva. La mejor forma de comenzar el cuidado dental de tu pequeño.',
                  2,
                )}
              </p>
              <Checks
                items={content.list(
                  'servicios_destacados',
                  'items',
                  [
                    'Valoración odontopediátrica integral',
                    'Diagnóstico personalizado',
                    'Técnica de cepillado',
                    'Tour con cámara intraoral',
                    'Higiene dental preventiva infantil',
                    'Eliminación de placa bacteriana',
                    'Pulido dental suave',
                    'Aplicación de flúor preventivo',
                    'Recomendaciones preventivas para casa',
                    'Plan de tratamiento personalizado si fuera necesario',
                  ],
                  8,
                )}
              />
              <CTA href={content.href('servicios_destacados', 1)}>
                {content.rich(
                  'servicios_destacados',
                  'links',
                  <>Agendar cita</>,
                  'Agendar cita',
                  1,
                )}
              </CTA>
            </div>
          </article>
        </div>
      </section>
      <section className="service-close center">
        <h2>
          {content.rich(
            'section_11',
            'title',
            <>
              Odontopediatra en León Guanajuato para
              <br />
              atención preventiva y especializada
            </>,
            'Odontopediatra en León Guanajuato para atención preventiva y especializada',
          )}
        </h2>
        <p>
          {content.rich(
            'section_11',
            'content',
            <>
              En Blümik Odontopediatría de Alto Nivel acompañamos el desarrollo
              dental infantil mediante atención cálida y profesional.
            </>,
            'En Blümik Odontopediatría de Alto Nivel acompañamos el desarrollo dental infantil mediante atención cálida y profesional.',
            0,
          )}
        </p>
        <CTA href={content.href('section_11', 0)}>
          {content.rich(
            'section_11',
            'links',
            <>Agendar consulta infantil</>,
            'Agendar consulta infantil',
            0,
          )}
        </CTA>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('servicios', fallbackMetadata);
}
