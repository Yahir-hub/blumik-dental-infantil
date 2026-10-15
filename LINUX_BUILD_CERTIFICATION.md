# Certificación Linux — ETAPA 5F

15 de octubre de 2026. **HYRONIX PASS / BLUMIK PASS**.

## Entorno reproducible

- WSL2 Ubuntu 26.04, kernel 6.6.87.2, entorno local existente, sin CI ni recursos nuevos de pago.
- Node **22.19.0**, npm **10.9.3**. Distribución oficial verificada contra SHASUMS256.
- Next **16.4.0**, OpenNext Cloudflare **1.20.10**, OpenNext AWS **4.1.9**, Wrangler **4.149.0**.
- `npm ci` con lockfiles existentes, sin upgrades durante la certificación.
- SHA256 lock CMS: `27c9b90f43311d33d2397068d85d00eafb34fa4baeb28acae2a069c653da1e7a`.
- SHA256 lock Blumik: `9008f4b7ceaad1a1f6022a339a4a71821ccfafd672d941ce63cbc470ca67875c`.
- Base Git Blumik: `d0a3fb92f584e3b6cf7a2fe5492ceb8c4d13d398`, rama `hyronix-cms-integration`, más cambios 5F documentados. `main` permanece `0073c7027a7959815fc33703198b6273963f7725`.

## Ejecución

Scripts de soporte: `prepare-linux-5f.sh`, `prepare-source-5f.mjs`, `build-linux-5f.sh`, `resume-linux-5f.sh`, `final-linux-5f.sh`, `export-linux-5f.sh`. Copia positiva del código, sin `.env.local`, perfiles del proveedor ni claves. El CMS necesita URL/publishable key públicas al compilar el navegador; la secret key llega únicamente como binding runtime.

| Comando / prueba Linux | CMS | Blumik |
|---|---|---|
| npm ci | PASS | PASS |
| npm run lint | PASS | PASS, 0 warnings/errores |
| npx tsc --noEmit | PASS | PASS |
| patch-opennext dos veces | PASS | PASS |
| Next build | PASS, incluye Proxy/Auth | PASS, 7 rutas SSR |
| npm run build:staging / OpenNext | PASS | PASS |
| test:migrations (18 migraciones, RLS/outbox) | PASS | N/A |
| delivery / scheduler / ETag / media-edge | PASS | N/A |
| resilience / verify-hyronix / cache-integration | N/A | PASS |
| guard real rechaza build production con harness | PASS | guard compartido + plantilla separada |
| scan .next + .open-next | PASS, 2.886 archivos | PASS, 3.085 archivos |

Los escáneres exactos de las claves DEV/staging se ejecutaron además desde Windows sobre las copias de artefactos Linux y los módulos efectivamente publicados: `final-secret-review.json` y `secret-boundary.json`. Cero hallazgos. No se copió una clave privada al entorno de build Linux.

Artefactos exportados:

| Proyecto | SHA256 del tar de .open-next |
|---|---|
| CMS | `72daf754dd89abac140c07bf0169042ffef49aea58c18e95de53d4d874876896` |
| Blumik | `04f4595ada3f63762753cc26f6151fc5c7ecec8b42b93a8dce1307c3f4db0895` |

Deploy inicial Linux staging: CMS `2e52de96-ddc9-4ea0-b7d7-c6df9d0f389d`, Blumik `602e0efd-7963-4d48-ba91-251160c399b6`. Cambios de bindings para fault/rollback crean versiones posteriores del mismo código. Ningún deploy productivo.

## Incidencias corregidas

1. La primera copia omitió `data`, tipos, `.gitignore`, proxy y configuración pública. Se corrigió la lista y se reconstruyó; **esa primera copia no se certifica**.
2. El linter Go de Blumik agotó RAM en WSL. Con `.gitignore` correcto y `GOMEMLIMIT=2GiB`, `GOMAXPROCS=2` pasó. Hubo reinicios transitorios del servicio WSL; se reanudaron los pasos interrumpidos, sin contarlos como PASS.
3. Subir el artefacto Linux desde Wrangler Windows falló al resolver imports WASM absolutos. No cambió el Worker. Se desplegó desde el mismo Linux donde se construyó, reutilizando OAuth en memoria; **build y deploy deben ejecutarse en ese entorno**.
4. OpenNext sigue advirtiendo sobre cola `direct`. Estas rutas son SSR con Data Cache; no se habilitó ISR de páginas ni un proceso persistente. No se eliminó el guard de versiones del parche.

Evidencia funcional Linux: `artifacts/etapa5f/linux-{cache,resilience,ssr}-results.json`. npm audit actual: CMS 5 high / Blumik 7 high en tooling; ambos grafos `--omit=dev` tienen 0 vulnerabilidades. Lockfiles conservados y sin `audit fix --force`.
