# Arquitectura
Monolito modular Next.js (App Router) + TypeScript + Tailwind CSS. Base de datos prevista: Supabase PostgreSQL/Auth/Storage. Inicialmente una sucursal por tenant, sin tabla de sucursales hasta justificarla.
- Multiempresa: `tenant_id` en entidades de negocio, FKs compuestas y RLS.
- Cliente nunca elige arbitrariamente el tenant autorizado: derivarlo de sesión y membresía validada.
- Superadmin separado de propietarios; privilegios verificados en servidor, auditoría y mínimo acceso.
- La base de Fase 0 es una demo navegable: no tiene servidor de negocio ni protección de rutas.
- Integraciones futuras: WhatsApp, correo, pagos y comprobantes, mediante adaptadores del servidor.

Referencia comercial y técnica: `docs/suscripciones.md`. Esta ampliación mantiene la Fase 0 como demo; no añade políticas, migraciones ni cobros reales.
