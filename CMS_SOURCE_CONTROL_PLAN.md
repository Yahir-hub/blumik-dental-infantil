# Control de versiones CMS — plan de cierre

15 de octubre de 2026. La raíz CMS todavía **no es un repositorio Git**. Blumik sí lo es, rama `hyronix-cms-integration`. No se creó un remoto ni se hizo push/merge a main.

## Preservación actual

Se conserva el respaldo privado de 5E y las copias positivas 5F en `.live-private/etapa5f-source`, con manifiestos de package/lock y artefactos Linux identificados por SHA256. No sustituye un remoto ni un backup fuera del equipo.

## Repositorio privado recomendado antes de producción

Crear `hyronix-cms` privado en la cuenta del propietario al autorizar etapa 6. Inicializar desde una copia revisada; primer commit con código estable, 18 migraciones, scripts de build/parche/tests, configs con placeholders, `.env.example`, `.env.production.example`, SETUP y reportes sanitizados. Revisar el diff completo y ejecutar secret scan antes del primer push. Rama de trabajo separada y protección de main con lint/typecheck/tests/build Linux.

Ignorar siempre `.env*` salvo ejemplos sin valores, `.dev.vars*`, `.live-private/`, `.next/`, `.open-next/`, `.wrangler/`, `node_modules/`, `supabase/.temp/`, perfiles CLI, logs locales, dumps, caches SQLite, sesiones/cookies y archivos de restauración. No versionar artefactos compilados ni credenciales históricas. La `.gitignore` local ya cubre las carpetas generadas y los ejemplos permitidos; antes de iniciar Git revisar también perfiles específicos del proveedor.

No importar masivamente todo el directorio actual: contiene copias privadas y material de pruebas excluido. Usar una lista positiva de archivos, revisar `git status`/diff y scanner, luego hacer el primer commit. Mantener evidencia JSON sanitizada de certificación, sin HTML/capturas con datos privados.

CI gratuita o Linux local: Node 22 + npm ci + guard de versiones + lint/types/migraciones/delivery/build + secret boundary. Ningún token productivo durante build: solo configuración pública. Bindings secretos al desplegar por el canal seguro del proveedor.

El estado sin Git remoto del CMS está documentado como tarea de operación de etapa 6; no se afirma que el código ya tenga respaldo remoto privado.
