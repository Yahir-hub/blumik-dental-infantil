# ETAPA 5D — staging real
13 de octubre de 2026 · America/Mexico_City.

**Actualización 14 de octubre: pendientes técnicos de 5D cerrados en ETAPA 5E.** Media visual pasó con Chrome/Playwright, la clave administrativa histórica fue rotada/revocada y las seis versiones afectadas fueron retiradas. Véase [ETAPA5E_PREPRODUCTION_REPORT.md](ETAPA5E_PREPRODUCTION_REPORT.md). El resto de este informe conserva resultados y límites observados originalmente en 5D; el dictamen vigente de producción es NO por los pendientes preproductivos detallados en 5E.

- CMS: https://hyronix-cms-staging.yahir-rp-ti.workers.dev
- Blumik: https://blumik-hyronix-staging.yahir-rp-ti.workers.dev
- Supabase DEV: gtvwovlcotccpfgmhcas, PostgreSQL 17.11.
- Blumik: rama hyronix-cms-integration. CMS sin remoto Git.
- Next 16.4.0 / OpenNext Cloudflare 1.20.10 / OpenNext AWS 4.1.9.

## Matriz
| Comprobación | Resultado |
|---|---|
| HYRONIX STAGING | PASS: API, SSR/Auth y Control Center real |
| BLUMIK STAGING | PASS funcional: siete SSR, SEO/FAQ y noindex; pendiente visual indicado |
| HTTPS | PASS |
| AUTH | PASS: login propietario, recarga tras varias horas, logout y redirección anónima /hyronix → /login |
| CONTENT API | PASS: 26 checks y siete comparaciones con fuente |
| DURABLE SNAPSHOT | PASS: PostgreSQL CAS, ocho recursos |
| DURABLE REPLAY | PASS: leases/IDs persistidos |
| DURABLE RATE LIMIT | PASS: bucket compartido 10 / reposición 0,5 por segundo |
| CROSS INSTANCE | PASS: peticiones independientes/concurrentes, CAS 42 vence 41, única reserva |
| REDEPLOY PERSISTENCE | PASS: B persiste con API caída; replay sigue duplicate |
| SCHEDULER | PASS: Cron nativo cada minuto |
| OUTBOX DELIVERY | PASS: B y restauración entregadas automáticamente, intento 1 |
| WEBHOOK HTTPS | PASS: destino fijo staging, sin redirects |
| HMAC | PASS |
| REPLAY | PASS, incluido después de redeploy |
| OUT OF ORDER | PASS: obsolete y CAS sin regresión |
| REVALIDATION | PASS: tags/paths persistidos D1 y publicación visible antes del TTL |
| NEXT CACHE | PASS: hits remotos sin refresh API, TTL 60 s y renovación |
| LAST KNOWN GOOD | PASS: B conserva B con 503, JSON corrupto y redeploy |
| API OUTAGE | PASS: tres rutas 200 con snapshot |
| MEDIA | PASS cerrado en 5E: Chrome hidratado, 503 → asset local visible, capturas y resultado estructurado |
| DRAFT LEAK | PASS: API, snapshot/store y outbox |
| SECRET BOUNDARY | PASS artefactos actuales; salvedad histórica abajo |
| RLS | PASS: anónimo y JWT real sin membresía denegados; autoascenso staff y RPC privado rechazados |
| CUSTOM DOMAIN HYRONIX | NO |
| BLUMIK PRODUCTION MODIFIED | NO |
| MAIN MERGED | NO |
| PAID RESOURCE CREATED | NO |

## Publicación real
Segunda ejecución: A versión 427 → B 429 → 503/corrupción/redeploy conservan B → restauración exacta de draft/published A versión 431. Conserva auditoría/outbox. Primera ejecución también pasó (425 → 427).
- B: e93d920a-a64f-4e89-8d81-5fd4da37bd2f, entrega observada 30,8 s.
- Restauración: 9aec9497-ffd9-4dbf-8fa4-bff9d7e96ee4, 20,5 s.
- RPC real de publicación con actor propietario en transacción DEV; no se afirma clic Publicar en navegador en esta etapa.
- Sin contenido temporal ni usuarios sintéticos permanentes. El usuario RLS temporal y namespace de pruebas se eliminaron.

