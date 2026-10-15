# HYRONIX + BLUMIK — cierre ETAPA 5F

15 de octubre de 2026. **PRODUCTION READY: NO.**

**STAGING FUNCTIONAL CERTIFIED.** El bloqueo de producción restante es capacidad CPU en Workers Free. No se compró ningún plan, no se desplegó producción, no se modificó DNS/cPanel/dominio Hyronix ni se mergeó main.

## Matriz final

| Criterio | Resultado | Evidencia |
|---|---|---|
| CACHE POLICY | PASS | Eventos primarios + safety TTL 7.200 s, centralizado |
| KV BUDGET | PASS | 192 writes/día base con reserva; Δ12 observado durante carga; presupuesto operativo 312 |
| LOAD TEST | PASS | 420 requests de carga, concurrencia 5, cero errores |
| WORKER CPU | **FAIL para Free** | GraphQL Blumik p50 21,8 ms, p99 346,134 ms frente a 10 ms/invocación |
| PERFORMANCE | PASS para presupuesto inicial | Warm p95 <1 s; caída p95 <2 s en Home/Servicios/FAQ |
| PUBLICATION FRESHNESS | PASS | B visible en **68.774 ms** mediante Cron, antes del TTL |
| MEDIA EDGE CACHE | PASS | Bytes A conservados en edge tras reemplazo por B; errores no-store |
| MEDIA VERSIONING | PASS | A v1 → B v2; contenido nuevo referencia B; trigger impide versión arbitraria |
| CMS HEADERS | PASS | HTTPS login/dashboard/hyronix/API; sesión Supabase real |
| CMS NOINDEX | PASS | X-Robots-Tag y robots.txt, panel no indexable |
| LINUX BUILD HYRONIX | PASS | Next/OpenNext, Proxy/Auth, lint/types/tests/scans |
| LINUX BUILD BLUMIK | PASS | Next/OpenNext, 7 SSR, resilience/cache/webhook/scans |
| OPENNEXT PATCH LINUX | PASS | Versiones exactas e idempotencia |
| SECRET BOUNDARY | PASS | Código/assets Linux, módulos desplegados y logs; 0 hallazgos |
| PRODUCTION CONFIG ISOLATION | PASS | Plantillas separadas; guard rechaza DEV/ref/KV/D1/harness/namespace staging |
| DEV→PROD MIGRATION PLAN | PASS | Plan escrito, no ejecutado |
| ROLLBACK | PASS | 7 rutas originales con assets locales/SEO; integración restaurada |
| LAST KNOWN GOOD | PASS | B permanece ante 503/JSON corrupto; store compartido y replay probados |
| NO DRAFT | PASS | API/SSR, 24 entradas fetch del KV actual, 8 snapshots sin draft_value |
| DEPENDENCIES PRODUCTION | PASS | npm audit --omit=dev: 0 en ambos proyectos |
| FREE TIER INITIAL | **NOT_ACCEPTABLE** | CPU medida no cabe con margen |
| PRODUCTION READY | **NO** | PAID_CAPACITY_REQUIRED; aprobación pendiente, sin compra |

## Rendimiento HTTPS, milisegundos

| Ruta | Baseline p50 / p95 | Después p50 / p95 / p99 | API 503 + snapshot p50 / p95 |
|---|---|---|---|
| Home | 225 / 2.195 | **149 / 741 / 2.156** | **190 / 1.602** |
| Servicios | 240 / 2.237 | **145 / 681 / 2.110** | **274 / 1.374** |
| FAQ | 255 / 2.213 | **159 / 728 / 1.739** | **205 / 1.130** |

Muestras: baseline 16/15/15; después 76/75/75; caída 16/15/15. Red/región/momento y estados fríos difieren: comparación observada, no benchmark controlado ni garantía global. Se retuvieron los outliers. La medición después incluye primeras lecturas tras deploy; no certifica cold isolates de forma determinista.

Trazas muestran KV 0–83 ms, snapshots hasta 260 ms y renovaciones iniciales de 873–1.382 ms. Home/settings arrancan juntos (mismo timestamp), sin espera serial duplicada de snapshot. Los picos iniciales coinciden con misses/renovaciones y CPU alta; no se atribuye todo a Supabase. Presupuesto inicial: warm p50 <350 ms/p95 <1.000 ms; caída p95 <2.000 ms. Cumple en la muestra. CPU sigue siendo el impedimento para Free, aunque las respuestas de la prueba fueron exitosas.

