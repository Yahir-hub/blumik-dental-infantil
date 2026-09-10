import { Hero, CTA, Photo, Mascot, Symbol, Checks } from './shared';
import {
  Heart,
  HeartHandshake,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';
import { LazyVideo, PhilosophyTransform } from './motion';
const reasons = [
  {
    icon: HeartHandshake,
    title: 'Atención adaptada',
    description:
      'Respetamos el ritmo y las necesidades de cada niño, incluidos pacientes con autismo, TDAH y síndrome de Down.',
  },
  {
    icon: Heart,
    title: 'Experiencias positivas',
    description: 'Buscamos que cada visita sea tranquila y libre de miedo.',
  },
  {
    icon: Users,
    title: 'Acompañamiento familiar',
    description:
      'Orientamos a madres y padres con comunicación clara en cada etapa.',
  },
  {
    icon: Shield,
    title: 'Prevención temprana',
    description: 'Promovemos el cuidado bucal desde los primeros años de vida.',
  },
  {
    icon: Stethoscope,
    title: 'Actualización continua',
    description:
      'Nuestra atención se apoya en preparación y compromiso profesional.',
  },
];
export default function Home() {
  return (
    <main>
      <Hero
        kind="inicio"
        title="Odontopediatra"
        subtitle={
          <>
            en León Guanajuato para bebés, niños
            <br /> y adolescentes
          </>
        }
        description="En Blümik Odontopediatría de Alto Nivel acompañamos el crecimiento de cada niño con atención dental cálida, segura y especializada."
        button="Agendar valoración"
      />
      <section className="intro home-intro" id="conoce-blumik">
        <h2>Cuidado dental infantil</h2>
        <p>
          En <strong>Blümik Odontopediatría de Alto Nivel</strong> somos una
          clínica especializada en la atención de bebés, niños y adolescentes en
          León, Guanajuato. Nuestro enfoque nace de la importancia de crear
          experiencias dentales positivas desde las primeras etapas de vida,
          ayudando a que cada paciente pueda sentirse tranquilo, escuchado y
          acompañado durante su atención.
        </p>
        <div className="center">
          <CTA />
        </div>
      </section>
      <section className="home-gallery gray" data-reveal-group>
        <Photo
          src="IMG_8415"
          alt="Odontopediatra revisando radiografías con vestuario de Chase"
        />
        <Photo
          className="photo-show-full"
          src="IMG_0099"
          alt="Odontopediatra con uniforme morado junto a una niña"
        />
      </section>
      <section className="reasons">
        <div className="reasons-heading">
          <Mascot />
          <h2>
            ¿Por qué elegir a Blümik
            <br />
            Odontopediatría de Alto Nivel?
          </h2>
          <CTA />
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
            <CTA>Solicitar primera visita dental</CTA>
          </div>
        </div>
      </section>
      <section className="specialists lavender">
        <Photo
          className="arch"
          src="IMG_0442"
          alt="Consultorio infantil con alberca de pelotas"
        />
        <div className="purple-card">
          <h3>Especialistas que colaboran en la clínica</h3>
          <p>
            Cuando el tratamiento lo requiere, contamos con la participación de
            especialistas para complementar la atención infantil.
          </p>
          <Checks
            items={[
              'Ortodoncista',
              'Endodoncista',
              'Periodoncista',
              'Maxilofacial',
            ]}
          />
          <CTA>Atención infantil</CTA>
        </div>
      </section>
      <section className="philosophy">
        <div>
          <Mascot />
          <span className="eyebrow">Filosofía u → neurodivergencia</span>
          <h2>
            Nuestra filosofía de atención
            <br />
            infantil
          </h2>
          <p>
            El corazón de Blümik nace de la letra u. Al observarla desde otra
            perspectiva, da paso a la neurodivergencia. Esta idea representa
            nuestra filosofía de adaptar la atención dental a la manera única en
            que cada niño percibe la experiencia odontológica.
          </p>
        </div>
        <div className="philosophy-visual">
          <PhilosophyTransform />
          <CTA />
        </div>
      </section>
      <section id="nuestra-esencia" className="essence wide gray two-col">
        <div>
          <h2 className="oval-title">Nuestra esencia</h2>
          <p>
            Somos una clínica especializada en la atención dental de bebés,
            niños y adolescentes en León, Guanajuato. Nuestro trabajo se enfoca
            en cuidar la salud bucal infantil desde edades tempranas mediante
            experiencias cálidas, seguras y libres de miedo.
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
        />
        <div>
          <h2>
            Odontopediatra en León Guanajuato con atención cálida y
            especializada
          </h2>
          <p>
            En Blümik Odontopediatría de Alto Nivel trabajamos para que cada
            niño pueda vivir una experiencia dental positiva, segura y
            respetuosa. Acompañamos a las familias con atención profesional
            enfocada en la prevención, confianza y bienestar infantil.
          </p>
          <CTA>Agendar cita</CTA>
        </div>
      </section>
    </main>
  );
}
