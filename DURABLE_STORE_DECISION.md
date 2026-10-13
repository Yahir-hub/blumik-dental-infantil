# Decisión durable 5D
13 de octubre de 2026. Implementado y probado en Supabase DEV gtvwovlcotccpfgmhcas.

PostgreSQL 17.11 conserva snapshots, replay, versiones y bucket. Migración 017: tablas privadas/RLS, RPC con capacidad por namespace/sitio; solo SHA-256 persistido. Blumik recibe publishable key + capacidad, nunca SUPABASE_SECRET_KEY.
CAS solo permite versión mayor. Bloqueo por consumidor serializa leases, high-water marks y bucket burst 10 / 0,5 por segundo. Reloj PostgreSQL; lease 30 s, IDs 7 días, snapshots/versiones sin caducidad. complete utiliza recursos/versión reservados.

| Alternativa | Decisión |
|---|---|
| Supabase existente | Elegido: transacciones/CAS sin nueva cuenta/plan |
| Workers KV | Solo cache Next regenerable; eventual, no apto replay/rate/locks |
| D1 | Tags Next, sin duplicar snapshots |
| Durable Objects / Redis | No necesarios |
| Filesystem / SQLite | Solo local/tests; deshabilitado en bundle staging |

Pruebas PGlite y remotas: CAS 42/41, única reserva concurrente, complete falsificado denegado, duplicate/obsolete y rate compartido. Namespace temporal eliminado. B y replay persisten tras redeploy/API caída (store-live.json/publication.json).
Recursos Free: dos Workers, KV hyronix-blumik-staging-cache y D1 hyronix-blumik-staging-tags. Sin compra/plan.

Límite: API y snapshot comparten Supabase. Si ambos fallan queda fallback original; independencia completa requeriría otro provider vía SnapshotStore y aprobación de cualquier costo.
Referencias: [KV](https://developers.cloudflare.com/kv/platform/pricing/), [D1](https://developers.cloudflare.com/d1/platform/pricing/).