## Cambios concretos y validaciones

- Blumik: TTL 60→7.200; lectura KV y snapshot en paralelo, reutilización de la lectura autoritativa, deduplicación React conservada, instrumentación de tiempos solo staging. Sin rediseño ni pérdida de JSX original.
- CMS: cinco headers globales y robots disallow; media pública excluida de headers del panel. X-Frame-Options DENY es la protección de framing elegida. No se introdujo CSP compleja que rompa Auth.
- Media: caché edge únicamente GET publicado/versionado exitoso e immutable, 1 año; sin cachear errores. Migración **202610140018_immutable_media_version.sql**, probada localmente, dry-run solo esa migración, aplicada exclusivamente en DEV. Total 18 migraciones.
- Fixture media limpio: A/B con hashes comparados, URL v2 publicada, A aún disponible en edge, v999=404 no-store. Se corrigió la limpieza del fixture para borrar hijos antes del padre y evitar el FK del audit trigger; 0 fixtures restantes.
- Publicación controlada: B versión 437; restauración versión 439. Draft y published iguales al valor original; se conservaron auditoría/outbox. Duplicado entregado por Cron no altera snapshot/replay. No hubo redeploy adicional dentro de esta prueba 5F; persistencia entre redeploys consta en 5E, reinicio local se repitió en Linux.
- Auth de headers: sesión real del propietario mediante link administrativo verificado en memoria, sin envío de correo/cambio de contraseña. Cookies SSR usadas sobre HTTPS y sesión de prueba cerrada; no se presenta como una nueva prueba del formulario de contraseña.
- Tests reales: Content API 26 checks/7 comparaciones, media/ETag; RLS con JWT temporal y rechazo de autopromoción, usuario eliminado; store CAS/replay concurrente/rate limit en namespace temporal eliminado; siete rutas/noindex/canonical y webhook sin firma/tipo/tamaño.
- Tooling conserva 5 high CMS/7 high Blumik, en cadenas braces/micromatch/fast-glob y herramientas ESLint/shadcn. Auditoría producción=0; sin downgrade ni fix --force. Builds Linux con lockfiles inalterados.

## BLOCKERS

**Uno: presupuesto CPU de Workers Free.** Opción mínima para esta arquitectura: Workers Paid desde USD 5/mes más excedentes, sujeto a autorización expresa en etapa 6. No se contrató ni cambió facturación. Si se exige costo cero, mantener el sitio vigente y no hacer cutover con esta arquitectura SSR.

Crear los recursos productivos independientes, migrar datos autorizados, crear repo privado del CMS y configurar Auth/dominio/cutover son tareas previstas de etapa 6, no acciones ejecutadas ni una certificación anticipada del futuro entorno.

## ACCEPTED RISK y FUTURE IMPROVEMENTS

- Imagen nueva sin copia local: si nunca estuvo en el edge, o fue expulsada, una caída total del origen no garantiza sus bytes. Opción C adoptada, sin replicación completa.
- API + PostgreSQL caídos y caché agotada: puede volver al contenido local original; la prueba obligatoria certifica API caída con store durable disponible. No se promete independencia total de Supabase.
- Media immutable previamente pública puede permanecer en cachés hasta un año tras retirarse. Para revocación urgente se necesitaría un procedimiento específico; no publicar material confidencial en esa capa.
- Reevaluar tooling cuando exista corrección compatible y retirar el parche cuando lo soporte el adaptador. No bloquea este cierre ni autoriza upgrades automáticos.

## Entregables

- [Presupuesto y cuotas](PRODUCTION_CAPACITY_BUDGET.md)
- [Certificación Linux](LINUX_BUILD_CERTIFICATION.md)
- [Migración productiva](PRODUCTION_DATA_MIGRATION_PLAN.md)
- [Control de versiones CMS](CMS_SOURCE_CONTROL_PLAN.md)
- Evidencia sanitizada: `artifacts/etapa5f/`.

**PRODUCTION MODIFIED: NO · MAIN MERGED: NO · CUSTOM DOMAIN: NO · PAID RESOURCES PURCHASED: NO.**
