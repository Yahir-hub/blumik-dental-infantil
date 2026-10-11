# Blumik: source y contenido publicado — ETAPA 5B

Fecha: 2026-10-11. Fuente autorizada: https://github.com/Yahir-hub/blumik-dental-infantil, commit base 0073c7027a7959815fc33703198b6273963f7725. Rama hyronix-cms-integration.

Comparación de 7 rutas, 37 secciones y 144 campos importados: **140 MATCH, 4 NOT_APPLICABLE, 0 DIFFERENCE, 0 NOT_FOUND**. Los cuatro campos duplican ubicación/contacto; sus componentes consumen site_settings normalizados. Las 26 fotos coinciden por SHA-256 con los assets originales. No se modificó contenido remoto para lograr coincidencias.

MATCH significa equivalencia del contenido normalizando espacios, no igualdad byte a byte de JSX/HTML. El análisis usa el HTML original del build del commit base, los manifiestos importados y el enlace explícito a componentes. Evidencia completa en artifacts/etapa5b/source-comparison.json y source-bindings.json (203 enlaces, pues un campo puede alimentar varios componentes).

## Campos y consumidores

| Ruta | Campo CMS | Componente / índices | Resultado |
|---|---|---|---|
| / | hero.title | Hero.h1 | MATCH |
| / | hero.content | text/prop [0] | MATCH |
| / | hero.links | text/prop [0] | MATCH |
| / | conoce_blumik.title | h2 | MATCH |
| / | conoce_blumik.content | p [0] | MATCH |
| / | conoce_blumik.links | CTA [0] | MATCH |
| / | section_3.image1 | Photo | MATCH |
| / | section_3.image2 | Photo | MATCH |
| / | section_4.title | h2 | MATCH |
| / | section_4.content | text/prop [0], text/prop [1], text/prop [2], text/prop [3], text/prop [4] | MATCH |
| / | section_4.subheadings | text/prop [0], text/prop [1], text/prop [2], text/prop [3], text/prop [4] | MATCH |
| / | section_4.links | CTA [0], CTA [1] | MATCH |
| / | section_5.title | h3 | MATCH |
| / | section_5.content | p [0] | MATCH |
| / | section_5.items | Checks.items | MATCH |
| / | section_5.links | CTA [0] | MATCH |
| / | section_5.image1 | Photo | MATCH |
| / | section_6.title | h2 | MATCH |
| / | section_6.content | p [0] | MATCH |
| / | section_6.links | CTA [0] | MATCH |
| / | nuestra_esencia.title | h2 | MATCH |
| / | nuestra_esencia.content | p [0] | MATCH |
| / | section_8.title | h2 | MATCH |
| / | section_8.content | p [0] | MATCH |
| / | section_8.links | CTA [0] | MATCH |
| / | section_8.image1 | Photo | MATCH |
| /servicios | hero.title | Hero.h1 | MATCH |
| /servicios | hero.content | text/prop [0] | MATCH |
| /servicios | hero.links | text/prop [0] | MATCH |
| /servicios | section_2.title | h2 | MATCH |
| /servicios | section_2.content | p [0] | MATCH |
| /servicios | section_2.image1 | Photo | MATCH |
| /servicios | servicios_odontopediatricos.title | h2 | MATCH |
| /servicios | servicios_odontopediatricos.content | p [0] | MATCH |
| /servicios | servicios_odontopediatricos.subheadings | h3 [0] | MATCH |
| /servicios | servicios_odontopediatricos.items | Checks.items | MATCH |
| /servicios | servicios_odontopediatricos.links | CTA [0] | MATCH |
| /servicios | servicios_odontopediatricos.image1 | Photo | MATCH |
| /servicios | primera_visita.title | text/prop | MATCH |
| /servicios | primera_visita.content | text/prop [0], text/prop [1], text/prop [2], text/prop [3] | MATCH |
| /servicios | primera_visita.subheadings | text/prop [0], text/prop [1], text/prop [2] | MATCH |
| /servicios | primera_visita.items | ServiceBlock.items | MATCH |
| /servicios | section_5.title | text/prop | MATCH |
| /servicios | section_5.content | text/prop [0] | MATCH |
| /servicios | section_5.items | Split.items | MATCH |
| /servicios | section_5.image1 | Split | MATCH |
| /servicios | section_6.title | text/prop | MATCH |
| /servicios | section_6.content | text/prop [0] | MATCH |
| /servicios | section_6.items | Split.items | MATCH |
| /servicios | section_6.image1 | Split | MATCH |
| /servicios | section_7.title | text/prop | MATCH |
| /servicios | section_7.content | text/prop [0] | MATCH |
| /servicios | section_7.items | Split.items | MATCH |
| /servicios | section_7.image1 | Split | MATCH |
| /servicios | section_8.title | text/prop | MATCH |
| /servicios | section_8.content | text/prop [0] | MATCH |
| /servicios | section_8.items | Split.items | MATCH |
| /servicios | section_8.image1 | Split | MATCH |
| /servicios | section_9.title | text/prop | MATCH |
| /servicios | section_9.content | text/prop [0], text/prop [1] | MATCH |
| /servicios | section_9.subheadings | text/prop [0] | MATCH |
| /servicios | section_9.items | ServiceBlock.items | MATCH |
| /servicios | section_9.links | text/prop [0] | MATCH |
| /servicios | servicios_destacados.title | h2 | MATCH |
| /servicios | servicios_destacados.content | p [0], p [1], p [2] | MATCH |
| /servicios | servicios_destacados.subheadings | h3 [0], h3 [1] | MATCH |
| /servicios | servicios_destacados.items | Checks.items | MATCH |
| /servicios | servicios_destacados.links | CTA [0], CTA [1] | MATCH |
| /servicios | section_11.title | h2 | MATCH |
| /servicios | section_11.content | p [0] | MATCH |
| /servicios | section_11.links | CTA [0] | MATCH |
| /pacientes-neurodivergentes | hero.title | Hero.h1 | MATCH |
| /pacientes-neurodivergentes | hero.content | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | hero.links | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | section_2.title | h2 | MATCH |
| /pacientes-neurodivergentes | section_2.content | p [0] | MATCH |
| /pacientes-neurodivergentes | atencion_adaptada.title | h2 | MATCH |
| /pacientes-neurodivergentes | atencion_adaptada.subheadings | h3 [0] | MATCH |
| /pacientes-neurodivergentes | atencion_adaptada.items | Checks.items | MATCH |
| /pacientes-neurodivergentes | atencion_adaptada.links | CTA [0] | MATCH |
| /pacientes-neurodivergentes | atencion_adaptada.image1 | Photo | MATCH |
| /pacientes-neurodivergentes | section_4.title | text/prop | MATCH |
| /pacientes-neurodivergentes | section_4.subheadings | text/prop [0], text/prop [1] | MATCH |
| /pacientes-neurodivergentes | section_4.items | ServiceBlock.items | MATCH |
| /pacientes-neurodivergentes | section_4.links | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | section_5.title | h2 | MATCH |
| /pacientes-neurodivergentes | section_5.content | p [0], p [1], p [2], p [3], p [4], p [5] | MATCH |
| /pacientes-neurodivergentes | section_5.subheadings | h3 [0], h3 [1] | MATCH |
| /pacientes-neurodivergentes | section_5.items | li [0], li [1], li [2], li [3] | MATCH |
| /pacientes-neurodivergentes | section_5.links | CTA [0] | MATCH |
| /pacientes-neurodivergentes | section_5.image1 | Photo | MATCH |
| /pacientes-neurodivergentes | section_6.title | text/prop | MATCH |
| /pacientes-neurodivergentes | section_6.content | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | section_6.image1 | Split.carousel | MATCH |
| /pacientes-neurodivergentes | section_6.image2 | Split.carousel | MATCH |
| /pacientes-neurodivergentes | section_6.image3 | Split.carousel | MATCH |
| /pacientes-neurodivergentes | section_6.image4 | Split.carousel | MATCH |
| /pacientes-neurodivergentes | section_6.image5 | Split.carousel | MATCH |
| /pacientes-neurodivergentes | section_7.title | text/prop | MATCH |
| /pacientes-neurodivergentes | section_7.content | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | section_7.links | text/prop [0] | MATCH |
| /pacientes-neurodivergentes | section_7.image1 | Split | MATCH |
| /preguntas-frecuentes | hero.title | FAQ server → FAQList + FAQPage | MATCH |
| /preguntas-frecuentes | section_2.items | FAQ server → FAQList + FAQPage | MATCH |
| /profesionales | hero.title | h1 | MATCH |
| /profesionales | hero.content | p [0] | MATCH |
| /profesionales | section_2.title | h2 | MATCH |
| /profesionales | section_2.content | p [0], p [1] | MATCH |
| /profesionales | section_2.image1 | Photo | MATCH |
| /profesionales | section_3.title | h2 | MATCH |
| /profesionales | section_3.content | text/prop [0], text/prop [1], text/prop [2] | MATCH |
| /profesionales | section_3.subheadings | text/prop [0], text/prop [1], text/prop [2] | MATCH |
| /profesionales | section_4.title | h2 | MATCH |
| /profesionales | section_4.content | p [0] | MATCH |
| /profesionales | section_4.links | CTA [0] | MATCH |
| /profesionales | section_4.image1 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image2 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image3 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image4 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image5 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image6 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image7 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image8 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image9 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image10 | AutoCarousel.images | MATCH |
| /profesionales | section_4.image11 | AutoCarousel.images | MATCH |
| /profesionales | section_5.title | LocationSection | MATCH |
| /profesionales | section_5.content | LocationSection/settings | NOT_APPLICABLE |
| /profesionales | section_5.links | LocationSection/settings | NOT_APPLICABLE |
| /contacto | hero.title | h1 | MATCH |
| /contacto | hero.content | p [0] | MATCH |
| /contacto | hero.links | CTA [0] | MATCH |
| /contacto | hero.image1 | Photo | MATCH |
| /contacto | section_2.title | h2 | MATCH |
| /contacto | section_2.content | p [0], p [1], p [2] | MATCH |
| /contacto | section_2.subheadings | h3 [0] | MATCH |
| /contacto | section_2.links | ContactForm (solo copy) | MATCH |
| /contacto | section_3.title | LocationSection | MATCH |
| /contacto | section_3.content | LocationSection/settings | NOT_APPLICABLE |
| /contacto | section_3.links | LocationSection/settings | NOT_APPLICABLE |
| /aviso-de-privacidad | hero.title | h1 | MATCH |
| /aviso-de-privacidad | hero.content | p [0], p [1], p [2], p [3], p [4], p [5], p [6], p [8], p [9], p [10], p [11], p [12] | MATCH |
| /aviso-de-privacidad | hero.subheadings | h2 [0], h2 [1], h2 [2], h2 [3], h2 [4], h2 [5], h2 [6] | MATCH |
| /aviso-de-privacidad | hero.items | li [0], li [1], li [2], li [3], li [4], li [5], li [6] | MATCH |

