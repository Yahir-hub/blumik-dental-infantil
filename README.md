# Blümik Dental Infantil

Sitio de Blümik preparado con Next.js para su publicación en Vercel.

## Abrir

Desde esta carpeta:

```powershell
npm.cmd run dev -- --hostname 0.0.0.0 --port 3000
```

Abrir `http://localhost:3000` en el equipo. Desde otro dispositivo conectado a la misma red, usar la dirección IPv4 del equipo y el puerto 3000.

## Verificar

```powershell
npm.cmd run build
npx.cmd tsc --noEmit
```

## Publicación en Vercel

- Framework Preset: Next.js.
- Root Directory: la carpeta `blumik-web`.
- Build Command: `npm run build`.
- Dominio canónico: `https://blumikdentalinfantil.com`.
- No configurar un Output Directory manual; Vercel utiliza `.next`.

`REFERENCIAS-Y-FALTANTES.md` contiene el cotejo de cada captura, la correspondencia de fotos y videos, los faltantes y las funciones pendientes de conectar.

La página se mantiene local. La publicación externa requiere autorización del propietario; no hay una publicación confirmada.

## Sandbox Hyronix CMS — ETAPA 5B

Rama hyronix-cms-integration. Node >=22.13. Instalar con npm install, crear .env.local ignorado a partir de .env.example y configurar HYRONIX_CONTENT_API_URL con la Content API local (http://localhost:3000/api/content/v1), HYRONIX_SITE_KEY con el identificador público del sitio. Blumik no necesita claves ni sesión de Supabase.

Iniciar primero Hyronix en 3000. En este checkout: npm run build y npm run start -- --port 3001. Para desarrollo: npm run dev -- --port 3001. Si el equipo usa certificados de sistema para TLS, iniciar Node con NODE_USE_SYSTEM_CA=1; no desactivar validación TLS.

Contenido y metadata se leen server-side, con una petición de página y otra de settings por render, deduplicadas. Timeout 1200 ms; no-store en sandbox. Se conserva contenido/assets originales como fallback. El fallback no se actualiza automáticamente tras una publicación.

Verificar: npm run lint, npx tsc --noEmit, npm run build; luego node --env-file=.env.local scripts/verify-hyronix.mjs con CMS activo. El harness usa puertos temporales 3002/3102, copias locales de respuestas y guarda evidencia en .qa (ignorado), sin editar Supabase. Mantener puertos libres antes de ejecutarlo.

Reportes: HYRONIX_SOURCE_ANALYSIS.md, BLUMIK_SOURCE_MAPPING_REPORT.md, HYRONIX_REVALIDATION_PLAN.md y ETAPA5B_BLUMIK_REPORT.md. Producción, main y dominios no forman parte de esta entrega.