## Rendimiento HTTPS
Muestras pequeñas desde esta máquina; primera lectura no significa cold start garantizado. Cuerpo SSR consumido completo.

| Ruta | Primera ms | Warm ms | TTL expirado ms | Renovada ms |
|---|---:|---:|---:|---:|
| Home | 1535 | 179 / 176 | 572 | 182 |
| Servicios | 354 | 226 / 179 | 275 | 188 |
| FAQ | 617 | 184 / 211 | 282 | 198 |

Warm: cero refresh Content API en logs. Se mantiene consulta final al snapshot para impedir regresión por KV eventualmente consistente. TTFB outage/publicación: publication.json; API y webhook: https-probes.json.
La primera medición cancelaba el stream al recibir headers, interrumpiendo escrituras pendientes. Probe corregido para consumir HTML completo; cache hit y TTL confirmados en Workers Logs.

## Cambios
Migración 017 aplicada únicamente DEV tras PGlite/dry-run: store privado, replay, versiones/capacidad por namespace. Outbox/publicación atómicos de 016 conservados.
CMS: wrapper OpenNext, scheduled acotado, rechazo de 3xx, ETag weak/strong.
Blumik: adapter PostgreSQL, KV Next, D1 tags, noindex, fixture caída solo staging. Diseño y assets/JSX originales conservados.
Auth allowlist: /auth/confirm, /auth/callback, /reset-password del host CMS automático y callback localhost. Site URL por defecto localhost conservado; SMTP fuera de alcance. Refresh observado mediante continuidad tras varias horas, sin inspección de tokens.

## Tests
PASS: npm install ambos; CMS lint/typecheck/build/OpenNext; Blumik lint/tsc/build/OpenNext; 17 migraciones con seed/RLS/outbox/store; Content API; ETag; delivery/HMAC/timeout/backoff/Retry-After/redirects; scheduler; dos adapters PGlite; store remoto; verify-hyronix siete SSR/ocho fallos/SEO/FAQ; resilience/replay/rate; cache local/HTTPS; 22 probes remotos; publicación/restauración/redeploy; seguridad real media/RLS; scanners.
Los módulos test-outbox-db y test-staging-store-db se ejecutan mediante test:migrations.
Scanners actuales: 952 archivos CMS, 837 Blumik y 54 públicos. Evidencias completas: artifacts/etapa5d/*.json.
Pendiente original de navegador: resuelto en 5E; evidencia `artifacts/etapa5e/media-browser.json`.

## Correcciones y límites
1. OpenNext omitía preview-props.json en Next 16.4: parche reproducible condicionado a versiones.
2. OpenNext copiaba .env.local al server bundle: desactivado y scanner antes de deploy. Una versión privada antigua del Worker CMS sí lo incluyó server-side; sin evidencia de exposición cliente. El PASS actual no certifica ausencia histórica en versiones del proveedor. Revisar retención/rotación antes de producción.
3. workerd no admite redirect:error: manual y rechazo 3xx explícito. No sigue destinos.
4. ETags débiles CDN ya permiten 304.
5. CMS y snapshot comparten Supabase: caída de API con DB disponible conserva B; caída simultánea puede terminar en fallback original.
6. KV eventual y cuotas Free limitan tráfico sostenido; no se promete capacidad productiva. Cron: 1440 ticks/día, lote cinco. Logs de pruebas outcome ok.
7. npm audit: 9 high CMS/11 Blumik, tooling/transitivas. Audit propone downgrades OpenNext/eslint/shadcn; no se aplicó --force. Revisar antes de producción. No se pasan patrones no confiables al CLI glob.
8. OpenNext advierte Windows y middleware Node experimental; mantener regresión al actualizar.
9. Imagen totalmente nueva sin equivalente local no tiene copia local de bytes: snapshot conserva referencia. Independencia de media requiere estrategia adicional.

## Cierre de 5D y pendientes preproductivos
Media hidratada y rotación/historial resueltos en 5E. Las cifras audit de este informe son históricas: 5E redujo a 5/7 high de desarrollo y cero en los grafos npm productivos. Permanecen capacidad, configuración del entorno futuro y riesgos detallados en el reporte 5E. Sin deploy productivo ni merge main.
