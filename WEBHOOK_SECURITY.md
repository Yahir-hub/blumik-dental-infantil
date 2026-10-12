# Webhook Hyronix → Blumik — 5C

Fecha: 2026-10-11. POST /api/hyronix/revalidate, runtime Node, server-side. GET no está implementado.

## Autenticación y formato

HYRONIX_WEBHOOK_SECRET es dedicado y de al menos 32 caracteres. .env.example contiene únicamente placeholder vacío. Se usaron claves aleatorias efímeras en memoria durante tests; no se generó secreto productivo ni se guardó en Git. Nunca usar la clave Supabase, site key o JWT. El endpoint sin secreto/almacén válido devuelve 503 y no invalida nada.

Headers: x-hyronix-timestamp (Unix segundos), x-hyronix-event-id (UUID), x-hyronix-signature (sha256=hex). Firma HMAC-SHA256(timestamp + '.' + cuerpo original UTF-8), comparada con timingSafeEqual tras validar longitud/formato. Se rechaza UTF-8 malformado. Timestamp debe estar dentro de ±300 segundos.

Cuerpo JSON exacto: event_id, site_key, content_version, published_at, affected_slugs, event_type. Solo referencias, sin contenido ni campos extra. application/json obligatorio, máximo 8192 bytes incluso sin Content-Length, lectura limitada en tiempo a 5 s. No se acepta URL, hostname o path libre. event_id del header debe coincidir con el cuerpo firmado.

## Scope

Allowlist: home, servicios, pacientes-neurodivergentes, preguntas-frecuentes, profesionales, contacto, aviso-de-privacidad. Site key debe coincidir con la configuración del consumidor.

content.published invalida solo slugs del evento. settings.updated invalida settings y las 7 rutas. media.updated invalida las 7 páginas para renovar referencias; asset_version existente evita reutilizar la URL antigua. post.published usa tag posts y únicamente rutas conocidas explícitas; Blumik actualmente no tiene ruta de posts y no se creó una.

Tags: hyronix:site:<key>, hyronix:page:<key>:<slug>, hyronix:settings:<key>, hyronix:posts:<key>. La invalidación usa tags específicas, no el tag global indiscriminadamente. revalidatePath recibe rutas locales derivadas, no input directo; no se invalida el layout raíz para cada cambio.

## Replay, idempotencia y concurrencia

WebhookReplayStore.begin/complete/release exige operaciones atómicas. LocalStore persiste digest del cuerpo por event_id, lease y estado en SQLite. Duplicado terminado devuelve 200 sin procesar; mismo ID con cuerpo distinto devuelve409. Evento en curso devuelve409 + Retry-After. La lease local dura30 s, permitiendo recuperación tras fallo; un token distinto no puede finalizarla. Fallo de invalidación libera la lease y responde503.

Versiones máximas por recurso se conservan sin TTL; eventos completamente obsoletos no invalidan ni precalientan. Un evento viejo para otra página sí se procesa si esa página no lo recibió. Snapshot CAS añade una segunda protección contra respuestas antiguas. No se promete entrega exactly-once: hay efectos idempotentes con entrega al menos una vez y recuperación tras crash. Si el proceso cae entre invalidar y confirmar, una repetición puede invalidar otra vez sin revertir datos.

IDs consumidos se conservan7 días; versiones no expiran. La firma expira a los5 minutos. Para despliegue múltiple se requiere proveedor compartido con la misma semántica; el adapter local no se habilita en Vercel/Lambda.

## Rate limit y entrega

Token bucket durable por site/emisor autenticado: capacidad10, recarga0.5/s (30/min sostenidos), no basado solo en IP. Duplicados terminados no gastan tokens. 429 incluye Retry-After. El burst es adicional a la tasa sostenida, no una ventana rígida de30 solicitudes.

Hyronix usa runner explícito scripts/deliver-outbox.mjs, no setInterval dentro de Next. Reclama como máximo10 eventos con FOR UPDATE SKIP LOCKED y lease de120 s, envía secuencialmente y confirma con lease_token. Timeout5 s; backoff exponencial desde5 s, jitter50–100%, tope1 h, máximo8 intentos. Respeta Retry-After numérico hasta24 h. 408/409/425/429/5xx se reintentan; rechazos4xx restantes van a failed. Eventos failed se conservan para inspección/reintento autorizado; no se borran.

Destino se configura en entorno, HTTPS o localhost, path fijo /api/hyronix/revalidate, sin credenciales/query/hash; redirect:error evita reenviar firmas. Outbox no decide el host. Un scheduler durable futuro debe invocar el runner; hoy no existe ejecución automática desplegada.

## Logs y pruebas

Logs de entrega/invalidación: event_id, site_key público, content_version, event_type, resultado, rutas cuando corresponden, latencia y attempt_count. No firma, secreto, cookies, JWT ni body. No se imprimen errores Supabase crudos desde runner.

Suite: firma válida/inválida/ausente, expirado/futuro, duplicado, concurrente, reinicio, ID/cuerpo conflictivo, body excesivo, content-type, esquema, sitio/slug ajenos, eventos fuera de orden por recurso, fallo con liberación de lease,429/Retry-After. La outbox se valida con RLS, permisos RPC, rollback transaccional, claims sin duplicar, retry y dead-letter.
