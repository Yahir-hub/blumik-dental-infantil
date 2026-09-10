import { Notebook, Shield } from 'lucide-react';
import { Hero, CTA, Photo, Symbol, Checks } from '../shared';
import { ServiceBlock, Split } from '../sections';
import { BreadcrumbJsonLd, pageMetadata, seoDescriptions } from '../seo';
export const metadata = pageMetadata({
  title: 'Servicios de odontopediatría en León',
  description: seoDescriptions.services,
  path: '/servicios',
});
export default function Services() {
  return (
    <main>
      <BreadcrumbJsonLd path="/servicios" />
      <Hero
        kind="servicios"
        title={
          <>
            {' '}
            <span className="hero-prefix">Servicios de </span>odontopediatra
          </>
        }
        subtitle="en León Guanajuato"
        description="En Blümik Odontopediatría de Alto Nivel ofrecemos atención dental infantil preventiva, restaurativa y adaptada."
        button="Solicitar valoración"
      />
      <section className="service-intro center">
        <Symbol green />
        <span className="eyebrow">Nuestros servicios</span>
        <h2>Atención odontopediátrica especializada</h2>
        <p>
          Acompañamos el crecimiento dental de bebés, niños y adolescentes con
          prevención y atención adaptada, respetando el ritmo de cada paciente.
        </p>
        <Photo src="IMG_0466" alt="Recepción de la clínica Blümik" />
      </section>
      <section
        id="servicios-odontopediatricos"
        className="prevention wide two-col"
      >
        <div>
          <h2 className="oval-title">Servicios odontopediátricos</h2>
          <h3>Prevención y cuidado temprano infantil</h3>
          <p>
            Trabajamos en la prevención dental desde las primeras etapas de
            crecimiento para favorecer una sonrisa saludable.
          </p>
          <Checks
            items={[
              'Limpiezas dentales infantiles',
              'Aplicación profesional de flúor',
              'Selladores: nuestros Escudos Anticaries',
              'Técnicas de cepillado según la etapa de crecimiento',
              'Evaluación de riesgo de caries',
              'Educación y orientación personalizada para madres y padres',
            ]}
          />
          <CTA />
        </div>
        <Photo
          className="arch"
          src="IMG_0159"
          alt="Doctora de Jessie, niña y doctor de Spider-Man en el sillón dental"
        />
      </section>
      <section className="service-grid wide" id="primera-visita">
        <div>
          <ServiceBlock
            title="Odontología de mínima invasión"
            description="Aplicamos tratamientos enfocados en el manejo preventivo y conservador de la salud bucal infantil."
            items={[
              'Inactivación de lesiones de caries',
              'Fluoruro diamino de plata (SDF)',
              'Remoción selectiva de caries',
              'Selladores anti caries',
              'Manejo preventivo temprano',
            ]}
          />
          <ServiceBlock
            title="Odontología restaurativa infantil"
            description="Realizamos tratamientos restaurativos enfocados en la funcionalidad y cuidado dental de cada paciente."
            items={[
              'Resinas estéticas infantiles',
              'Coronas estéticas pediátricas',
              'Coronas metálicas infantiles',
              'Terapias pulpares',
              'Reconstrucciones dentales',
            ]}
          />
        </div>
        <div>
          <ServiceBlock
            icon="crecimiento"
            title="Crecimiento y desarrollo infantil"
            description="Evaluamos el desarrollo maxilar y dental para detectar oportunamente alteraciones funcionales o de mordida."
            items={[
              'Evaluación de crecimiento maxilar',
              'Aparatos ortopédicos infantiles',
              'Ortodoncia interceptiva',
              'Brackets 4 por 2',
              'Corrección temprana de mordida',
              'Manejo de hábitos orales',
            ]}
          />
          <ServiceBlock
            icon="habitos"
            title="Tratamiento de hábitos orales"
            description="Atendemos hábitos que pueden influir en el desarrollo oral y maxilar infantil."
            items={[
              'Respiración bucal',
              'Succión digital',
              'Uso prolongado de chupón o biberón',
              'Interposición lingual',
            ]}
          />
        </div>
      </section>
      <Split
        title="Odontología para bebés"
        description="Acompañamos el desarrollo oral desde los primeros meses de vida mediante atención preventiva y orientación personalizada."
        items={[
          'Desarrollo de maxilares',
          'Erupción dental',
          'Encía y tejidos blandos',
          'Riesgo de lesiones de caries temprana',
          'Evaluación del frenillo lingual inferior',
          'Hábitos de alimentación y succión',
        ]}
        photo="IMG_0121"
      />
      <Split
        reverse
        color="green"
        title="Traumatismos dentales infantiles"
        description="Atendemos lesiones dentales infantiles que requieren valoración profesional."
        items={[
          'Fracturas dentales',
          'Golpes en dientes temporales y permanentes',
          'Luxaciones',
          'Avulsiones dentales',
          'Lesiones en labios y tejidos blandos',
        ]}
        photo="IMG_0512"
      />
      <Split
        title="Atención adaptada para pacientes neurodivergentes"
        description="Nuestro enfoque contempla la adaptación de la experiencia dental para pacientes con distintas necesidades sensoriales y emocionales."
        items={[
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
        ]}
        photo="IMG_6435"
      />
      <Split
        reverse
        color="green"
        title="Manejo de miedo al dentista"
        description="Creamos experiencias más tranquilas y respetuosas para niños sensibles o con experiencias dentales previas difíciles."
        items={[
          'Acompañamiento en primeras visitas',
          'Atención para pacientes sensibles',
          'Atención para niños neurodivergentes',
          'Manejo emocional durante la consulta',
        ]}
        photo="IMG_0514"
      />
      <section className="service-grid wide">
        <ServiceBlock
          icon="tecnologia"
          title="Tecnología y diagnóstico infantil"
          description="Utilizamos herramientas de apoyo visual y diagnóstico para favorecer una atención más clara y preventiva."
          items={[
            'Cámara intraoral',
            'Radiografías digitales',
            'Diagnóstico visual para papás',
            'Planificación preventiva',
          ]}
        />
        <ServiceBlock
          icon="primera"
          title="Primera visita dental infantil"
          description="Orientamos a las familias para que la primera visita dental sea positiva y segura."
          items={[
            'Cuándo realizar la primera visita',
            'Qué esperar durante la consulta',
            'Cómo preparar al niño',
            'Evaluación integral',
            'Experiencia emocional positiva',
          ]}
          button="Servicios Odontopediátricos"
        />
      </section>
      <section id="servicios-destacados" className="service-pricing wide">
        <span className="eyebrow">Opciones de atención</span>
        <h2 className="oval-title">Servicios destacados</h2>
        <p>
          Conoce qué incluye la primera visita y el paquete preventivo de
          Blümik.
        </p>
        <div className="price-grid" data-reveal-group>
          <article className="price-card" data-reveal>
            <span className="card-icon" aria-hidden="true">
              <Notebook />
            </span>
            <div>
              <h3>Primera visita Blümik</h3>
              <p>
                Incluye una consulta completa para conocer al paciente y
                orientar a su familia.
              </p>
              <Checks
                items={[
                  'Valoración integral',
                  'Fotografías intraorales',
                  'Radiografía, en caso de ser necesario',
                  'Diagnóstico personalizado',
                  'Entrenamiento personalizado para mamá y papá',
                  'Cómo cepillar correctamente',
                  'Qué cepillo y pasta son adecuados según su edad',
                  'Cómo prevenir las lesiones de caries en casa',
                ]}
              />
              <CTA>Agendar primera visita</CTA>
            </div>
          </article>
          <article className="price-card" data-reveal>
            <span className="card-icon" aria-hidden="true">
              <Shield />
            </span>
            <div>
              <h3>Paquete preventivo Blümik</h3>
              <p>
                Primera visita y limpieza dental preventiva. La mejor forma de
                comenzar el cuidado dental de tu pequeño.
              </p>
              <Checks
                items={[
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
                ]}
              />
              <CTA>Agendar cita</CTA>
            </div>
          </article>
        </div>
      </section>
      <section className="service-close center">
        <h2>
          Odontopediatra en León Guanajuato para
          <br />
          atención preventiva y especializada
        </h2>
        <p>
          En Blümik Odontopediatría de Alto Nivel acompañamos el desarrollo
          dental infantil mediante atención cálida y profesional.
        </p>
        <CTA>Agendar consulta infantil</CTA>
      </section>
    </main>
  );
}
