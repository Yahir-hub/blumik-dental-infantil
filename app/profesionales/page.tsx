import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { HeartHandshake, RefreshCw, Stethoscope, Users } from 'lucide-react';
import { AutoCarousel } from '../motion';
import { CTA, LocationSection, Photo } from '../shared';
import { pageMetadata, seoDescriptions } from '../seo';

const fallbackMetadata = pageMetadata({
  title: 'Conoce a tus profesionales',
  description: seoDescriptions.professionals,
  path: '/profesionales',
});

export default async function Professionals() {
  const content = await getPageContent('profesionales');
  const approaches = [
    {
      icon: Stethoscope,
      title: content.text(
        'section_3',
        'subheadings',
        'Odontopediatría infantil',
        0,
      ),
      description: content.text(
        'section_3',
        'content',
        'Atención para bebés, niños y adolescentes con prevención, diagnóstico y tratamientos según su etapa de crecimiento.',
        0,
      ),
    },
    {
      icon: HeartHandshake,
      title: content.text('section_3', 'subheadings', 'Atención adaptada', 1),
      description: content.text(
        'section_3',
        'content',
        'Acompañamiento gradual y respetuoso para pacientes con distintas necesidades sensoriales y emocionales.',
        1,
      ),
    },
    {
      icon: Users,
      title: content.text(
        'section_3',
        'subheadings',
        'Trabajo colaborativo',
        2,
      ),
      description: content.text(
        'section_3',
        'content',
        'Cuando el tratamiento lo requiere, colaboramos con especialistas para complementar la atención infantil.',
        2,
      ),
    },
  ];

  return (
    <main>
      <PageSchema slug="profesionales" />
      <section className="professionals-hero wide">
        <div
          className="professionals-hero-background"
          role="img"
          aria-label="Fachada exterior del consultorio Blümik"
        />
        <span className="eyebrow" data-reveal data-reveal-direction="left">
          Conoce Blümik
        </span>
        <h1 data-reveal data-reveal-direction="right">
          {content.rich(
            'hero',
            'title',
            <>Una clínica pensada desde la perspectiva de los niños</>,
            'Una clínica pensada desde la perspectiva de los niños',
          )}
        </h1>
        <p data-reveal data-reveal-direction="up">
          {content.rich(
            'hero',
            'content',
            <>
              Un espacio de odontopediatría que busca unir atención profesional,
              claridad para las familias y una experiencia cálida para cada
              paciente.
            </>,
            'Un espacio de odontopediatría que busca unir atención profesional, claridad para las familias y una experiencia cálida para cada paciente.',
            0,
          )}
        </p>
      </section>

      <section className="founder-profile wide two-col">
        <Photo
          className="founder-photo"
          src="IMG_8415"
          alt="Fundadora de Blümik revisando estudios odontopediátricos"
          media={content.media('section_2', 'image1')}
        />
        <div className="founder-copy" data-reveal-group>
          <span className="eyebrow" data-reveal>
            Fundadora de Blümik
          </span>
          <h2 data-reveal>
            {content.rich(
              'section_2',
              'title',
              <>Atención odontopediátrica especializada</>,
              'Atención odontopediátrica especializada',
            )}
          </h2>
          <p data-reveal>
            {content.rich(
              'section_2',
              'content',
              <>
                Atención dental para bebés, niños y adolescentes, con especial
                interés en la atención de pacientes neurodivergentes. Cuando
                cada caso lo requiere, puede realizarse rehabilitación dental
                bajo anestesia general en un entorno hospitalario.
              </>,
              'Atención dental para bebés, niños y adolescentes, con especial interés en la atención de pacientes neurodivergentes. Cuando cada caso lo requiere, puede realizarse rehabilitación dental bajo anestesia general en un entorno hospitalario.',
              0,
            )}
          </p>
          <div className="professional-update" data-reveal>
            <span className="professional-update-icon" aria-hidden="true">
              <RefreshCw />
            </span>
            <div>
              <strong>Actualización constante</strong>
              <p>
                {content.rich(
                  'section_2',
                  'content',
                  <>
                    El equipo mantiene una formación continua para actualizar
                    sus conocimientos, cuidados y uso de tecnología en la
                    atención odontopediátrica.
                  </>,
                  'El equipo mantiene una formación continua para actualizar sus conocimientos, cuidados y uso de tecnología en la atención odontopediátrica.',
                  1,
                )}
              </p>
            </div>
          </div>
          <dl className="professional-data" data-reveal>
            <div>
              <dt>Cargo</dt>
              <dd>Fundadora de Blümik</dd>
            </div>
            <div>
              <dt>Especialidad</dt>
              <dd>Odontopediatría</dd>
            </div>
            <div>
              <dt>Cédula profesional</dt>
              <dd>11910943</dd>
            </div>
            <div>
              <dt>Cédula de especialidad</dt>
              <dd>16-037353-E</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="professionals-intro wide">
        <span className="eyebrow">Cómo acompañamos</span>
        <h2>
          {content.rich(
            'section_3',
            'title',
            <>Profesionales que acompañan su experiencia</>,
            'Profesionales que acompañan su experiencia',
          )}
        </h2>
        <div className="professional-grid" data-reveal-group>
          {approaches.map(({ icon: Icon, title, description }) => (
            <article className="professional-card" data-reveal key={title}>
              <span className="card-icon" aria-hidden="true">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="professionals-close wide two-col">
        <AutoCarousel
          label="Instalaciones de Blümik"
          images={[
            {
              src: 'IMG_0371',
              alt: 'Vista general del consultorio infantil de Blümik',
              media: content.media('section_4', 'image1'),
            },
            {
              src: 'IMG_0383',
              alt: 'Área clínica de Blümik con iluminación ambiental',
              media: content.media('section_4', 'image2'),
            },
            {
              src: 'IMG_0436-2',
              alt: 'Consultorio de Blümik con decoración de globo aerostático',
              media: content.media('section_4', 'image3'),
            },
            {
              src: 'IMG_0441',
              alt: 'Área infantil y mobiliario del consultorio Blümik',
              media: content.media('section_4', 'image4'),
            },
            {
              src: 'IMG_0442',
              alt: 'Consultorio infantil con alberca de pelotas',
              media: content.media('section_4', 'image5'),
            },
            {
              src: 'IMG_0444',
              alt: 'Sillón dental bajo el techo decorado del consultorio',
              media: content.media('section_4', 'image6'),
            },
            {
              src: 'IMG_0460',
              alt: 'Consultorio dental infantil con mural de naturaleza',
              media: content.media('section_4', 'image7'),
            },
            {
              src: 'IMG_0463',
              alt: 'Puerta infantil decorativa dentro de Blümik',
              media: content.media('section_4', 'image8'),
            },
            {
              src: 'IMG_0466',
              alt: 'Recepción de la clínica Blümik',
              media: content.media('section_4', 'image9'),
            },
            {
              src: 'IMG_0467',
              alt: 'Pasillo decorado de las instalaciones de Blümik',
              media: content.media('section_4', 'image10'),
            },
            {
              src: 'IMG_0476',
              alt: 'Sala infantil de espera en Blümik',
              media: content.media('section_4', 'image11'),
            },
          ]}
        />
        <div>
          <span className="eyebrow">Conoce Blümik</span>
          <h2>
            {content.rich(
              'section_4',
              'title',
              <>Instalaciones pensadas para la atención infantil</>,
              'Instalaciones pensadas para la atención infantil',
            )}
          </h2>
          <p>
            {content.rich(
              'section_4',
              'content',
              <>
                Conoce los espacios donde acompañamos a bebés, niños,
                adolescentes y sus familias durante su experiencia dental.
              </>,
              'Conoce los espacios donde acompañamos a bebés, niños, adolescentes y sus familias durante su experiencia dental.',
              0,
            )}
          </p>
          <CTA href={content.href('section_4', 0)}>
            {content.rich(
              'section_4',
              'links',
              <>Agendar una visita</>,
              'Agendar una visita',
              0,
            )}
          </CTA>
        </div>
      </section>
      <LocationSection
        className="professionals-location"
        title={content.text('section_5', 'title', 'Visítanos')}
      />
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('profesionales', fallbackMetadata);
}
