# ETAPA 5B — integración local de Blumik

Fecha: 2026-10-11. **PASS para el alcance sandbox local**.

| Verificación | Resultado |
|---|---|
| SOURCE | PASS |
| BRANCH | PASS |
| NEXT INTEGRATION | PASS |
| HOME | PASS |
| OTHER PAGES | PASS |
| SITE SETTINGS | PASS |
| SEO | PASS |
| JSON-LD | PASS |
| MEDIA | PASS |
| DRAFT LEAK | PASS |
| SSR HTML | PASS |
| FALLBACK | PASS |
| TIMEOUT | PASS |
| BUILD BLUMIK | PASS |
| BUILD HYRONIX | PASS |
| CONTENT API | PASS |
| SECRET BOUNDARY | PASS |
| PRODUCTION MODIFIED | NO |
| MAIN MERGED | NO |
| CUSTOM DOMAIN HYRONIX | NO |

## Entorno y entrega

Fuente autorizada: https://github.com/Yahir-hub/blumik-dental-infantil. Base: 0073c7027a7959815fc33703198b6273963f7725. Rama local: hyronix-cms-integration. Checkout: .live-private/blumik-sandbox dentro del workspace CMS. Commits locales, sin push ni PR; consultar git log en ese checkout. El workspace CMS no tiene repositorio Git; sus scripts/reportes se conservan en disco.

Hyronix: http://localhost:3000. Blumik: http://127.0.0.1:3001. Supabase DEV ya existente: gtvwovlcotccpfgmhcas. Site key público configurado mediante entorno, sin UUID internos en componentes. No hubo cambios remotos de contenido, cuentas ni configuración de Supabase en 5B.

En este equipo Node necesita NODE_USE_SYSTEM_CA=1 para validar TLS hacia Supabase/npm con los certificados del sistema. Nunca se desactivó TLS. Se eliminó la instancia duplicada que escuchaba por IPv6 antes de certificar la caída; se reinició una sola instancia CMS con certificados correctos.

## Implementación

Cliente y validadores server-only en lib/hyronix. Todas las páginas y generateMetadata comparten una lectura publicada por página; layout/settings comparten otra lectura por request. Los componentes interactivos reciben props/contexto público serializable. El contenido principal y SEO existen en el HTML inicial sin ejecutar JavaScript.

Fallback local por error HTTP, timeout, JSON inválido, forma inesperada o configuración ausente. Límite 1200 ms; respuestas limitadas y validadas. Media usa el proxy público estable; no storage_path ni URLs firmadas temporales. La imagen recupera su asset local también cuando el error ocurre antes de hidratar React.

Los valores normales/SEO protegidos se leen publicados. No hay edición, credenciales administrativas, JWT ni acceso directo a Supabase desde Blumik. Canonical preservado en https://blumikdentalinfantil.com. Video y envío de formulario conservados. No se enviaron formularios ni se conectaron servicios de Analytics.

## Pruebas ejecutadas

| Prueba | Resultado / evidencia |
|---|---|
| npm install Blumik | PASS tras usar certificados del sistema |
| Blumik npm run lint, npx tsc --noEmit, npm run build | PASS, Next 16.4.0 / React 19; 7 rutas SSR |
| Hyronix npm run lint, npm run typecheck, npm run build | PASS |
| scripts/test-content-api.mjs | PASS: 26 verificaciones HTTP y 7 comparaciones fuente; media/ETag/adaptadores/fallback |
| scripts/verify-secret-boundary.mjs | PASS: frontera administrativa CMS |
| scripts/verify-blumik-boundary.mjs | PASS: fuente/build/env y bundles cliente sin secreto real Supabase |
| scripts/check-blumik.mjs published | PASS: 7 páginas, 144 campos, 26 imágenes y propietario conservado |
| Blumik scripts/verify-hyronix.mjs | PASS: 7 rutas SSR, deduplicación, sentinelas locales de contenido/SEO/settings, FAQ, sitemap y robots |
| Fallos HTTP 404/429/500/502/503, JSON inválido, esquema inválido | PASS: HTML 200 útil con contenido local |
| API lenta 3000 ms | PASS: timeout 1200 ms; respuesta fallback 1240 ms |
| Hyronix realmente apagado | PASS: inaccesible por localhost, IPv4 e IPv6; 7 páginas 200 y sin URLs de media CMS |
| API restaurada | PASS: 7 rutas con metadata y media publicadas reales |
| UI responsive | PASS: 1440, 768 y 390 px; sin desbordamiento horizontal; diseño conservado |
| Acordeón FAQ | PASS: respuesta visible al expandir, captura faq-browser.png |
| Imagen CMS 503 | PASS: assets locales visibles; captura y datos media-fallback |

