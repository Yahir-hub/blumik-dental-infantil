# Revisión de las 35 capturas y correspondencia de recursos

Se revisaron individualmente todas las capturas antes de escribir el sitio. Los recortes con navegador se interpretan dentro del área de la web, sin reproducir las barras de Opera o Windows.

## Preparación para datos definitivos

- Teléfono, correo, dirección, horarios, medios de pago y URLs sociales están centralizados en `app/site-config.ts`.
- Los botones de WhatsApp ya abren conversaciones con mensajes según la sección visitada.
- Google Maps y Waze ya se generan desde la dirección centralizada.
- Facebook e Instagram están conectados a las URLs oficiales proporcionadas.
- El formulario envía nombre, correo, teléfono y mensaje al correo oficial mediante FormSubmit. La dirección receptora debe confirmar una sola vez el correo de activación de FormSubmit.
- El aviso de privacidad integral está publicado en `/aviso-de-privacidad` y enlazado desde el formulario y el pie de página.
- Los horarios oficiales son: lunes a viernes de 10:00 a.m. a 1:30 p.m. y de 3:30 p.m. a 7:30 p.m.; sábados de 10:00 a.m. a 2:00 p.m.; domingos cerrado.

## Estructura, en orden

- Inicio: 191512 portada; 191529 introducción y galería; 191540 ventajas; 191549 segunda fila de ventajas; 191600 especialistas; 191610 filosofía; 191622 esencia; 191631 cierre; 191638 cierre y pie.
- Servicios: 191652 portada; 191704 presentación y recepción; 191717 prevención; 191726 cuatro categorías; 191735 bebés; 191744 traumatismos; 191751 atención adaptada; 191801 ansiedad; 191812 tecnología, primera visita y cierre; 191822 cierre y pie.
- Pacientes neurodivergentes: 191835 portada; 191938 introducción y TEA; 191946 TEA, TDAH y ansiedad; 191953 síndrome de Down y acompañamiento; 192007 acompañamiento completo; 192020 cierre; 192025 pie.
- Preguntas frecuentes: 192034 cabecera y primeras preguntas; 192038 las 15 preguntas; 192042 final y pie.
- Contacto: 192052 portada; 192101 datos y formulario; 192111 redes, horarios, pagos y formulario; 192116 mapa y pie.
- Tienda: 192131 los dos productos; 192136 precios y pie.

## Medios cotejados

- IMG_8415.heic: primera foto de la galería del inicio.
- IMG_0442.HEIC: especialistas, inicio.
- IMG_1084.JPG: Nuestra esencia.
- IMG_6435.PNG: cierre del inicio.
- IMG_0466.HEIC: recepción en introducción de Servicios.
- IMG_0476.HEIC: Nuestro enfoque de acompañamiento.
- IMG_0463.HEIC: puerta azul en cierre de Pacientes neurodivergentes.
- VIDEO HORIZONTAL BLÜMIK.mp4: portada Servicios.
- VIDEO HORIZONTAL BLÜMIK(1).mp4: portada Pacientes neurodivergentes.
- IMG_0272 2.mov: bloque TEA, convertido a MP4 compatible con navegador.
- IMG_0436-2.HEIC, IMG_0444.HEIC e IMG_0460.HEIC: revisadas; no corresponden exactamente a una foto de las capturas. Conservadas convertidas entre los recursos, sin introducir secciones nuevas.
- Logotipos, mascota, símbolos, iconos dentales, WhatsApp y pagos: extraídos de las capturas. No se dispone de sus archivos originales de mayor resolución.

## Segunda entrega de medios

- IMG_0099.HEIC: segunda fotografía de la galería de Inicio y referencia visual de Primera visita en Tienda.
- IMG_0159.HEIC: prevención y cuidado temprano en Servicios; también ilustra el paquete preventivo de Tienda.
- IMG_0121.JPG: Odontología para bebés.
- IMG_0512.jpg: Traumatismos dentales infantiles.
- IMG_0513.jpg: Atención adaptada para pacientes neurodivergentes.
- IMG_0514.jpg: Manejo de ansiedad y miedo dental infantil.
- IMG_0590 2.MOV: video de Nuestra esencia, en Inicio.
- IMG_0272 2.mov: video del bloque de atención para pacientes con TEA.
- VIDEO HORIZONTAL BLÜMIK.mp4: portada de Servicios.
- VIDEO HORIZONTAL BLÜMIK(1).mp4: portada de Pacientes neurodivergentes.
- IMG_0466.HEIC: fotografía real de recepción usada en Servicios y Contacto.

## Estado de espacios visuales

La portada de Inicio muestra de nuevo el marcador «Falta video» porque entre los cuatro videos recibidos no aparece el recorrido de pasillos que se observa en la captura antigua. Contacto utiliza la fotografía de recepción más cercana disponible en la entrega.

La sección Tienda y su enlace de navegación fueron retirados por indicación del propietario.

Las 15 preguntas frecuentes cuentan con respuestas breves y datos estructurados FAQ para apoyar su lectura y posicionamiento.

## Límites de la referencia

- Las capturas no permiten conocer las alturas de partes no capturadas, la tipografía con certeza, las animaciones, las versiones móviles ni el comportamiento de compra. Sen y Lato se usan por correspondencia visual; los tamaños y márgenes se toman del escritorio capturado y se adaptan en móvil.
- Falta el fondo decorativo completo de líneas de la sección de filosofía.
- El mapa de referencia fue reemplazado por un mapa interactivo que consulta el nombre y la dirección de Blümik en León.
- Facebook e Instagram utilizan los enlaces proporcionados por el propietario.
- El formulario usa el endpoint AJAX de FormSubmit, validación nativa, límites de longitud, consentimiento de privacidad y un campo señuelo contra bots. El primer envío solicita activación al correo receptor.
- La tienda reproduce listado, precios y búsqueda local. Cuenta, carrito, fichas y cobros no pueden reconstruirse con las dos capturas; al pulsar se comunica lo pendiente, sin simular compras.
- Se intentó recuperar el sitio original, pero respondió 403 a la petición directa y no estuvo disponible mediante el lector web.

## SEO técnico implementado

- Dominio canónico: `https://blumikdentalinfantil.com`.
- Títulos y descripciones únicos para las seis páginas principales y el aviso de privacidad.
- Metadatos Open Graph y Twitter para compartir enlaces.
- `sitemap.xml`, `robots.txt` y manifiesto web generados por el proyecto.
- Datos estructurados `WebSite`, `Dentist`, `LocalBusiness`, `FAQPage` y `BreadcrumbList` con información confirmada.
- Enlaces, horarios, dirección, teléfono y redes centralizados para mantener consistencia.
- Fotografías con variantes responsive de 480 y 960 píxeles.
- Videos H.264 optimizados, sin audio, con carga anticipada reducida en el contenido fuera de pantalla.
