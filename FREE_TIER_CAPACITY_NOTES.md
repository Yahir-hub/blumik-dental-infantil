# Capacidad Free — límites, estimaciones y desconocidos

Revisión: 14 de octubre de 2026. No se contrató capacidad ni se cambió de plan.

## Límites documentados

| Servicio | Free documentado |
|---|---|
| Workers | 100 000 solicitudes/día por cuenta; 10 ms CPU por invocación HTTP/Cron; 128 MB RAM; 50 subrequests; 5 Cron por cuenta |
| KV | 100 000 lecturas/día; 1000 escrituras/día; 1000 eliminaciones y listados/día; 1 GB almacenado |
| D1 | 5 millones de filas leídas/día; 100 000 escritas/día; 5 GB almacenados |
| Supabase | DB 500 MB; Storage 1 GB; egreso 5 GB y 5 GB cacheado; 50 000 MAU; recursos compartidos; pausa por inactividad, sin backups automáticos/PITR Free |

Las cuotas son del plan/cuenta, no capacidad dedicada a estos dos sitios. Workers puede responder 1027 al agotar solicitudes. KV rechaza operaciones al exceder su cuota diaria. Esperar red no consume CPU, pero SSR sí. No confundir latencia con CPU.

Fuentes: [Workers](https://developers.cloudflare.com/workers/platform/limits/), [KV](https://developers.cloudflare.com/kv/platform/pricing/), [D1](https://developers.cloudflare.com/d1/platform/pricing/), [Supabase](https://supabase.com/pricing).

## Estimaciones, no mediciones de consumo

- Cron cada minuto: **1440 invocaciones/día**, incluso sin publicaciones. Ejecuta consulta de claim; lote máximo cinco. 7200 eventos/día es solo un techo aritmético, no throughput certificado.
- Ocho recursos cacheables: settings y siete páginas. TTL 60 s. Si cada recurso se renueva cada minuto bajo tráfico continuo, serían aproximadamente **11 520 escrituras KV/día**, antes de despliegues, concurrencia o otras ubicaciones. Incluso un recurso continuamente renovado puede alcanzar 1440/día.
- Un deploy Blumik de esta etapa precargó 76 entradas KV. La caché regenerable y las tags añaden operaciones; no son gratuitas por ser internas.
- El snapshot PostgreSQL se consulta para impedir regresión por KV eventual. Un cache hit evita refresh de Content API, pero no toda consulta al store.

## Desconocidos

No se midieron uso acumulado de cuenta, CPU p95/p99, distribución por ubicación, concurrencia sostenida, tamaño mensual de egreso ni carga real futura. Las muestras HTTPS guardadas no son una prueba de carga. Tampoco se garantiza que el mismo volumen quepa en Free al compartir cuenta con otros proyectos.

## Decisión: MUST_FIX antes de lanzamiento público

El TTL 60 s está certificado funcionalmente en staging; **no está certificado para tráfico productivo sostenido dentro de 1000 escrituras KV/día**. Antes de producción: medir consumo real con carga acotada, definir presupuesto de escrituras/CPU, ajustar renovación y/o estrategia de caché preservando invalidación y LKG. Si la solución requiere pago, solicitar aprobación en esa etapa. No se elevó TTL ni contrató recursos arbitrariamente en esta certificación.

Resultado de revisión: PASS. Capacidad productiva demostrada: NO.
