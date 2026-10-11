'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '../site-config';
import { trackAnalyticsEvent } from '../analytics';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm({
  title = 'Contáctenos',
  description = 'Completa tus datos y el mensaje llegará directamente al correo de Blümik.',
  helper = 'Evita incluir diagnósticos, expedientes o datos médicos sensibles en este formulario.',
  privacyLabel = 'aviso de privacidad',
}: {
  title?: string;
  description?: string;
  helper?: string;
  privacyLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const honey = data.get('_honey');
    if (typeof honey === 'string' && honey.trim()) return;

    setStatus('sending');
    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${siteConfig.email}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            _subject: 'Nueva consulta desde el sitio web de Blümik',
            _template: 'table',
            _honey: '',
            nombre: data.get('nombre'),
            email: data.get('correo'),
            telefono: data.get('telefono'),
            mensaje: data.get('mensaje'),
          }),
        },
      );

      if (!response.ok) throw new Error('No se pudo enviar el formulario.');
      const result = (await response.json()) as { success?: string | boolean };
      if (result.success === false || result.success === 'false') {
        throw new Error('El servicio rechazó el formulario.');
      }

      formRef.current?.reset();
      trackAnalyticsEvent('generate_lead', { lead_source: 'contact_form' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={submitForm}>
      <div className="form-heading">
        <span>Escríbenos</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input
          id="website"
          name="_honey"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label htmlFor="nombre">Nombre</label>
      <Input
        id="nombre"
        name="nombre"
        autoComplete="name"
        placeholder="Nombre completo"
        maxLength={100}
        required
      />
      <label htmlFor="correo">Correo electrónico</label>
      <Input
        id="correo"
        type="email"
        name="correo"
        autoComplete="email"
        placeholder="nombre@correo.com"
        maxLength={150}
        required
      />
      <label htmlFor="telefono">Teléfono</label>
      <Input
        id="telefono"
        type="tel"
        name="telefono"
        autoComplete="tel"
        inputMode="tel"
        placeholder="477 000 0000"
        maxLength={25}
        required
      />
      <label htmlFor="mensaje">Mensaje</label>
      <Textarea
        id="mensaje"
        name="mensaje"
        placeholder="Cuéntanos cómo podemos ayudarte"
        maxLength={1500}
        required
      />
      <p className="form-helper">{helper}</p>
      <label className="privacy-consent" htmlFor="privacidad">
        <input id="privacidad" name="privacidad" type="checkbox" required />
        <span>
          He leído y acepto el <a href="/aviso-de-privacidad">{privacyLabel}</a>
          .
        </span>
      </label>
      <button className="send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
      <output className="form-status" aria-live="polite">
        {status === 'success' &&
          'Gracias. Tu mensaje fue enviado correctamente a Blümik.'}
        {status === 'error' &&
          'No pudimos enviar el mensaje. Inténtalo de nuevo o contáctanos por WhatsApp.'}
      </output>
    </form>
  );
}
