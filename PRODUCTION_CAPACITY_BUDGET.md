# Capacidad productiva — ETAPA 5F

15 de octubre de 2026. Decisión: **PAID_CAPACITY_REQUIRED** para la arquitectura SSR actual. No se contrató nada.

## Política KV

La publicación transaccional → outbox → Cron cada minuto → webhook HMAC es la fuente primaria de frescura. El TTL es recuperación ante una entrega perdida. Se conserva `unstable_cache`, disponible en Next 16.4.0 aunque su documentación recomienda `use cache` para nuevas implementaciones. No se reconstruyó la integración certificada.

| Safety TTL | Renovaciones base para 8 recursos/24 h | Margen sobre 1.000 writes Free | Recuperación sin webhook |
|---|---:|---:|---|
| 15 min | 768 | 232 | Próxima lectura tras vencimiento |
| 30 min | 384 | 616 | Igual, hasta 30 min + renovación |
| 60 min | 192 | 808 | Igual, hasta 1 h + renovación |
| **120 min** | **96** | **904** | Hasta 2 h + renovación |

Selección: **HYRONIX_CONTENT_REVALIDATE_SECONDS=7200**, centralizada. Un fallo sostenido de API conserva LKG; el TTL no promete resolver un origen caído. Next puede servir el valor anterior mientras renueva. La prueba Linux equivalente de 2 segundos rechazó un webhook sin firma y recuperó el nuevo contenido por TTL.

Presupuesto ESTIMATED inicial: 96 renovaciones × factor 2 por concurrencia/propagación = **192 writes/día base**. Dos deploys × 20 entradas = 40; cinco publicaciones que afecten los ocho recursos × factor 2 = 80; total de planificación **312/día**, frente al guardrail 400. El factor no es un límite técnico: más regiones, publicaciones o carreras pueden elevarlo. Tags se almacenan en D1, no KV. No se simularon 24 horas ni se presenta esta estimación como factura medida.

## Medición real acotada

Evidencia: `artifacts/etapa5f/{baseline,warm,outage}-measurement.json`, `provider-{before,after,final}.json` y `provider-metric-schema.json`.

- 60 solicitudes baseline + 300 después del cambio + 60 en caída: **420 solicitudes de carga**, concurrencia 5, pausa de 100 ms por trabajador. Las sondas funcionales adicionales están separadas; no hubo carga sobre producción.
- Warm: **0 errores**, tail observó 82 eventos, 164 lecturas KV, 157 hits (**95,7%**), 6 escrituras y 7 renovaciones. Incluye el arranque frío del build, no se eliminaron outliers.
- GraphQL antes/después: writes 18→30 (**12 adicionales observadas**), reads 0→499; 302 invocaciones Blumik, 0 errores. Son agregados adaptativos con retraso, no contadores exactos de las 300 solicitudes. El deploy también puede contabilizarse con retraso.
- Al finalizar: KV 817 reads, 37 writes, 1 list; D1 630 consultas de lectura/6 de escritura, **3.750 filas leídas/12 escritas**. Ventana: día UTC indicado en cada JSON; incluye verificaciones.
- Durante caída: 36 eventos tail, 72 misses/renovaciones fallidas, **0 writes KV**; los 60 HTML respondieron correctamente usando snapshots. No se guardan respuestas de error en caché.
- El snapshot autoritativo se consulta junto al KV y se reutiliza en el fallo. Sigue habiendo dos lecturas PostgreSQL por SSR (página + settings), incluso con KV hit, para impedir retroceder ante KV eventualmente consistente.

## Límites, medidas y desconocidos

| Recurso | KNOWN LIMIT Free | MEASURED | ESTIMATED / UNKNOWN |
|---|---|---|---|
| Workers | 100.000 requests/día | 302 requests/0 errores en ventana de carga | Guardrail inicial: 1.000 SSR/día; assets y Cron contabilizados aparte |
| CPU Workers | 10 ms/invocación | Blumik GraphQL p50 **21,8 ms**, p99 **346,134 ms**; tail p50 25 ms, p99 393 ms | **No cabe con margen en Free**. No asumir que respuestas exitosas garantizan tolerancia futura |
| KV reads | 100.000/día | 499 tras carga; 817 al cierre | ~2 por SSR + operaciones de deploy/verificación |
| KV writes | 1.000/día | Δ12 durante ventana; total 37 al cierre | 192 base / 312 con reserva editorial y deploys |
| D1 | 5 M filas leídas y 100.000 escritas/día | 3.750 / 12 | Índices existentes; revisar consumo real al crecer |
| Supabase DB | 500 MB | **14.309.043 bytes** en DEV | Crecimiento de auditoría/outbox requiere revisión semanal |
| Supabase Storage | 1 GB | **7.980.052 bytes**, 26 objetos | Caché edge reduce lecturas; no elimina dependencia del origen |
| Supabase egress | 5 GB + 5 GB cached/mes | Tamaños por snapshot en `state-kv-capacity.json` | **UNKNOWN** facturación real: bytes JSON no equivalen a egress facturado; revisar panel antes del cutover |
| Cron | Intervalo configurado 1 min | Entrega B y restauración reales, intento 1 | 1.440 invocaciones/día; batch máximo 5, sin bucles persistentes |

El esquema GraphQL del proveedor confirma CPU en **microsegundos**: dividir por 1.000 para ms. Los percentiles de CPU no son TTFB. CMS p50 2,705 ms/p99 235,568 ms (mezcla Cron/API/panel); también tiene picos sobre Free. Un `clientDisconnected` agregado no equivale a una respuesta 500.

## Decisión y operación

**KV BUDGET: PASS**, con guardrails; **FREE TIER INITIAL: NOT_ACCEPTABLE**, por CPU. Opción mínima conservando arquitectura: Workers Paid, base publicada **USD 5/mes + consumo excedente**, a aprobar en etapa 6. No implica contratar Supabase Pro ni otros servicios. Alternativa sin pago: conservar el sitio actual y no hacer cutover; una solución estática distinta requeriría otro alcance, no se implementó.

Primeras dos semanas: revisar diariamente requests, CPU, KV writes/reads, D1, egress y backlog outbox. Alertas operativas manuales: writes Blumik >400/día o cuenta >700/1.000; reads cuenta >70.000/día; D1 >70% de cuota; egress >60% proyectado; cualquier outbox failed o lag >3 min. Pausar deploys/pruebas repetitivas y diagnosticar, sin borrar eventos ni snapshots. Semanal: tamaño DB/Storage y crecimiento de auditoría, confirmar costos y cuotas compartidas. No se instaló monitoring pago.

Fuentes oficiales consultadas: [Workers](https://developers.cloudflare.com/workers/platform/pricing/), [KV](https://developers.cloudflare.com/kv/platform/pricing/), [Supabase](https://supabase.com/pricing). Límites y precios verificados el 15-10-2026; reevaluar al autorizar producción.
