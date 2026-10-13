# Runner automático de staging

Fecha: 2026-10-12 (America/Mexico_City).

Cloudflare Cron invoca `scheduled` en `hyronix-cms-staging` cada minuto. El wrapper oficial de OpenNext conserva `fetch` y agrega el handler nativo. No existe un bucle persistente ni se depende de una terminal abierta. Esto sustituye la propuesta inicial de pg_cron/pg_net: no se necesitan extensiones ni secretos adicionales en Vault.

`scripts/lib/scheduled-delivery.mjs` exige entorno staging, proyecto Supabase DEV, site key y destino HTTPS exactos. Procesa como máximo cinco eventos por tick. La función existente mantiene claim/lease, HMAC, timeout, backoff con jitter, Retry-After, máximo de intentos y estado failed. El scheduler no elimina eventos fallidos.

Se esperan 1.440 invocaciones diarias y una consulta de claim por minuto sin eventos; deben vigilarse las cuotas del plan Free. No se activó un plan de pago. Los cambios del Cron pueden tardar en propagarse según Cloudflare.

El scheduler es nativo y no expone un endpoint de disparo. `/api/internal/delivery` sigue disponible para diagnóstico autorizado, protegido por un secreto distinto del HMAC. Las llamadas anónimas devuelven 401.

Logs seguros: resultado, cantidad procesada, event_id, site_key público, versión, tipo, latencia e intento. No se registran secretos, firmas, cookies ni cuerpos de contenido.

Estado: PASS real. Dos ejecuciones publicación → tick nativo → webhook → SSR → restauración sin runner manual. Última: B versión 429 entregada en intento 1 (30,8 s observados), restauración 431 intento 1 (20,5 s). Polling cada 10 s: intervalos observados, no latencias internas exactas. Evidencia: artifacts/etapa5d/publication.json.

Referencias: [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/), [wrapper OpenNext](https://opennext.js.org/cloudflare/howtos/custom-worker).
