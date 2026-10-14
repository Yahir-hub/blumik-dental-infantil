# ETAPA 5E — cierre de certificación staging

14 de octubre de 2026 · America/Mexico_City.

**Staging funcional certificado. PRODUCTION READY: NO.** Los flujos críticos de esta etapa pasaron. La revisión encontró límites de capacidad Free que deben resolverse antes de tráfico público sostenido; falta además ejecutar el build final en Linux y cerrar la configuración del futuro entorno productivo. No se desplegó producción.

- CMS: https://hyronix-cms-staging.yahir-rp-ti.workers.dev
- Blumik: https://blumik-hyronix-staging.yahir-rp-ti.workers.dev
- Supabase DEV: `gtvwovlcotccpfgmhcas`.
- Next 16.4.0 / OpenNext Cloudflare 1.20.10 / OpenNext AWS 4.1.9.
- Blumik: rama `hyronix-cms-integration`; CMS sin repositorio Git. Backup local de archivos modificados, sin credenciales.

## Matriz solicitada

| Comprobación | Resultado y alcance |
|---|---|
| MEDIA VISUAL FALLBACK | PASS — Chrome/Playwright, hidratación real, capturas antes/después |
| SECRET ROTATION | PASS — clave moderna administrativa renovada y desarrollo separado |
| OLD SECRET REJECTED | PASS — HTTP 401 después de revocar |
| CURRENT SECRET BOUNDARY | PASS — escaneos locales, artefactos actuales del proveedor y logs observados |
| STAGING HARNESS ISOLATION | PASS — fixture fijo sin acceso a datos; build production con harness activo rechazado |
| ENVIRONMENT SEPARATION | PASS — variables/credenciales y store local separados de staging; producción solo plantilla. DB DEV compartida intencionalmente entre pruebas locales y staging |
| AUTH | PASS — login propietario, recarga, nueva petición SSR protegida, logout y redirección anónima |
| CONTENT API | PASS — 26 comprobaciones y siete comparaciones de contenido fuente |
| OUTBOX CRON | PASS — publicación y restauración entregadas por Cron nativo, sin runner manual |
| WEBHOOK | PASS — firma vigente real; sin firma/inválida 401, body 413, tipo 415; replay persistente |
| LAST KNOWN GOOD | PASS — B permanece con API 503/JSON corrupto |
| REDEPLOY PERSISTENCE | PASS — B y replay sobreviven al redeploy durante caída |
| RLS | PASS — JWT real temporal, aislamiento de datos/media y autoascenso rechazado |
| NO DRAFT | PASS — API, snapshots/eventos y SSR comprobados |
| STAGING NOINDEX | PASS — HTML noindex/nofollow; Blumik además robots disallow y X-Robots-Tag. Alcance CMS abajo |
| SECURITY HEADERS | PASS de inventario HTTPS actual; no equivale a tener todas las cabeceras. Ausencias abajo |
| ROLLBACK DRILL | PASS — siete rutas con contenido/assets locales; integración restaurada |
| OPENNEXT PATCH | PASS — reproducible, idempotente y guardado por versión |
| DEPENDENCY REVIEW | PASS — actualización compatible aplicada; avisos residuales DEV ONLY documentados |
| FREE TIER REVIEW | PASS — capacidad productiva no demostrada, riesgo bloqueante identificado |
| BUILD HYRONIX | PASS — Next y OpenNext staging |
| BUILD BLUMIK | PASS — Next local y OpenNext staging |
| PRODUCTION READY | **NO** |
| CUSTOM DOMAIN | **NO** |
| BLUMIK PRODUCTION MODIFIED | **NO** |
| MAIN MERGED | **NO** |

## Publicación, restauración y durabilidad reales

A versión 431 → B versión 433 → API 503 conserva B → JSON corrupto conserva B → redeploy conserva B y replay → restauración exacta de valores draft/published A, versión 435.

- B: evento `83fbfb2c-c509-4d7f-b38f-c14409baebc0`, entrega observada 20,641 s, intento 1.
- El mismo evento se reencoló controladamente después del redeploy: Cron entregó intento 2, receptor reconoció duplicado sin cambiar snapshot/replay.
- Restauración: `97c9ee21-3e05-406d-a2a7-aade5744b772`, 61,672 s observados, intento 1.
- RPC de publicación con actor propietario en transacción DEV; no se afirma clic de Publicar en navegador para este ensayo.
- Se conservaron auditoría, revisiones y outbox. Usuario temporal RLS y namespace de prueba eliminados. No se añadieron usuarios ficticios permanentes.
- CAS remoto 42 vence 41, una sola reserva concurrente, completion falsificada rechazada, duplicados/obsoletos/rate limit comprobados.

Evidencias: `publication.json`, `store-live.json`, `data-security.json` en `artifacts/etapa5e/`.

## Media, Auth y seguridad

`media-browser.json`: imagen remota 200 → fixture 503 → asset local visible; CLS 0,00169; dimensiones conservadas; errores estables, sin loop ni excepción React. Capturas inspeccionadas visualmente.

`auth-browser.json`: propietario real en Control Center, recarga y `/hyronix/sites`, logout y ruta protegida anónima. No se enviaron emails. **Refresh significa recarga de página/sesión persistente; no se esperó expiración de token.** La protección anónima puede usar el meta redirect de streaming documentado por Next (HTTP 200 con redirect a login), sin mostrar contenido protegido; no exigir artificialmente siempre 307.

