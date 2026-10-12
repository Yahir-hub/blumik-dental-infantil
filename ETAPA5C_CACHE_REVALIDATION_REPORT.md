# ETAPA5C — CACHE + LAST-KNOWN-GOOD + REVALIDACIÓN

Fecha: 2026-10-11 America/Mexico_City (evidencia técnica usa timestamps UTC). **PASS en local/DEV; no es una certificación de despliegue serverless.**

| Control | Estado |
|---|---|
| NEXT CACHE | PASS |
| CACHE TAGS | PASS |
| LAST KNOWN GOOD | PASS |
| LOCAL FALLBACK | PASS |
| OUTBOX | PASS |
| PUBLICATION ATOMICITY | PASS |
| WEBHOOK | PASS |
| HMAC | PASS |
| REPLAY PROTECTION | PASS |
| IDEMPOTENCY | PASS |
| OUT OF ORDER | PASS |
| ROUTE ALLOWLIST | PASS |
| REVALIDATION | PASS |
| SNAPSHOT | PASS |
| CORRUPT API FALLBACK | PASS |
| API OUTAGE AFTER NEW PUBLISH | PASS |
| SEO FALLBACK | PASS |
| MEDIA VERSIONING | PASS |
| DRAFT LEAK | PASS |
| BUILD HYRONIX | PASS |
| BUILD BLUMIK | PASS |
| PERFORMANCE | Caché caliente: 0 consultas API repetidas; métricas abajo |
| PRODUCTION MODIFIED | NO |
| MAIN MERGED | NO |
| CUSTOM DOMAIN | NO |

## Prueba crítica real

Contenido Blumik DEV original → publicación temporal visible B, versión421 → evento durable → runner firmado → SSR B → API503 con invalidación → SSR conserva B. Publicación de restauración versión423; draft_value y published_value recuperan exactamente los valores originales. Verificación final de144 campos/7 páginas/26 imágenes y único propietario PASS. Auditoría/revisiones y4 eventos delivered conservados (incluyen un primer ensayo cuyo marcador quedó en un párrafo no renderizado; se restauró y corrigió la prueba).

No se editó producción. Las pruebas sintéticas de seguridad y corrupción usan copias en proxy local. La prueba crítica de publicación usa Supabase DEV real a través de RPC y CLI Management API con identidad del propietario existente; no simula un login ni pretende certificar nuevamente la UI de publicación de etapas anteriores.

## Arquitectura / cambios

Blumik: caché Next60 s sobre datos validados; snapshot CAS por recurso; contrato SnapshotStore y WebhookReplayStore; SQLite transaccional local; tags, Route Handler autenticado, allowlist de7 rutas y prewarm de snapshots. SSR/metadata/settings/FAQ continúan en los componentes certificados5B. No se cambió diseño ni rutas públicas.

CMS/DB: una migración añade public.hyronix_outbox, índice de pendientes, RLS sin policies de usuario, RPCs claim/finish solo privilegiadas y generación atómica desde bump_content_version. Outbox solo contiene referencias/versiones, no borradores o personas. Runner CLI finito con leases, timeout, jitter/backoff y failed durable. Acciones de usuario siguen SSR+RLS; no se añadió envío de red dentro de la transacción SQL.

## Rendimiento local

| Ruta | 5B TTFB CMS ms | 5C cold CMS real ms | 5C warm ms | Consultas API warm |
|---|---:|---:|---:|---:|
| home | 1066 | 741 | 34 | 0 |
| servicios | 229 | 285 | 26 | 0 |
| preguntas-frecuentes | 220 | 318 | 23 | 0 |

Caída real de API conservando B: 31 ms. Suite controlada de caché/reinicio: home outage 29 ms; servicios outage 43 ms; preguntas-frecuentes outage 62 ms. Cache hit, expiración con renovación, invalidación y ETag304 comprobados. Las muestras son locales, no benchmark estadístico ni Core Web Vitals de producción; cold incluye red Supabase/arranque y varía. La mejora demostrable es eliminar consultas repetidas, no prometer el mismo TTFB en otro proveedor.

## Tests y evidencia

