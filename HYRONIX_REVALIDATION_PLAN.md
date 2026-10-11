# Revalidación futura Hyronix → Blumik

Fecha: 2026-10-11. Propuesta, no desplegada. No se crearon secretos, webhook, dominio ni recursos externos.

## Estado implementado

fetch server-only usa no-store y timeout de 1200 ms. React cache deduplica dentro del render (una página + una lectura global), no persiste entre usuarios o requests. La API de Hyronix mantiene su propia semántica de versión/ETag. Una nueva petición SSR consulta el estado publicado; el Router Cache de una pestaña puede requerir recarga para reflejarlo. No existe caché eterna ni purge Cloudflare.

## Diseño propuesto

1. Confirmar la transacción de publicación antes de registrar/enviar un evento. Usar outbox durable ligado a la transacción, con event_id, site_key, content_version, published_at y slugs afectados. Nunca incluir drafts, credenciales ni datos personales.
2. Endpoint POST server-side específico de Blumik. Firmar HMAC-SHA256 sobre timestamp + punto + bytes originales del cuerpo. Compartir una clave de webhook dedicada mediante secretos del proveedor, nunca NEXT_PUBLIC ni credenciales Supabase. Validar tamaño, content-type, esquema y firma en tiempo constante antes de procesar. Rotación con dos identificadores de clave durante ventana limitada.
3. Rechazar timestamp fuera de ±5 minutos. Guardar event_id/nonce consumido durante al menos la ventana de reintentos; operación atómica en almacén durable, no una variable en memoria. Duplicados devuelven confirmación idempotente; versiones anteriores no sobreescriben nuevas.
4. Mantener allowlist server-side de site_key y las 7 rutas. Derivar rutas/tags desde ese mapa: jamás aceptar URL de fetch o path arbitrario del emisor. Cambios de página invalidan su ruta/tag; settings compartidos invalidan las 7 páginas; media usa versión estable nueva cuando cambia el archivo.
5. Antes de activar el webhook, introducir una política explícita de caché Next con TTL corto (por ejemplo 30–60 s), tags por sitio/página y snapshot durable validado. Hoy no-store no deja una entrada de datos que revalidateTag pueda invalidar. Verificar las guías de la versión instalada en esa etapa.
6. Con caché configurada, usar revalidateTag(tag, 'max') para stale-while-revalidate y revalidatePath(ruta) cuando proceda. Si se exige visibilidad inmediata, acordar semántica de expiración inmediata/precalentamiento y comprobarla por HTTP: marcar stale por sí solo no garantiza que la próxima respuesta incluya ya la nueva versión.
7. Actualizar el snapshot de último contenido válido solo después de validación completa. Conservar el anterior si falla API, firma, render o precalentamiento. Mantener assets y copia local original como último respaldo. Un webhook fallido no debe tirar el sitio ni revertir el estado publicado del CMS.
8. Rate limit por emisor/sitio (propuesta: 30 eventos/minuto, ráfaga 10), límite global y máximo de rutas por evento. Una denegación 429 devuelve Retry-After. No confiar exclusivamente en IP como autenticación.
9. Entrega con timeout, reintentos exponenciales con jitter y cola de fallidos. Logs: event_id, site_key público, versión, resultado, rutas y latencia; nunca firma completa, clave o JWT. Métrica de tiempo hasta visibilidad y alarma sobre cola acumulada.

## Gate antes de implementar

Probar firma inválida, replay, expiración, duplicados concurrentes, evento fuera de orden, sitio/ruta ajenos, cuerpo excesivo, 429, API caída, entrega repetida y recuperación. Verificar que el usuario público nunca ve borradores. Preview externo futuro protegido/noindex; el dominio Hyronix se decide al final, sin bloquear el diseño local.
