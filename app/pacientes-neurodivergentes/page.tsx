import { Hero, CTA, Photo, Symbol, Checks } from '../shared';
import { ServiceBlock, Split } from '../sections';
import { Building2, HeartPulse, Stethoscope } from 'lucide-react';
import { BreadcrumbJsonLd, pageMetadata, seoDescriptions } from '../seo';
export const metadata = pageMetadata({
  title: 'Odontopediatra para pacientes neurodivergentes en León',
  description: seoDescriptions.neuro,
  path: '/pacientes-neurodivergentes',
});
export default function Neuro() {
  return (
    <main>
      <BreadcrumbJsonLd path="/pacientes-neurodivergentes" />
      <Hero
        kind="neuro"
        title="Odontopediatra"
        subtitle="en León Guanajuato con atención adaptada para pacientes neurodivergentes"
        description="En Blümik Odontopediatría de Alto Nivel adaptamos la experiencia dental a las necesidades individuales de cada niño."
        button="Solicitar primera visita adaptada"
      />
      <section className="neuro-intro center">
        <Symbol />
        <span className="eyebrow">Atención adaptada</span>
        <h2>Atención respetuosa, cálida y personalizada</h2>
        <p>
          Respetamos la manera única en que cada paciente percibe el entorno.
          Trabajamos de forma gradual y orientamos a las familias durante el
          proceso odontológico.
        </p>
      </section>
      <section id="atencion-adaptada" className="neuro-needs wide two-col">
        <div>
          <h2 className="oval-title">
            Atención adaptada para
            <br />
            distintas necesidades
          </h2>
          <h3>Pacientes con TEA (Autismo)</h3>
          <Checks
            items={[
              'Atención gradual',
              'Adaptación sensorial',
              'Lenguaje anticipatorio',
              'Respeto al ritmo del niño',
            ]}
          />
          <CTA />
        </div>
        <Photo
          className="neuro-needs-photo"
          src="IMG_0371"
          alt="Instalaciones del consultorio infantil de Blümik"
        />
      </section>
      <section className="service-grid wide lavender neuro-grid">
        <div>
          <ServiceBlock
            title="Pacientes con TDAH (Déficit de atención e hiperactividad)"
            items={[
              'Tiempos personalizados',
              'Comunicación clara',
              'Experiencias estructuradas',
              'Acompañamiento durante la consulta',
            ]}
          />
          <ServiceBlock
            title="Pacientes con Síndrome de Down"
            items={[
              'Atención respetuosa',
              'Trabajo progresivo',
              'Adaptación individual',
              'Experiencias positivas',
            ]}
          />
        </div>
        <ServiceBlock
          title="Manejo de miedo al dentista"
          icon="crecimiento"
          items={[
            'Primera visita adaptada',
            'Atención para pacientes sensibles',
            'Acompañamiento emocional',
            'Experiencias libres de miedo',
          ]}
          button="Solicitar orientación"
        />
      </section>
      <section className="hospital-care wide">
        <div className="hospital-care-copy" data-reveal-group>
          <span className="eyebrow" data-reveal>
            Anestesia general hospitalaria
          </span>
          <h2 data-reveal>
            Cuando el tratamiento dental requiere un entorno diferente
          </h2>
          <p data-reveal>
            En algunos niños, realizar múltiples tratamientos de manera
            convencional puede ser difícil o no ser la alternativa más adecuada.
            Después de una valoración individual, Blümik puede realizar una
            rehabilitación dental integral bajo anestesia general en un entorno
            hospitalario cuando las necesidades del paciente lo justifican.
          </p>
          <div className="hospital-cases" data-reveal>
            <h3>¿En qué casos puede considerarse?</h3>
            <ul>
              <li>Niños pequeños que requieren tratamientos extensos.</li>
              <li>
                Pacientes con necesidades específicas que dificultan la atención
                dental convencional.
              </li>
              <li>
                Casos en los que numerosos procedimientos en varias citas no
                resulten convenientes para el paciente.
              </li>
              <li>
                Pacientes en quienes la valoración determine que esta opción
                puede ofrecer un manejo más adecuado.
              </li>
            </ul>
          </div>
          <div className="hospital-action" data-reveal>
            <CTA>Agendar una valoración</CTA>
            <p>Conoce si esta alternativa es adecuada para tu pequeño.</p>
          </div>
        </div>
        <Photo
          className="hospital-care-photo"
          src="IMG_9054"
          alt="Equipo odontopediátrico de Blümik realizando un procedimiento en un entorno hospitalario"
        />
        <div className="hospital-procedure" data-reveal-group>
          <h3 data-reveal>Durante el procedimiento</h3>
          <div className="hospital-procedure-grid">
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <Stethoscope />
              </span>
              <h4>Atención odontopediátrica</h4>
              <p>El tratamiento dental es realizado por odontopediatría.</p>
            </article>
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <Building2 />
              </span>
              <h4>Entorno hospitalario</h4>
              <p>El procedimiento se lleva a cabo dentro de un hospital.</p>
            </article>
            <article data-reveal>
              <span className="card-icon" aria-hidden="true">
                <HeartPulse />
              </span>
              <h4>Vigilancia médica</h4>
              <p>
                La anestesia general y la vigilancia están a cargo del equipo
                médico de anestesiología.
              </p>
            </article>
          </div>
        </div>
        <aside className="hospital-note" data-reveal>
          <strong>Valoración previa indispensable</strong>
          <p>
            Esta alternativa no se indica para todos los pacientes. Cada caso
            requiere valoración odontopediátrica, revisión de antecedentes y la
            evaluación médica correspondiente. El tratamiento se planifica
            previamente para realizar los procedimientos necesarios de manera
            segura y reducir experiencias odontológicas complejas cuando el caso
            lo requiere.
          </p>
        </aside>
      </section>
      <Split
        color="lavender"
        title="Nuestro enfoque de acompañamiento"
        description="Creamos un entorno tranquilo y seguro, con comunicación clara para niños y familias."
        carousel={[
          {
            src: 'IMG_0513',
            alt: 'Atención odontopediátrica adaptada durante una consulta infantil',
          },
          {
            src: 'IMG_0099',
            alt: 'Odontopediatra acompañando a una niña durante la consulta',
          },
          {
            src: 'IMG_6435',
            alt: 'Paciente infantil familiarizándose con el entorno de la clínica',
          },
          {
            src: 'IMG_0476',
            alt: 'Sala infantil preparada para el acompañamiento de las familias',
          },
          {
            src: 'IMG_0442',
            alt: 'Consultorio infantil diseñado para una atención respetuosa',
          },
        ]}
      />
      <Split
        color="lavender"
        reverse
        title="Odontopediatra en León Guanajuato con atención infantil respetuosa y adaptada"
        description="En Blümik Odontopediatría de Alto Nivel acompañamos a cada familia mediante experiencias dentales cálidas, seguras y adaptadas."
        photo="IMG_0463"
        button="Agendar atención"
      />
    </main>
  );
}
