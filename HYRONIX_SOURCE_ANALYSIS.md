# Fuente autorizada — 5B

Repositorio: https://github.com/Yahir-hub/blumik-dental-infantil. Base main: 0073c7027a7959815fc33703198b6273963f7725. Checkout inicialmente limpio; rama local hyronix-cms-integration. Sin push/merge/deploy.

Next 16 App Router, React 19, TypeScript; Node >=22.13.0. Build Next, lint oxlint con tipos. Vercel declara framework Next; README contiene referencia histórica a root blumik-web que debe verificarse antes de cualquier deploy.

Rutas: /, /servicios, /pacientes-neurodivergentes, /preguntas-frecuentes, /profesionales, /contacto, /aviso-de-privacidad. Sitemap y robots generados en app; manifest independiente. Layout raíz incluye fuentes locales Sen/Lato, CSS, Header/Footer, animaciones, JSON-LD de negocio y consentimiento Analytics.

Páginas de servidor salvo FAQ originalmente cliente. shared.tsx es cliente (CTA por pathname, menú móvil, Photo, Hero, ubicación, footer). sections.tsx compone ServiceBlock/Split; motion.tsx maneja reveal, videos, carrusel y animación tipográfica. Se conservarán clases, orden, videos y componentes interactivos. FAQ se separará en servidor y acordeón cliente con props.

SEO: pageMetadata, metadata raíz y layout FAQ; WebSite, Dentist/LocalBusiness, BreadcrumbList, FAQPage. Canónico fijo https://blumikdentalinfantil.com. site-config.ts centraliza datos y también valores técnicos; se conserva como fallback. FormSubmit usa correo local como destinatario: lógica/destinatario no se cambiarán ni se enviará formulario.

public/assets: 93 WEBP, 16 PNG, 4 MP4, 6 WOFF2, 2 CSS. Imágenes usan img y srcSet, no next/image. Se podrá conservar tamaño/responsive y añadir URL de media publicada con fallback por onError. Videos y fondos técnicos siguen locales. hooks/use-mobile y lib/utils son auxiliares de UI; components/ui contiene biblioteca shadcn/Base UI.

El contenido capturado por ETAPA 4 agrupa párrafos y listas de varios componentes en campos únicos. El mapeo debe conservar índices/slices explícitos por componente. Se detectó duplicación editorial de ubicación en páginas y site_settings; datos comerciales usarán settings normalizados como fuente común. No se modificará Supabase para hacer coincidir diferencias.

Estrategia: fetch server-only con validación, AbortSignal 1200 ms, React cache por request, no-store durante sandbox. Una consulta por página compartida con generateMetadata y una consulta global settings por render. Fallback local preservado en cada enlace de datos; ninguna credencial Supabase en Blumik. API temporal solo localhost.
