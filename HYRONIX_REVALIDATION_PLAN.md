# Caché y revalidación — implementación real ETAPA 5C

Fecha: 2026-10-11. Sustituye la propuesta de 5B; el reporte 5B permanece como evidencia histórica.

## Semántica verificada en Next.js16.4.0 instalado

Se leyeron las guías instaladas fetch.md, revalidateTag.md, revalidatePath.md, unstable_cache.md, connection.md, route-handlers y caching-without-cache-components, además del manejo de error de unstable-cache.js.

- fetch force-cache/next.revalidate guarda HTTP200 antes de nuestra validación de dominio. Por ello no se cachea la respuesta cruda: un200 corrupto o con drafts no debe entrar al Data Cache.
- Se usa unstable_cache alrededor de la operación de validación + SnapshotStore.set, con tags deterministas y TTL configurable60 s. La guía de Next16 recomienda use cache para aplicaciones con Cache Components; este proyecto no los habilita. Se mantiene la API soportada del modelo sin Cache Components para no migrar layout/Suspense ni reconstruir5B. Se documenta el aviso de reemplazo de API, no se oculta.
- El fetch interno de red conserva no-store solo en misses/renovaciones de la caché validada. La política de lectura del sitio ya no es no-store por request. No se combinan opciones contradictorias de fetch.
- React cache deduplica por render; AbortSignal tiene1200 ms. connection() mantiene SSR dinámico sin forzar force-dynamic, que deshabilitaría caché de fetch de toda la ruta. No se cachea HTML de fallback indefinidamente en el build.
- revalidateTag(tag,{expire:0}) es válido desde Route Handler. max aplica stale-while-revalidate y no garantiza lectura inmediatamente nueva; updateTag requiere Server Action y no se utiliza aquí.
- revalidatePath marca la ruta concreta para la próxima visita. Los clientes ya abiertos pueden necesitar recarga/navegación; el webhook no empuja actualizaciones a pestañas abiertas.

## Flujo implementado

Publicación y triggers versionados → INSERT/UPSERT en outbox dentro de la misma transacción → runner explícito privilegiado → HMAC → replay/rate limit durable local → precarga de snapshots validados → invalidación específica → confirmación → entrega marcada delivered.

La outbox agrupa cambios por transacción/site/event_type y une slugs. Se genera desde el trigger existente de content_version, incluyendo cambios públicos directos autorizados. No requiere una operación después del commit que pudiera perder el evento. Un fallo en outbox hace rollback de publicación. Guardar solo draft no crea evento.

La migración202610110016_publication_outbox.sql se probó en PostgreSQL local, dry-run mostró únicamente esa migración y se aplicó en Supabase DEV gtvwovlcotccpfgmhcas. Un dry-run posterior quedó vacío. Usuarios normales/anon no pueden leer/modificar outbox ni reclamar/confirmar; RPCs solo para service_role, search_path fijo. La clave moderna SUPABASE_SECRET_KEY se usa exclusivamente en CLI CMS privilegiado, nunca en Blumik ni acciones normales.

## Ejecución local

Blumik: .env.local contiene URL pública API, site key público, TTL60, HYRONIX_STORE_DRIVER=local y HYRONIX_LOCAL_STORE_PATH=.hyronix/state.sqlite. El webhook permanece cerrado si no se proporciona secreto dedicado. Tests crean secreto efímero en memoria.

CMS runner: node --env-file=.env.local scripts/deliver-outbox.mjs, con HYRONIX_WEBHOOK_URL, HYRONIX_WEBHOOK_SITE_KEY y HYRONIX_WEBHOOK_SECRET proporcionados de forma segura en entorno. No copiar claves al chat ni archivos versionados. El runner procesa una tanda y termina. La prueba controlada completa es scripts/verify-5c-live.mjs; está acotada al DEV actual y restaura contenido en finally. Su SQL usa el propietario existente para pasar las comprobaciones de publicación, sin generar usuarios o sesiones nuevas.

No hay cron/worker productivo, proveedor durable serverless o dominio creado. Antes de producción: conectar SnapshotStore/WebhookReplayStore compartidos, generar secreto dedicado por ambiente, programar runner, observar cola/failed, definir disponibilidad de bytes multimedia y volver a certificar bajo concurrencia real del proveedor. Sin esa configuración no declarar listo un deploy serverless.

Ver LAST_KNOWN_GOOD_DESIGN.md, WEBHOOK_SECURITY.md y ETAPA5C_CACHE_REVALIDATION_REPORT.md.
