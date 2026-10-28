# Roles
- platform_admin: administración SaaS, no acceso automático indiscriminado a datos personales de negocios.
- owner: administra su tenant, personal, caja y configuración.
- worker: operaciones autorizadas de pedidos y producción, sin permisos administrativos por defecto.
- customer (futuro): solo sus propios pedidos mediante identidad validada.
La interfaz no es frontera de seguridad: comprobar cada operación en servidor y RLS.
