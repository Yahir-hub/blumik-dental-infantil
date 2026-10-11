import { PageSchema } from '@/lib/hyronix/schema';
import { getPageContent } from '@/lib/hyronix/pages';
import { publishedMetadata } from '@/lib/hyronix/metadata';
import { Hero, CTA, Photo, Mascot, Symbol, Checks } from './shared';
import {
  Heart,
  HeartHandshake,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';
import { LazyVideo, PhilosophyTransform } from './motion';

export default async function Home() {
  const content = await getPageContent('home');
  const reasons = [
    {
      icon: HeartHandshake,
      title: content.text('section_4', 'subheadings', 'Atención adaptada', 0),
      description: content.text(
        'section_4',
        'content',
        'Respetamos el ritmo y las necesidades de cada niño, incluidos pacientes con autismo, TDAH y síndrome de Down.',
        0,
      ),
    },
    {
      icon: Heart,
      title: content.text(
        'section_4',
        'subheadings',
        'Experiencias positivas',
        1,
      ),
      description: content.text(
        'section_4',
        'content',
        'Buscamos que cada visita sea tranquila y libre de miedo.',
        1,
      ),
    },
    {
      icon: Users,
      title: content.text(
        'section_4',
        'subheadings',
        'Acompañamiento familiar',
        2,
      ),
      description: content.text(
        'section_4',
        'content',
        'Orientamos a madres y padres con comunicación clara en cada etapa.',
        2,
      ),
    },
    {
      icon: Shield,
      title: content.text('section_4', 'subheadings', 'Prevención temprana', 3),
      description: content.text(
        'section_4',
        'content',
        'Promovemos el cuidado bucal desde los primeros años de vida.',
        3,
      ),
    },
    {
      icon: Stethoscope,
      title: content.text(
        'section_4',
        'subheadings',
        'Actualización continua',
        4,
      ),
      description: content.text(
        'section_4',
        'content',
        'Nuestra atención se apoya en preparación y compromiso profesional.',
        4,
      ),
    },
  ];

  return (
    <main>
      <PageSchema slug="home" />
      <Hero
        kind="inicio"
        title="Odontopediatra"
        subtitle={
          <>
            en León Guanajuato para bebés, niños
            <br /> y adolescentes
          </>
        }
        description={content.text(
          'hero',
          'content',
          'En Blümik Odontopediatría de Alto Nivel acompañamos el crecimiento de cada niño con atención dental cálida, segura y especializada.',
          0,
        )}
        button={content.link('hero', 0, 'Agendar valoración')}
        cmsTitle={content.text('hero', 'title', '')}
        buttonHref={content.href('hero', 0)}
      />
      <section className="intro home-intro" id="conoce-blumik">
        <h2>
          {content.rich(
            'conoce_blumik',
            'title',
            <>Cuidado dental infantil</>,
            'Cuidado dental infantil',
          )}
        </h2>
        <p>
          {content.rich(
            'conoce_blumik',
            'content',
            <>
              En <strong>Blümik Odontopediatría de Alto Nivel</strong> somos una
              clínica especializada en la atención de bebés, niños y
              adolescentes en León, Guanajuato. Nuestro enfoque nace de la
              importancia de crear experiencias dentales positivas desde las
              primeras etapas de vida, ayudando a que cada paciente pueda
              sentirse tranquilo, escuchado y acompañado durante su atención.
            </>,
            'En Blümik Odontopediatría de Alto Nivel somos una clínica especializada en la atención de bebés, niños y adolescentes en León, Guanajuato. Nuestro enfoque nace de la importancia de crear experiencias dentales positivas desde las primeras etapas de vida, ayudando a que cada paciente pueda sentirse tranquilo, escuchado y acompañado durante su atención.',
            0,
          )}
        </p>
        <div className="center">
          <CTA href={content.href('conoce_blumik', 0)}>
            {content.link('conoce_blumik', 0, '¡Contáctanos!')}
          </CTA>
        </div>
      </section>
      <section className="home-gallery gray" data-reveal-group>
        <Photo
          src="IMG_8415"
          alt="Odontopediatra revisando radiografías con vestuario de Chase"
          media={content.media('section_3', 'image1')}
        />
        <Photo
          className="photo-show-full"
          src="IMG_0099"
          alt="Odontopediatra con uniforme morado junto a una niña"
          media={content.media('section_3', 'image2')}
        />
      </section>
      <section className="reasons">
        <div className="reasons-heading">
          <Mascot />
          <h2>
            {content.rich(
              'section_4',
              'title',
              <>
                ¿Por qué elegir a Blümik
                <br />
                Odontopediatría de Alto Nivel?
              </>,
              '¿Por qué elegir a Blümik Odontopediatría de Alto Nivel?',
            )}
          </h2>
          <CTA href={content.href('section_4', 0)}>
            {content.link('section_4', 0, '¡Contáctanos!')}
          </CTA>
        </div>
        <div className="reason-grid">
          {reasons.map(({ icon: Icon, title, description }, i) => (
            <article className={'reason reason-' + i} key={title} data-reveal>
              <span className="card-icon" aria-hidden="true">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
          <div className="reason-final">
            <Symbol />
            <CTA href={content.href('section_4', 1)}>
              {content.rich(
                'section_4',
                'links',
                <>Solicitar primera visita dental</>,
                'Solicitar primera visita dental',
                1,
              )}
            </CTA>
          </div>
        </div>
      </section>
      <section className="specialists lavender">
        <Photo
          className="arch"
          src="IMG_0442"
          alt="Consultorio infantil con alberca de pelotas"
          media={content.media('section_5', 'image1')}
        />
        <div className="purple-card">
          <h3>
            {content.rich(
              'section_5',
              'title',
              <>Especialistas que colaboran en la clínica</>,
              'Especialistas que colaboran en la clínica',
            )}
          </h3>
          <p>
            {content.rich(
              'section_5',
              'content',
              <>
                Cuando el tratamiento lo requiere, contamos con la participación
                de especialistas para complementar la atención infantil.
              </>,
              'Cuando el tratamiento lo requiere, contamos con la participación de especialistas para complementar la atención infantil.',
              0,
            )}
          </p>
          <Checks
            items={content.list(
              'section_5',
              'items',
              ['Ortodoncista', 'Endodoncista', 'Periodoncista', 'Maxilofacial'],
              0,
            )}
          />
          <CTA href={content.href('section_5', 0)}>
            {content.rich(
              'section_5',
              'links',
              <>Atención infantil</>,
              'Atención infantil',
              0,
            )}
          </CTA>
        </div>
      </section>
      <section className="philosophy">
        <div>
          <Mascot />
          <span className="eyebrow">Filosofía u → neurodivergencia</span>
          <h2>
            {content.rich(
              'section_6',
              'title',
              <>
                Nuestra filosofía de atención
                <br />
                infantil
              </>,
              'Nuestra filosofía de atención infantil',
            )}
          </h2>
          <p>
            {content.rich(
              'section_6',
              'content',
              <>
                El corazón de Blümik nace de la letra u. Al observarla desde
                otra perspectiva, da paso a la neurodivergencia. Esta idea
                representa nuestra filosofía de adaptar la atención dental a la
                manera única en que cada niño percibe la experiencia
                odontológica.
              </>,
              'El corazón de Blümik nace de la letra u. Al observarla desde otra perspectiva, da paso a la neurodivergencia. Esta idea representa nuestra filosofía de adaptar la atención dental a la manera única en que cada niño percibe la experiencia odontológica.',
              0,
            )}
          </p>
        </div>
        <div className="philosophy-visual">
          <PhilosophyTransform />
          <CTA href={content.href('section_6', 0)}>
            {content.link('section_6', 0, '¡Contáctanos!')}
          </CTA>
        </div>
      </section>
      <section id="nuestra-esencia" className="essence wide gray two-col">
        <div>
          <h2 className="oval-title">
            {content.rich(
              'nuestra_esencia',
              'title',
              <>Nuestra esencia</>,
              'Nuestra esencia',
            )}
          </h2>
          <p>
            {content.rich(
              'nuestra_esencia',
              'content',
              <>
                Somos una clínica especializada en la atención dental de bebés,
                niños y adolescentes en León, Guanajuato. Nuestro trabajo se
                enfoca en cuidar la salud bucal infantil desde edades tempranas
                mediante experiencias cálidas, seguras y libres de miedo.
              </>,
              'Somos una clínica especializada en la atención dental de bebés, niños y adolescentes en León, Guanajuato. Nuestro trabajo se enfoca en cuidar la salud bucal infantil desde edades tempranas mediante experiencias cálidas, seguras y libres de miedo.',
              0,
            )}
          </p>
        </div>
        <LazyVideo
          className="essence-video"
          poster="/assets/IMG_1083.webp"
          src="/assets/esencia.mp4"
          label="Atención dental infantil con vestuario de Mujer Maravilla"
        />
      </section>
      <section className="home-last wide gray two-col">
        <Photo
          className="arch home-last-photo"
          src="IMG_0513"
          alt="Atención odontopediátrica infantil en el consultorio de Blümik"
          media={content.media('section_8', 'image1')}
        />
        <div>
          <h2>
            {content.rich(
              'section_8',
              'title',
              <>
                Odontopediatra en León Guanajuato con atención cálida y
                especializada
              </>,
              'Odontopediatra en León Guanajuato con atención cálida y especializada',
            )}
          </h2>
          <p>
            {content.rich(
              'section_8',
              'content',
              <>
                En Blümik Odontopediatría de Alto Nivel trabajamos para que cada
                niño pueda vivir una experiencia dental positiva, segura y
                respetuosa. Acompañamos a las familias con atención profesional
                enfocada en la prevención, confianza y bienestar infantil.
              </>,
              'En Blümik Odontopediatría de Alto Nivel trabajamos para que cada niño pueda vivir una experiencia dental positiva, segura y respetuosa. Acompañamos a las familias con atención profesional enfocada en la prevención, confianza y bienestar infantil.',
              0,
            )}
          </p>
          <CTA href={content.href('section_8', 0)}>
            {content.rich(
              'section_8',
              'links',
              <>Agendar cita</>,
              'Agendar cita',
              0,
            )}
          </CTA>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  return publishedMetadata('home', {
    title: { absolute: 'Odontopediatra en León, Guanajuato | Blümik' },
  });
}
