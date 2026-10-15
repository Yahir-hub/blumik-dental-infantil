# Resiliencia de contenido e imágenes — decisión 5E

## Decisión vigente 5F — opción C implementada

15-10-2026: edge cache larga + URLs versionadas, sin replicación de bytes. Solo GET de media publicada con versión positiva explícita y respuesta 200 image/*, sin Set-Cookie, entra en Cache API. Cache-Control: `public, max-age=31536000, s-maxage=31536000, immutable`. Respuestas no exitosas siguen no-store. Cache API es local al punto de presencia y puede expulsar objetos.

La migración 018 asegura que reemplazar storage_path incremente asset_version e impide fijar arbitrariamente otra versión. Las policies existentes no permiten sobrescribir bytes de un path a usuarios normales. La prueba real A→B compara hashes: contenido referencia v2; v1 conserva A en el edge; v999 devuelve 404 no-store. Fixture eliminado. Evidencia `artifacts/etapa5f/media-live.json`.

**ACCEPTED_RISK inicial Blumik:** una imagen nueva nunca cacheada o expulsada puede no conservar sus bytes en una caída total del origen. Además, una imagen antes pública puede seguir en caché tras retirarla; immutable no es revocación inmediata. No usar esta capa para material confidencial. La recomendación 5E que sigue queda como contexto histórico, ya ejecutada en 5F.

## Media visual existente: PASS

Chrome real mediante Playwright, tras hidratación: imagen remota válida → fixture remota HTTP 503 → `onError` → `/assets/IMG_8415.webp` visible. Contenedor conservado, CLS observado 0,00169, conteo de errores estable, sin errores React no controlados. Capturas inspeccionadas: `artifacts/etapa5e/media-before.png` y `media-after.png`. Resultado estructurado: `media-browser.json`.

La prueba usa el fixture fijo de staging; no corta Storage real ni modifica imágenes de producción.

## Caída conjunta: ACCEPTED_RISK para el sitio informativo inicial

Content API caída + PostgreSQL disponible: último snapshot válido, incluido contenido B publicado después del original A. API y PostgreSQL/Supabase caídos simultáneamente: caché aún utilizable cuando exista; agotada ésta, **contenido original local**, que puede ser antiguo. No se garantiza LKG independiente de Supabase.

El fallback original conserva un sitio informativo utilizable. Añadir otra base durable implicaría sincronización, observabilidad, mantenimiento y posible costo. No hay datos para atribuir una frecuencia de caída concreta. Se acepta técnicamente esta dependencia para el primer alcance informativo; deberá revisarse si aparecen avisos críticos o datos que no puedan retroceder. No se añadió otro datastore.

## Imagen nueva solo en Hyronix

Un snapshot guarda referencia/versionado, no los bytes. Para una imagen nueva sin equivalente local, caída del proxy/origen puede mostrar el fallback genérico/original disponible, pero **no garantiza conservar esa misma imagen nueva**.

| Opción | Ventaja | Límite |
|---|---|---|
| A: aceptar riesgo | Sin infraestructura adicional | No preserva imagen nueva durante caída |
| B: replicar bytes publicados | Independencia real del origen | Sincronización, borrado, costo y mantenimiento |
| C: caché edge larga y versionada | Aprovecha URL versionada; reduce consultas y caídas visibles | Un cache miss/expulsión sigue dependiendo del origen |

**Recomendación: C**, con TTL/headers, invalidación por versión y presupuesto de egreso verificados en una etapa posterior. Para un requisito estricto de disponibilidad de cada imagen nueva, elegir B. Esta recomendación es diseño: no se implementó replicación ni una nueva política edge en 5E. A se acepta temporalmente en staging; su aceptación productiva debe constar antes de publicar imágenes sin fallback equivalente.