| Ejecución | Resultado |
|---|---|
| npm install ambos proyectos | PASS; certificados de sistema en este equipo |
| Blumik lint, tsc --noEmit, build | PASS, Next16.4.0 |
| scripts/verify-hyronix.mjs | PASS:7 rutas, SSR/SEO/FAQ/settings, erroresHTTP/JSON/timeout, sitemap/robots |
| scripts/test-resilience.mjs | PASS: CAS, reinicio, corrupción, versión vieja, HMAC, replay concurrente, rate limit |
| scripts/test-cache-integration.mjs | PASS: caché Next real, TTL, ETag, snapshot, API caída y reinicio conservan B; fallback original sin snapshot |
| CMS lint, typecheck, build | PASS |
| npm run test:migrations | PASS:16 migraciones, seed/RLS/regresión, outbox/rollback,4 tipos, leases/retry/dead-letter |
| scripts/test-delivery.mjs | PASS: firma, timeout, reintentos, Retry-After, rechazo permanente, destino seguro |
| scripts/test-content-api.mjs | PASS:26 HTTP checks,7 comparaciones, media/versiones/ETags y adaptadores |
| scripts/verify-5c-live.mjs | PASS: publicación real, outbox, entrega, snapshot B durante caída, restauración |
| scripts/check-blumik.mjs published | PASS:144 valores originales,26 imágenes,1 usuario |
| secret-boundary CMS/Blumik | PASS: secreto real ausente de fuente/build; referencias webhook fuera de bundles cliente |
| Supabase db push --dry-run → push → dry-run | PASS:solo migración16; sincronizado después |

Evidencia: artifacts/etapa5c/{live-publication.json,live-published-B.html,live-outage-B.html,restart-outage-B.html,cache.json,resilience.json,ssr-regression.json}. El propio test de snapshots comprueba ausencia de draft ante payload malicioso. No se guardan claves efímeras, JWT o contraseñas. La versión media existente se conserva; reemplazo/media events se prueban localmente y URLs/ETag reales mediante Content API, sin reemplazar fotos reales en DEV.

## Dependencias

Actualizaciones compatibles de transitivas y tooling; oxfmt0.72.0 corrige los avisos críticos, shadcn4.21.4 mantiene major4. Blumik quedó con7 avisos altos exclusivamente de tooling (incluye ahora @shadcn/registry); 0 críticos y0 vulnerabilidades de producción según npm audit --omit=dev. CMS conserva5 altos de la cadena ESLint/fast-glob/braces. No se aplicó audit fix --force ni downgrade sugerido de shadcn/Next ESLint. Requiere seguimiento; los conteos no equivalen a7/5 fallos explotables del sitio público ni certifican que toda dependencia sea segura.

## Límites restantes antes de producción

1. Implementar proveedor durable compartido para snapshots, replay y rate limit. El adapter SQLite es solo local/host persistente y se bloquea en Vercel/Lambda. No se compró servicio.
2. Configurar secreto dedicado por ambiente y scheduler/worker durable que invoque el runner. El endpoint normal sin secreto permanece cerrado; tests completos usan claves efímeras. Outbox se conserva aunque el runner no esté activo.
3. Prewarm renueva snapshots; no precalienta todo el HTML/Next Data Cache ni promete cero latencia en el primer miss. TTL tiene semántica stale-while-revalidate de Next; webhook expira inmediatamente.
4. Los bytes de media nueva aún dependen del proxy/API; su fallback extremo sigue siendo asset original. Snapshot garantiza contenido/SEO/referencias, no réplica de archivos. No se hizo purge Cloudflare.
5. Resolver avisos de tooling cuando haya solución compatible, medir carga y fallos del proveedor final, monitorear failed/lag y definir runbook de recuperación/retención.
6. Dominio Hyronix al final; despliegue y merge requieren una etapa posterior. No se modificó main, DNS, Cloudflare, cPanel o Blumik productivo.

Rama local hyronix-cms-integration; base5B16e15e0. Cambios nuevos concentrados en lib/hyronix, app/api/hyronix/revalidate, scripts de tests, configuración/env sin secretos y documentación. CMS workspace sin Git: migración/scripts/reportes se conservan en disco. No hay bloqueo para continuar pruebas locales.
