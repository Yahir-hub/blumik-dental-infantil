# Runbook de preparación e incidentes

## Actualización 5F — 15 de octubre de 2026

Build/deploy Linux, headers CMS, media versionada y plantillas productivas ya implementados/certificados. Ver `FINAL_PREPRODUCTION_REPORT.md`. **Producción sigue NO por CPU de Workers Free**; no se contrató nada. Las secciones 5E inferiores son históricas cuando indican que estas correcciones aún faltan.

TTL safety 7.200 s; frescura primaria por eventos. Comprobar lag outbox <3 min; no reducir TTL a 60 s para solucionar un webhook roto. Nunca borrar snapshots para forzar refresh. Antes de un cambio registrar valores y versión; restaurar mediante publicación, conservando audit/outbox.

El scheduler admite configuración production independiente validada, probada solo con transporte mock; staging mantiene allowlist fija. Las plantillas `wrangler.production.jsonc` tienen placeholders y deben fallar hasta configurarse. No son una autorización ni un deployment. El proyecto/secretos/KV/D1/namespace productivos serán nuevos.

**Construir y desplegar en el mismo Linux**: los artefactos OpenNext pueden contener imports WASM absolutos. No transportar a Wrangler Windows para desplegar. El script `deploy-linux-5f.mjs` está limitado a los dos Workers staging y reutiliza la sesión OAuth en memoria; no usarlo para producción. El build CMS requiere sus variables públicas del navegador; los secretos permanecen en bindings runtime.

Operación diaria/semanal y umbrales exactos en `PRODUCTION_CAPACITY_BUDGET.md`. Si se necesita retirar urgentemente una imagen pública, recordar que immutable puede conservar versiones antiguas en cachés; no asumir que soft-delete revoca todas las copias.

14 de octubre de 2026. **Plantilla operativa; producción no creada ni autorizada.**

## Estado y prerrequisitos

Staging usa dos Workers automáticos, Supabase DEV, KV regenerable y D1 para tags. Cron está fijado explícitamente al proyecto, sitio y destino staging: **no sirve como runner productivo cambiando solo el nombre del Worker**. La futura implementación deberá tener allowlist productiva explícita y pruebas propias.

Antes del primer deploy: resolver capacidad Free, crear entornos/credenciales/namespace independientes, decidir media nueva, revisar headers del CMS, configurar Auth/SMTP/dominio solo con autorización futura. `.env.production.example` de cada proyecto contiene únicamente placeholders. Nunca reutilizar IDs KV/D1, token de store, HMAC ni clave administrativa de staging.

## Build y deploy reproducibles

1. Usar checkout Linux/CI con Node 22 y lockfiles revisados; `npm ci` en ambos proyectos. No crear CI pago automáticamente.
2. Ejecutar lint, typecheck/tsc, tests migraciones, delivery, resilience/cache/webhook, guard de entorno y boundary de secretos.
3. Ejecutar `node scripts/patch-opennext.mjs`: requiere exactamente Next 16.4.0/OpenNext Cloudflare 1.20.10; parche idempotente de `preview-props.json` y eliminación de empaquetado de variables. Al cambiar versiones, detener y revisar; nunca suprimir el guard para pasar un build.
4. Construir con entorno explícito. `npm run build:staging` es exclusivamente staging. Para producción habrá que crear y revisar configuración separada; no ejecutar el deploy staging como si fuera productivo.
5. Sanitizar `.open-next`; escanear código/assets/maps/env copiados antes de subir. Secretos exclusivamente bindings runtime.
6. Registrar versión limpia anterior, publicar solo destino aprobado, repetir Auth/cookies/SSR/rutas protegidas/noindex según entorno, API, media y publicación reversible. El middleware Node del adaptador sigue experimental.

En staging, desde cada raíz: `npm run build:staging`, después `npx wrangler deploy --config wrangler.jsonc`. Los nombres de esos archivos apuntan a staging. No añadir `--env production` suponiendo que exista.

## Rollback de contenido Blumik — ensayado

Desde la raíz Blumik, en consola segura:

```text
npx wrangler secret put HYRONIX_ENABLED --name blumik-hyronix-staging
```

Introducir `false` en el prompt (es un flag, no contraseña). Esperar propagación por ruta y verificar HTTP 200, textos/assets originales y SEO en `/`, `/servicios`, `/pacientes-neurodivergentes`, `/preguntas-frecuentes`, `/profesionales`, `/contacto`, `/aviso-de-privacidad`.

Restaurar ejecutando el mismo comando e introduciendo `true`. El test automático usa eliminación del override para volver al valor predeterminado habilitado. No borra snapshots ni contenido. `scripts/test-5e-rollback.mjs` probó las siete rutas y restauró la integración; debe esperar propagación, no asumir un cambio instantáneo.

Para rollback de código: listar versiones del Worker y usar `npx wrangler rollback <VERSION_LIMPIA_VERIFICADA> --name blumik-hyronix-staging`. Confirmar destino/versión antes de ejecutar. No restaurar versiones CMS retiradas ni bundles con secretos. Los cambios de binding/código no revierten migraciones; una migración futura requiere su propio plan compatible. No ejecutar rollback contra producción en esta etapa.

## Operación de incidentes

| Incidente | Acción |
|---|---|
| Outbox failed | Inspeccionar event_id, estado, intentos y resultado sanitizado. Corregir causa; reencolar el evento concreto mediante operación privilegiada revisada, preservando ID/auditoría. No borrar filas ni resetear toda la cola. |
| Webhook 401 | Verificar destino, timestamp, HMAC dedicado y bindings de ambos extremos. No loguear firma ni cuerpo sensible. |
| Webhook 429/5xx | Respetar Retry-After/backoff/jitter; revisar cuotas/store. Cron reintenta eventos elegibles; dead-letter conserva evidencia. |
| Cron no entrega | Verificar trigger cada minuto, logs scheduled, allowlist y permisos RPC. No reemplazar por setInterval ni por un endpoint público sin protección. |
| Snapshot inconsistente | Revisar site/resource/contentVersion y CAS. Nunca sobrescribir versión nueva con antigua ni borrar el último snapshot al recibir JSON inválido. |
| Content API caída | Mantener snapshot; comprobar SSR con LKG. Restaurar API y verificar refresh/versionado. |
| Supabase completo caído | Esperar caché/local original; usar flag de rollback si es necesario. No prometer LKG independiente. |
| Media caída | Verificar HTTP del origen/URL versionada; imagen existente puede usar asset local. Imagen nueva requiere decisión documentada en MEDIA_RESILIENCE_DECISION. |
| KV/D1 agotado | Revisar cuotas y patrones de renovación; contener tráfico/pruebas, activar fallback local si hace falta. No comprar recursos sin autorización. |

## Rotación

Crear credencial nueva → verificar permisos mínimos → actualizar binding mediante prompt seguro/entrada estándar → probar → revocar anterior → comprobar rechazo → escanear y registrar IDs sin valores. HMAC usa credencial independiente de Supabase; si se rota, coordinar emisor/receptor con pausa controlada de entrega y preservar eventos para reintentar. No incluir secretos en argumentos, screenshots, Git ni reportes.

## Evidencia y mantenimiento

Conservar auditoría, revisiones, outbox y reportes sanitizados. Al actualizar Next/OpenNext repetir Auth real (incluido refresh de token si se pretende certificarlo), streaming redirects, cookies, SSR, noindex, caché/replay y caída con B. Las pruebas 5E observaron recarga/sesión persistente; no esperaron la expiración del token.
