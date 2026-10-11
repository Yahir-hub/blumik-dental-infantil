'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
export function FAQList({
  columns,
}: {
  columns: { question: string; answer: string }[][];
}) {
  return (
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
  );
}
