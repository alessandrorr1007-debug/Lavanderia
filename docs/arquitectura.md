# Arquitectura
Monolito modular Next.js (App Router) + TypeScript + Tailwind CSS. Base de datos prevista: Supabase PostgreSQL/Auth/Storage. Inicialmente una sucursal por tenant, sin tabla de sucursales hasta justificarla.
- Multiempresa: `tenant_id` en entidades de negocio, FKs compuestas y RLS.
- Cliente nunca elige arbitrariamente el tenant autorizado: derivarlo de sesión y membresía validada.
- Superadmin separado de propietarios; privilegios verificados en servidor, auditoría y mínimo acceso.
- La base de Fase 0 se conserva como UI operativa ficticia. Fase 1A añade Auth SSR, guards de servidor y alta de identidad; requiere aprobar/configurar el entorno remoto. Ver `autenticacion.md` y `seguridad-supabase.md`.
- Integraciones futuras: WhatsApp, correo, pagos y comprobantes, mediante adaptadores del servidor.

Referencia comercial y técnica: `docs/suscripciones.md`. El catálogo y la suscripción siguen siendo demostrativos; Fase 1A no añade cobros ni operaciones comerciales. Las migraciones de identidad preparadas requieren autorización remota.
