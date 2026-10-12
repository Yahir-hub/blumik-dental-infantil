# Last-known-good — implementación 5C

Fecha: 2026-10-11, America/Mexico_City. Alcance: local/DEV; proveedor serverless durable pendiente.

## Flujo real

React cache deduplica dentro del render. unstable_cache de Next guarda solo el resultado público validado durante 60 s (HYRONIX_CONTENT_REVALIDATE_SECONDS, rango admitido 1–300; tests usan 2). En un miss/renovación, loader hace una consulta de red con timeout 1200 ms y If-None-Match cuando existe ETag. HTTP 200 debe pasar validación; 304 reutiliza el snapshot. Solo entonces se actualiza SnapshotStore mediante compare-and-set atómico.

Orden: caché Next válida → API en renovación → snapshot Hyronix → JSX/site-config/assets originales. Si Next tiene una entrada vieja frente al snapshot más reciente, gana el snapshot. Una excepción durante renovación no guarda JSON corrupto ni fallback original en Data Cache. Next puede servir stale mientras renueva por TTL. Una invalidación explícita usa expire:0.

No hay fetch de contenido SEO en el navegador. Página, metadata y FAQ usan la misma lectura memoizada. Settings tienen recurso independiente compartido por layout y JSON-LD. El respaldo local original permanece intacto.

## Snapshot

schemaVersion=1, siteKey público, resource (slug conocido/settings), contentVersion, updatedAt de Hyronix, validatedAt local, ETag y data (page con sections/SEO/media, o site_settings permitidos). No se guarda respuesta administrativa completa. Se rechazan claves de borrador, rutas Storage, credenciales, objetos media inválidos, sitio/ruta incorrectos, versiones no enteras, JSON grande o estructura inválida. Límite de respuesta: 1 MB.

SnapshotStore.get(site,resource) y set(snapshot) son el contrato. set debe ser atómico y devolver el ganador: una versión menor o igual no reemplaza la existente. La versión es por sitio, pero el compare-and-set es por recurso; una actualización de una página no debe impedir renovar otra. Igual versión con contenido diferente conserva el snapshot existente. No se usan valores de un evento webhook como contenido.

## Durabilidad local y producción

LocalStore usa SQLite de node:sqlite con WAL, busy_timeout y BEGIN IMMEDIATE. Sobre un único host con disco persistente conserva snapshots tras reinicios y serializa escrituras entre procesos. Se configura explícitamente HYRONIX_STORE_DRIVER=local y HYRONIX_LOCAL_STORE_PATH=.hyronix/state.sqlite. El directorio está ignorado por Git y fuera de public/.

**Esto no es un almacén durable para Vercel/Lambda.** La implementación local rechaza esos entornos detectados. Sin driver configurado, el consumidor conserva el fallback original y el webhook falla cerrado. Antes de producción es obligatorio conectar un proveedor durable mediante stores.ts; no hay un proveedor contratado ni desplegado. Node 22 marca su API SQLite como experimental: se usa solo para local/test.

El proveedor futuro debe garantizar CAS/serialización transaccional entre instancias, lecturas consistentes, disponibilidad, cifrado/acceso server-side, backup y separación por ambiente/sitio. Debe implementar también el contrato atómico de replay/rate limit. No basta con guardar JSON en /tmp ni con un Set en memoria. El cliente y componentes no cambian al sustituir los adapters.

## Prewarm y recuperación

El webhook precarga snapshots validados de los recursos afectados antes de invalidar tags/rutas. Usa exclusivamente el origen configurado y slugs de la allowlist; no hace llamadas a URLs aportadas por el evento. Puede deshabilitarse con HYRONIX_PREWARM=false. Un fallo de prewarm conserva el snapshot anterior y no convierte una invalidación correcta en fallo permanente; la siguiente lectura/TTL vuelve a intentar la API.

Este prewarm asegura respaldo fresco; no promete precalentar todo el HTML ni eliminar la consulta condicional del primer miss de Data Cache después de invalidar. Las lecturas calientes posteriores sí evitan consultas de API. Programación externa de reintentos/precarga futura queda fuera del runner manual actual.

## Evidencia

scripts/test-resilience.mjs: A40→B42, errores/corrupción/versión41 conservan B42; concurrencia44/43 conserva44; cierre/apertura SQLite conserva44. scripts/test-cache-integration.mjs: Next real conserva B42 con API apagada, invalidación y reinicio; incluye metadata y settings, ETag304 y fallback original con snapshot vacío. verify-5c-live.mjs confirma además publicación real en Supabase DEV, entrega desde outbox y SSR B durante 503; restaura todos los valores originales.

Los bytes de imágenes siguen en el proxy público versionado existente, no se duplican en SQLite. Snapshot conserva identificadores/referencias publicadas; si los bytes del proxy fallan, se usa el asset original de 5B. La resiliencia de contenido/SEO no equivale a replicación durable de archivos multimedia nuevos; definir esa disponibilidad antes de producción.