Las sentinelas modifican copias de respuestas únicamente en un proxy temporal local: prueban que el HTML depende de Hyronix sin editar Supabase. La prueba directa sí consume la Content API real local conectada a Supabase. No se certificó edición/publicación desde la UI CMS nuevamente: pertenece a etapas anteriores; aquí se certifica consumo público.

Evidencia en artifacts/etapa5b: HTML baseline/live/outage de las 7 rutas, sentinelas, integration-tests.json, direct-live.json, direct-outage.json, responsive.json, capturas y secret-boundary.json. En el checkout, el harness conserva evidencia local ignorada en .qa.

## Rendimiento local

| Ruta | TTFB original ms | TTFB CMS real ms | TTFB caída ms | HTML original bytes | HTML integrado bytes |
|---|---:|---:|---:|---:|---:|
| home | 103 | 1066 | 60 | 40116 | 42963 |
| servicios | 18 | 229 | 41 | 51894 | 55065 |
| pacientes-neurodivergentes | 21 | 270 | 48 | 46690 | 50980 |
| preguntas-frecuentes | 18 | 220 | 47 | 52942 | 61782 |
| profesionales | 20 | 215 | 41 | 40533 | 43777 |
| contacto | 17 | 238 | 40 | 36419 | 36349 |
| aviso-de-privacidad | 17 | 305 | 31 | 30654 | 30565 |

El build original compiló en 5.0 s (TypeScript 10.7 s); build integrado observado 1.55 s (TypeScript 7.1 s). Son muestras locales, afectadas por caché y actualización de Next; no una promesa de mejora. La fuente era estática y ahora las rutas son dinámicas: aumenta TTFB por la consulta real. La primera ruta tras reiniciar CMS incluye arranque frío. Con proxy local precargado, TTFB caliente medido 34–86 ms (home inicial 175 ms). No se midieron Core Web Vitals productivos.

FAQ integrado ocupa unos 62 KB frente a 53 KB original. Se eliminó una serialización duplicada durante implementación (primer intento ~92 KB). La estrategia conservadora no-store prioriza comprobar frescura en sandbox; antes de producción se debe acordar caché corta, presupuesto TTFB y último snapshot válido.

## Diferencias y correcciones

140 campos MATCH; 4 duplicados NOT_APPLICABLE por usar site_settings; 0 DIFFERENCE/NOT_FOUND. 26 imágenes idénticas por SHA-256. Ver BLUMIK_SOURCE_MAPPING_REPORT.md para mapeo y limitaciones de agrupación/alt/horarios.

Se corrigió fallback de imágenes que fallaban antes de hidratación. Se separó FAQ servidor/acordeón cliente, se normalizó metadata para evitar duplicar el título y se ajustó JSON-LD a settings. Se excluyó el checkout independiente de lint/typecheck CMS.

Next se actualizó de 16.3.4 a 16.4.0; se retiró la dependencia directa no utilizada react-server-dom-webpack, se actualizó el lock compatible y shadcn CLI quedó en devDependencies. npm audit --omit=dev: 0 vulnerabilidades en la revisión realizada. El árbol completo conservaba 14 avisos de herramientas de desarrollo (2 moderados, 9 altos, 3 críticos); requieren mantenimiento antes de una certificación de seguridad de CI/producción. No se aplicó un downgrade forzado para silenciarlos.

## Archivos modificados

- Blumik: lib/hyronix/*; las 7 páginas, FAQ layout/faq-list; app/layout.tsx, shared.tsx, sections.tsx, motion.tsx, contacto/form.tsx (solo copy); .env.example, .gitignore, package.json/lock, scripts/verify-hyronix.mjs, README y los cuatro reportes.
- CMS: eslint.config.mjs y tsconfig.json (excluir checkout); scripts/verify-blumik-direct.mjs y verify-blumik-boundary.mjs; BLUMIK_CONTENT_MAP.md, BLUMIK_INTEGRATION_REQUIREMENTS.md, reportes y artifacts/etapa5b.

## Pendientes antes de producción

1. Acordar caché, webhook firmado y snapshot actualizado conforme HYRONIX_REVALIDATION_PLAN.md; no están implementados aún.
2. Resolver avisos de dependencias de herramientas y validar rendimiento/observabilidad bajo carga.
3. Revisar cambios/commits y aprobar despliegue separado; una futura preview externa debe protegerse/noindex.
4. Configurar dominio Hyronix al final del proyecto, según indicó el propietario. Después definir variables del proveedor y comprobar conectividad server-side/media desde Blumik.

No hay bloqueo para la demostración local. Esta certificación no autoriza ni declara listo un despliegue productivo. No se tocó main, producción Blumik, DNS, Cloudflare ni cPanel.
