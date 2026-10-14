# Rotación de secretos — ETAPA 5E

14 de octubre de 2026. Solo Supabase DEV y Workers staging.

## Resultado: PASS

La inspección de 10 versiones CMS y 27 Blumik identificó una clave administrativa moderna de Supabase incrustada en seis versiones privadas antiguas del CMS. No se encontró evidencia de exposición en bundles cliente. No se detectaron asignaciones literales de HMAC, runner, token del store ni tokens CLI en esos módulos.

Orden ejecutado:

1. Crear una nueva clave `sb_secret_…` y verificar lectura privilegiada.
2. Actualizar binding secreto del CMS y entorno local ignorado.
3. Verificar login público, Content API y Blumik antes de revocar.
4. Revocar la anterior; comprobar **HTTP 401**. La nueva continúa con HTTP 200.
5. Repetir Auth real, publicación/Cron/webhook/snapshot/RLS y pruebas HTTPS.
6. Crear una credencial distinta exclusivamente para desarrollo local. El binding de staging conserva su propia credencial.

Identificadores administrativos, no valores:

- Clave revocada: `0cce6185-eee3-4834-a287-2581ec95aac2`.
- Clave staging: `96d1c51d-0f71-4495-b1e5-284fbd248cb8`.
- ID local y evidencia de separación: `artifacts/etapa5e/environment-separation.json`.

Publishable, HMAC, runner y token limitado del store no se rotaron: no estuvieron implicados. No se extrajeron sus valores del proveedor. Las pruebas de «firma anterior» y «runner anterior» son N/A; la firma vigente se ejercitó mediante Cron real, y las peticiones sin firma/firma inválida fueron rechazadas.

## Historial Cloudflare

La API oficial Beta permite retirar versiones por ID. Se eliminaron las seis afectadas después de invalidar la clave, preservando versión activa y versiones limpias para rollback. IDs y comprobantes en `removed-versions.json`. No se afirma borrar backups internos del proveedor; la revocación neutraliza la credencial aunque existiera otra copia retenida.

[API oficial de eliminación](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/delete/).

## Alcance del escaneo

- `worker-history.json`: inventario histórico y detección, sin valores.
- `secret-scan.json`: comparación exacta de la clave antigua y la primera nueva, antes de retirar versiones; 2340 archivos, cero hallazgos locales.
- `final-secret-review.json`: comparación exacta de claves actuales local/staging; fuente, builds, OpenNext, archivos generados, logs/trazas CLI y módulos actuales del proveedor. También patrones de claves/JWT, asignaciones de secretos y logs emitidos en pruebas nuevas.
- Los bindings secretos y `.env.local` autorizados se excluyen deliberadamente de la prohibición de almacenamiento. No se guardaron valores en reportes.
- La comprobación HMAC/runner/store es de límites de código y asignaciones literales; no se declara una comparación exacta de valores que no fueron recuperados.
- El escaneo no es una auditoría exhaustiva de todos los logs históricos internos del proveedor.

La API usada admite creación/revocación de claves modernas: [crear](https://supabase.com/docs/reference/api/v1-create-project-api-key), [revocar](https://supabase.com/docs/reference/api/v1-delete-project-api-key). Nunca se volvió a `service_role` legacy.
