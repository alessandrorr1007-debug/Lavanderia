# Base de datos
Migración inicial: `supabase/migrations/202610280001_initial.sql`.
Tablas: tenants, memberships, customers, services, orders, order_items, order_status_history, cash_sessions, payments, cash_movements, subscriptions, audit_logs.
Esta migración es un borrador seguro por defecto: RLS activado y sin políticas ALLOW. Las políticas y funciones de negocio se diseñan en Fase 1 y se prueban con dos tenants diferentes. No ejecutar como esquema completo de producción. Agregar índices, políticas, restricciones de caja, idempotencia y triggers según avance de fases.

Referencia comercial y técnica: `docs/suscripciones.md`. Esta ampliación mantiene la Fase 0 como demo; no añade políticas, migraciones ni cobros reales.