Se retiraron seis versiones CMS antiguas con clave administrativa embebida, preservando rollback limpio. Clave antigua revocada; nueva staging operativa; clave local distinta. Detalles y límites del escaneo en [SECRET_ROTATION_REPORT.md](SECRET_ROTATION_REPORT.md).

### Headers observados, sin inventar configuración

Blumik: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Robots-Tag: noindex, nofollow`. Canonical conserva dominio productivo correcto; robots disallow.

CMS login: meta robots noindex/nofollow. No estaban configuradas las tres cabeceras anteriores ni X-Robots-Tag en esa respuesta. En ambos, no se observó X-Frame-Options ni CSP. **No se certifica protección de framing ni CSP inexistente.** Se respetó el alcance de inventariar configuración actual; definir estas cabeceras y robots globales del CMS antes del lanzamiento. No se introdujo una CSP compleja durante esta etapa. Noindex no es control de acceso.

## Rendimiento real HTTPS

Muestras pequeñas desde esta máquina. Primera petición no garantiza isolate frío. Se consumió el cuerpo SSR completo para no cancelar tareas de renovación.

| Ruta | Primera ms | Warm ms | TTL vencido ms | Renovada ms | API 503 con snapshot ms |
|---|---:|---:|---:|---:|---:|
| Home | 2987 | 778 / 342 | 855 | 323 | 5832 |
| Servicios | 356 | 364 / 416 | 497 | 233 | 531 |
| FAQ | 546 | 221 / 256 | 436 | 256 | 421 |

Caché funcional: hits sin refresh Content API, renovación a 60 s y ETag/304. Se conserva lectura de snapshot para evitar regresión de versión. Home durante outage después de redeploy: 1267 ms. Datos de caída proceden del ensayo de publicación, no de la misma corrida TTL.

Los warm de 5D fueron aproximadamente 176–226 ms: **esta muestra 5E es más lenta/variable**, especialmente Home. No se demuestra una mejora ni se atribuye la diferencia a una causa sin perfilar. Son mediciones de red extremo a extremo, no CPU. Investigar outliers y ejecutar carga/CPU antes de producción.

Local: Home 61/31/39 ms, Servicios 67/34/48 ms, FAQ 80/31/78 ms (primera/warm/outage); cero refresh API warm y tres 304 observados. No comparar directamente localhost con Workers.

## Tests y cambios

PASS en ambos: `npm install`, lint, typecheck/tsc, Next build y OpenNext staging. CMS: 17 migraciones PGlite con RLS/outbox/store, delivery, scheduler, ETag, adapter, Content API remoto, boundaries y 12 comprobaciones de guard. Blumik: `verify-hyronix`, resilience/cache/webhook/replay, integración local y HTTPS. No hubo nuevas migraciones 5E; se mantienen 016/017 y publicación atómica.

Correcciones de certificación: navegador Chrome alternativo; screenshots del elemento tras animación; build local separado del staging que deshabilita SQLite; espera de propagación por ruta durante rollback; reconocimiento correcto del redirect de streaming; placeholders documentales excluidos de regex después de comprobar que no son claves. Los intentos fallidos no se ocultaron ni se contaron como PASS.

Cambios de aplicación: guard de entorno, harness explícito solo staging, flag `HYRONIX_ENABLED=false` para fallback total, plantillas production sin valores. Sin rediseño ni reconstrucción de 5B–5D.

### Dependencias

Override limitado `@node-minify/core → glob 10.5.0`, compatible con builds/tests. Se eliminó la cadena BUILD ONLY OpenNext → AWS → node-minify → glob afectada por [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2).

Auditoría final: CMS **5 high**, Blumik **7 high**, todos derivados de braces/micromatch en herramientas. CMS: eslint-config-next → plugin Next → fast-glob → micromatch → braces. Blumik: shadcn → registry/fast-glob y shadcn → ts-morph → @ts-morph/common → fast-glob; ambas llegan a micromatch/braces. Clasificación **DEV ONLY**; no pasar patrones no confiables a esas herramientas. Aviso [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). No había actualización compatible resolutiva en el lock/registro inspeccionado; no downgrade ni `audit fix --force`.

`npm audit --omit=dev`: **0 en ambos árboles**. Esto describe el grafo npm, no garantiza ausencia universal de vulnerabilidades en código generado. `dependency-review.json` conserva cadenas/rangos y fecha.

## Decisiones y siguiente etapa

- **ACCEPTED_RISK:** caída conjunta API+Supabase puede usar original local; tooling residual acotado; middleware experimental sujeto a pruebas. Justificación en los documentos enlazados.
- **MUST_FIX antes de lanzamiento:** presupuesto de KV/CPU bajo tráfico sostenido; revisar variación de latencia; build Linux reproducible; configuración productiva independiente, headers CMS y decisión explícita para media nueva. Producción sigue sin crear.
- **GO** para la siguiente etapa de capacidad/configuración preproductiva. **NO-GO** para lanzamiento público con la configuración Free actual sin esas verificaciones.

Documentos complementarios: [capacidad Free](FREE_TIER_CAPACITY_NOTES.md), [decisión media/LKG](MEDIA_RESILIENCE_DECISION.md), [runbook](PRODUCTION_RUNBOOK.md), [rotación](SECRET_ROTATION_REPORT.md).

No se modificaron dominio público, DNS, cPanel, Analytics/Search Console, planes ni main. Ningún secreto, JWT o contraseña se incluye en estos reportes.