## site-config.ts

| Configuración actual | Fuente activa | Respaldo / control |
|---|---|---|
| name | business_name | siteConfig.name |
| phoneDisplay | phone | siteConfig.phoneDisplay |
| phoneInternational / WhatsApp | whatsapp validado | siteConfig.phoneInternational |
| email visible | email validado | siteConfig.email |
| address | address | siteConfig.address |
| hours | opening_hours | representación de siteConfig.hours |
| social.facebook / instagram | facebook / instagram HTTPS | social original |
| mapsUrl / mapsEmbedUrl / wazeUrl | derivados de nombre/dirección normalizados | defaults locales |
| shortName, url, payments | código local | identidad breve, canónico, lista técnica original |
| whatsappMessages | mensajes contextuales locales / CTA publicado cuando existe | rutas y mensajes originales |
| destinatario del formulario | código local | no depende del email editorial |

getBlumikSettings comparte una única lectura por render con layout, footer, contacto y JSON-LD. No se añadieron redes inexistentes. El sitio solo lee valores publicados; editar requiere los permisos del CMS.

## Decisiones y diferencias de representación

- Textos agregados en content conservan separación por párrafos y los índices explícitos de los componentes. Items y links conservan su estructura; añadir bloques arbitrarios requiere código. Los componentes no son un constructor de páginas.
- Las cuatro duplicaciones no consumidas son profesionales.section_5.content/links y contacto.section_3.content/links. Actualizar esos campos no cambia los datos comerciales: se editan en Información/site_settings.
- El alt publicado es el descriptor compartido de la imagen CMS; puede diferir del alt contextual original. El fallback conserva el alt original. Los archivos de las 26 fotos son idénticos.
- Colores, clases, fuentes, breakpoints, orden de secciones, animaciones, video y lógica de formulario permanecen controlados por código. No se enviaron formularios.
- Metadata publicada y schema alimentan SEO. El canónico se fija al dominio productivo y la ruta conocida; no se acepta redirigirlo a localhost o a otro dominio desde contenido.
- FAQ visible y FAQPage se generan de la misma colección. BreadcrumbList se reconstruye con la ruta conocida. Datos comerciales de JSON-LD se normalizan con settings.
- El parser de horarios estructurados reconoce el formato español actual (Lunes a viernes, Sábados, Domingos, horas a.m./p.m.). Antes de admitir formatos libres conviene migrar a horarios estructurados.
- El respaldo es el contenido fuente original conservado en JSX/site-config y assets. No se actualiza automáticamente con cada publicación; no representa necesariamente la última edición futura del CMS.
