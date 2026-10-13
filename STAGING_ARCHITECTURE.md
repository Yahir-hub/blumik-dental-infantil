# Arquitectura staging 5D
13 de octubre de 2026.

- hyronix-cms-staging.yahir-rp-ti.workers.dev: CMS SSR/Auth/actions, Content API, scheduled.
- blumik-hyronix-staging.yahir-rp-ti.workers.dev: siete SSR, webhook, cache/fallback.
- Next 16.4.0 / OpenNext 1.20.10, Workers Free + nodejs_compat.

Publicación → transacción Supabase/outbox → Cron nativo cada minuto → HTTPS HMAC → replay/rate PostgreSQL → prewarm validado → tags/paths D1.
Blumik SSR → Next Data Cache KV (60 s) → Content API validada → snapshot CAS PostgreSQL. Comparación final de versión impide regresión KV. React cache deduplica metadata/FAQ/UI. Con API caída: snapshot; con store también caído: original local.

Scheduler ejecuta core directamente, lote cinco, sin endpoint público/bucle/pg_cron/pg_net. Conserva leases/backoff/jitter/failed. Destino staging fijo y 3xx rechazados.
Capacidad limitada en Blumik; clave administrativa solo CMS bindings runtime. API normal mantiene RLS/sesión. Artefactos actuales limpios; ver salvedad histórica en reporte.

Noindex/nofollow, robots disallow y X-Robots-Tag staging; canonical productivo intacto. Diseño, producción, main, DNS, cPanel y dominio Hyronix sin cambios.
Vercel Hobby evaluado/descartado por restricciones comercial/Cron. No se tocó su proyecto productivo. Free requiere vigilar cuotas/CPU. Auth real probada; middleware Node adapter sigue experimental.

Fixture CMS /__staging_harness/ responde solo 503/JSON inválido a site/slugs fijos; no lee/escribe datos ni acepta destinos. Binding temporal HYRONIX_STAGING_API_MODE afecta solo staging y se restaura al terminar. unavailable también ejercita errores de imágenes sin borrar media.

[OpenNext](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), [cache](https://opennext.js.org/cloudflare/caching), [límites](https://developers.cloudflare.com/workers/platform/limits/). Semántica Next contrastada con docs/runtime instalados.
