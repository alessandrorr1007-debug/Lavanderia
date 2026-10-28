# Base de datos
Migración inicial: `supabase/migrations/202610280001_initial.sql`.
Tablas: tenants, memberships, customers, services, orders, order_items, order_status_history, cash_sessions, payments, cash_movements, subscriptions, audit_logs.
Esta migración es un borrador seguro por defecto: RLS activado y sin políticas ALLOW. Las políticas y funciones de negocio se diseñan en Fase 1 y se prueban con dos tenants diferentes. No ejecutar como esquema completo de producción. Agregar índices, políticas, restricciones de caja, idempotencia y triggers según avance de fases.

Referencia comercial y técnica: `docs/suscripciones.md`. El catálogo y la suscripción siguen siendo demostrativos; Fase 1A no añade cobros ni operaciones comerciales. Las migraciones de identidad preparadas requieren autorización remota.

## Fase 1A preparada
La migración incremental `202610280002_auth_identity.sql` añade profiles, platform_admins, campos de negocio, políticas de lectura y create_laundry transaccional. Solo está probada en PostgreSQL aislado; no aplicada remotamente. `preflight-auth.sql` prepara la revisión previa de solo lectura. Consultar `seguridad-supabase.md` para grants, límites, conflictos y plan sujeto a autorización. No se añaden políticas operativas ni suscripciones.
