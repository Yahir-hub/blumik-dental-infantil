import { HeartHandshake, RefreshCw, Stethoscope, Users } from 'lucide-react';
import { AutoCarousel } from '../motion';
import { CTA, LocationSection, Photo } from '../shared';
import { BreadcrumbJsonLd, pageMetadata, seoDescriptions } from '../seo';

export const metadata = pageMetadata({
  title: 'Conoce a tus profesionales',
  description: seoDescriptions.professionals,
  path: '/profesionales',
});

const approaches = [
  {
    icon: Stethoscope,
    title: 'Odontopediatría infantil',
    description:
      'Atención para bebés, niños y adolescentes con prevención, diagnóstico y tratamientos según su etapa de crecimiento.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención adaptada',
    description:
      'Acompañamiento gradual y respetuoso para pacientes con distintas necesidades sensoriales y emocionales.',
  },
  {
    icon: Users,
    title: 'Trabajo colaborativo',
    description:
      'Cuando el tratamiento lo requiere, colaboramos con especialistas para complementar la atención infantil.',
  },
];

export default function Professionals() {
  return (
    <main>
      <BreadcrumbJsonLd path="/profesionales" />
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
          Una clínica pensada desde la perspectiva de los niños
        </h1>
        <p data-reveal data-reveal-direction="up">
          Un espacio de odontopediatría que busca unir atención profesional,
          claridad para las familias y una experiencia cálida para cada
          paciente.
        </p>
      </section>

      <section className="founder-profile wide two-col">
        <Photo
          className="founder-photo"
          src="IMG_8415"
          alt="Fundadora de Blümik revisando estudios odontopediátricos"
        />
        <div className="founder-copy" data-reveal-group>
          <span className="eyebrow" data-reveal>
            Fundadora de Blümik
          </span>
          <h2 data-reveal>Atención odontopediátrica especializada</h2>
          <p data-reveal>
            Atención dental para bebés, niños y adolescentes, con especial
            interés en la atención de pacientes neurodivergentes. Cuando cada
            caso lo requiere, puede realizarse rehabilitación dental bajo
            anestesia general en un entorno hospitalario.
          </p>
          <div className="professional-update" data-reveal>
            <span className="professional-update-icon" aria-hidden="true">
              <RefreshCw />
            </span>
            <div>
              <strong>Actualización constante</strong>
              <p>
                El equipo mantiene una formación continua para actualizar sus
                conocimientos, cuidados y uso de tecnología en la atención
                odontopediátrica.
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
        <h2>Profesionales que acompañan su experiencia</h2>
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
            },
            {
              src: 'IMG_0383',
              alt: 'Área clínica de Blümik con iluminación ambiental',
            },
            {
              src: 'IMG_0436-2',
              alt: 'Consultorio de Blümik con decoración de globo aerostático',
            },
            {
              src: 'IMG_0441',
              alt: 'Área infantil y mobiliario del consultorio Blümik',
            },
            {
              src: 'IMG_0442',
              alt: 'Consultorio infantil con alberca de pelotas',
            },
            {
              src: 'IMG_0444',
              alt: 'Sillón dental bajo el techo decorado del consultorio',
            },
            {
              src: 'IMG_0460',
              alt: 'Consultorio dental infantil con mural de naturaleza',
            },
            {
              src: 'IMG_0463',
              alt: 'Puerta infantil decorativa dentro de Blümik',
            },
            {
              src: 'IMG_0466',
              alt: 'Recepción de la clínica Blümik',
            },
            {
              src: 'IMG_0467',
              alt: 'Pasillo decorado de las instalaciones de Blümik',
            },
            {
              src: 'IMG_0476',
              alt: 'Sala infantil de espera en Blümik',
            },
          ]}
        />
        <div>
          <span className="eyebrow">Conoce Blümik</span>
          <h2>Instalaciones pensadas para la atención infantil</h2>
          <p>
            Conoce los espacios donde acompañamos a bebés, niños, adolescentes y
            sus familias durante su experiencia dental.
          </p>
          <CTA>Agendar una visita</CTA>
        </div>
      </section>
      <LocationSection className="professionals-location" />
    </main>
  );
}
