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
