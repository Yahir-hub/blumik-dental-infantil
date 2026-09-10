'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BreadcrumbJsonLd } from '../seo';
const columns = [
  [
    {
      question: '¿Cuándo debe realizarse la primera visita dental infantil?',
      answer:
        'La primera visita puede realizarse desde las primeras etapas de vida. En Blümik acompañamos a las familias desde los primeros meses para revisar el desarrollo oral, la erupción dental y los cuidados preventivos.',
    },
    {
      question: '¿Qué servicios ofrece un odontopediatra en León Guanajuato?',
      answer:
        'Ofrecemos prevención, odontología de mínima invasión, tratamientos restaurativos, atención para bebés, evaluación del crecimiento y la mordida, manejo de hábitos orales, traumatismos dentales y atención adaptada.',
    },
    {
      question: '¿Atienden pacientes neurodivergentes como TEA o TDAH?',
      answer:
        'Sí. Adaptamos la atención mediante un proceso gradual, comunicación clara, lenguaje anticipatorio, tiempos personalizados y respeto al ritmo de cada paciente.',
    },
    {
      question: '¿Atienden pacientes con Síndrome de Down?',
      answer:
        'Sí. La atención se adapta de manera individual y progresiva, con acompañamiento familiar y respeto por las necesidades de cada paciente.',
    },
    {
      question: '¿Qué son los selladores dentales infantiles?',
      answer:
        'Son una medida preventiva que protege las zonas de los dientes donde pueden acumularse restos de alimentos. En Blümik los llamamos Escudos Anticaries.',
    },
    {
      question: '¿Realizan limpiezas dentales infantiles?',
      answer:
        'Sí. Realizamos limpiezas dentales infantiles y orientamos a madres y padres sobre técnicas de cepillado y cuidado bucal según la etapa de crecimiento.',
    },
    {
      question: '¿Atienden traumatismos dentales infantiles?',
      answer:
        'Sí. Valoramos fracturas, golpes, luxaciones, avulsiones dentales y lesiones en labios o tejidos blandos.',
    },
    {
      question: '¿Qué incluye la primera valoración odontopediátrica?',
      answer:
        'Incluye valoración integral, fotografías intraorales, radiografía cuando sea necesaria, diagnóstico personalizado y orientación para madres y padres sobre cepillado, productos adecuados y prevención de caries en casa.',
    },
  ],
  [
    {
      question: '¿Atienden niños con ansiedad o miedo dental?',
      answer:
        'Sí. Buscamos que la consulta sea tranquila y respetuosa mediante acompañamiento emocional, adaptación progresiva y comunicación clara.',
    },
    {
      question: '¿Qué es la odontología de mínima invasión?',
      answer:
        'Es un enfoque preventivo y conservador. Puede incluir inactivación de lesiones de caries, fluoruro diamino de plata, remoción selectiva y selladores.',
    },
    {
      question: '¿Realizan evaluación de crecimiento dental y mordida?',
      answer:
        'Sí. Evaluamos el crecimiento maxilar y dental para detectar oportunamente alteraciones funcionales, hábitos orales o cambios en la mordida.',
    },
    {
      question:
        '¿Brindan orientación para madres y padres durante la consulta?',
      answer:
        'Sí. Explicamos cada etapa de la atención y brindamos orientación sobre cepillado, prevención, alimentación y cuidado bucal en casa.',
    },
    {
      question: '¿Utilizan tecnología y diagnóstico digital?',
      answer:
        'Sí. Utilizamos cámara intraoral, radiografías digitales y herramientas visuales para apoyar la valoración y explicar el diagnóstico a las familias.',
    },
    {
      question: '¿Qué formas de pago aceptan?',
      answer:
        'Aceptamos efectivo, tarjetas, transferencia y link de pago. También contamos con meses sin intereses; aplican restricciones.',
    },
    {
      question:
        '¿Dónde se encuentra Blümik Odontopediatría de Alto Nivel en León Guanajuato?',
      answer:
        'Estamos en Calle Juan Nepomuceno Herrera 827 A, Valle del Campestre, León, Guanajuato, C.P. 37150.',
    },
  ],
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: columns.flat().map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function FAQ() {
  return (
    <main>
      <BreadcrumbJsonLd path="/preguntas-frecuentes" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="faq-banner center">
        <img src="/assets/simbolo-morado.png" alt="Símbolo de Blümik" />
        <h1>Preguntas Frecuentes</h1>
      </section>
      <section className="faq-columns">
        {columns.map((questions, i) => (
          <Accordion key={i} className="faq-list">
            {questions.map(({ question, answer }) => (
              <AccordionItem key={question} className="faq-item">
                <AccordionTrigger>
                  {question}
                  <span className="plus" aria-hidden="true" />
                </AccordionTrigger>
                <AccordionContent className="faq-answer">
                  <p>{answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </section>
    </main>
  );
}
