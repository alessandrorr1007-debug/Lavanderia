# Seguridad Supabase — Fase 1A

## Fronteras de confianza

Auth comprueba la identidad; las consultas de servidor comprueban permisos y RLS limita cada consulta. user_metadata, campos hidden, slugs, props de cliente y tenant_id de formularios no autorizan. La clave publishable permite identificar el proyecto pero no sustituye políticas ni sesión. No se necesita ninguna clave secreta para el uso normal.

- profiles: información privada del usuario. SELECT solo del propio id. Sin escrituras directas de cliente.
- memberships: relación tenant/usuario con owner o worker. SELECT solo de las propias membresías. Sin INSERT/UPDATE/DELETE de cliente.
- tenants: SELECT solo para miembros del tenant. Alta exclusivamente mediante función controlada; sin edición directa en esta fase.
- platform_admins: tabla separada y lectura solo de la fila propia. No se concede lectura global de lavanderías. Sin autoasignación ni alta desde Auth metadata.
- Los módulos operativos mantienen RLS sin políticas ALLOW y no se conectan a datos reales.

El servidor deriva la lavandería de una membresía comprobada en BD. Si hay varias membresías válidas, esta fase utiliza la primera ordenada por tenant_id de forma determinista; no admite elegir un tenant arbitrario desde el cliente. Un selector de negocios y la gestión de invitaciones no forman parte de Fase 1A.

Owner puede acceder a los marcadores de caja, reportes, empleados, configuración y suscripción. Worker accede solo al dashboard y las pantallas demo de clientes, servicios, pedidos y producción. Los guards de servidor protegen también las URLs directas; esconder enlaces solo facilita la navegación. No se implementa ninguna operación comercial detrás de esos permisos.

## Migración incremental preparada

`202610280002_auth_identity.sql` añade columnas phone/address/created_by a tenants, perfiles, administradores de plataforma, índices, privilegios, políticas SELECT y create_laundry. No elimina tablas, filas ni columnas. Las filas anteriores mantienen created_by nulo; no se inventa quién las creó ni se reasignan propietarios existentes.

create_laundry:

- SECURITY DEFINER con search_path vacío y nombres calificados.
- Solo authenticated tiene EXECUTE; PUBLIC/anon no pueden invocarla.
- Comprueba auth.uid() y correo confirmado en auth.users.
- Valida nombres, teléfono (al menos siete dígitos) y dirección también en SQL.
- No recibe user_id, tenant_id, role, precio, plan ni vigencia.
- Usa bloqueo transaccional por usuario e índice único de created_by. Un reintento devuelve la lavandería donde ya es owner y no genera otra.
- Crea perfil, lavandería y membresía owner en la misma transacción. Cualquier error revierte todo.
- No permite reabrir otro negocio si se quitó externamente la membresía de una lavandería ya creada por el usuario.

Se permiten nombres de negocio repetidos entre personas distintas: un nombre o teléfono no acredita identidad comercial. La idempotencia es por cuenta confirmada. No existe verificación de RUC ni deduplicación global de empresas reales. No añadir esas restricciones sin diseño aprobado.

La migración falla si detecta políticas previas sobre las tablas de identidad: así no combina inadvertidamente políticas permisivas. Si ya existe create_laundry con esa firma, CREATE FUNCTION también falla en lugar de reemplazarla. Esto no convierte el archivo en migración reejecutable manualmente: usar el historial de migraciones y revisar conflictos primero.

## Plan remoto sujeto a autorización

1. Autorizar acceso e inspeccionar el proyecto. `supabase/preflight-auth.sql` es un guion de solo lectura para columnas, RLS, políticas y funciones. Comparar además restricciones, grants, triggers y versiones con lo esperado; no asumir que el proyecto remoto está vacío.
2. Confirmar respaldo/recuperación y entorno de ensayo separado. Revisar que el historial coincida y que el SQL no afecte objetos existentes inesperados.
3. Si no hay esquema de LavaGest, revisar/aplicar primero 202610280001_initial.sql. Si ya hay tablas, no ejecutarlo ciegamente: comparar diferencias y aprobar el ajuste incremental correspondiente.
4. Aprobar y aplicar 202610280002_auth_identity.sql. Las sentencias están dentro de BEGIN/COMMIT; un conflicto provoca rollback de ese archivo. No solucionar fallos borrando políticas o tablas.
5. Configurar URLs y plantillas de correo; crear usuarios de ensayo identificados y comprobar los flujos completos con consentimiento para los envíos.
6. Ejecutar las pruebas contra el Supabase de ensayo con sesiones anon/autenticadas de dos tenants, owner, worker y platform_admin. No usar service_role como cliente para probar RLS.
7. Solo después considerar trasladar la configuración aprobada. No se publica el sistema en esta fase.

No se ejecutó este plan remoto. No hay psql ni Supabase CLI disponibles como comandos en este entorno. Se detectó el cliente Docker; la disponibilidad del daemon se registra en el cierre de Fase 1A. Se utilizó PostgreSQL embebido para pruebas locales, sin iniciar contenedores. Si se decide usar CLI: instalar la herramienta oficial, ejecutar `supabase login` con autorización del usuario en su computadora, vincular el proyecto autorizado, revisar el diff y la migración pendiente antes de cualquier db push. No iniciar sesión, enlazar ni ejecutar db push sin autorización explícita. Como alternativa, el usuario puede revisar y ejecutar el SQL aprobado en el editor de Supabase.

## Evidencia local y límites

PGlite ejecuta PostgreSQL real en memoria con RLS y roles anon/authenticated. El fixture crea un auth.users mínimo y auth.uid() basado en una variable de sesión de prueba: no es GoTrue ni valida JWT reales. La única adaptación de la migración base en el runner es omitir CREATE EXTENSION pgcrypto porque gen_random_uuid ya es nativo en ese motor. El SQL original no se cambió. La migración 1A se ejecuta sin modificaciones.

Se prueban lecturas positivas/negativas entre dos tenants, rol worker, denegación de inserciones/escalada, administración de plataforma sin acceso global, usuario sin confirmar, anonimato, validación SQL, idempotencia y rollback provocado al insertar membresía. El motor embebido serializa una conexión; no equivale a una prueba de dos transacciones concurrentes en Supabase. El bloqueo debe comprobarse allí antes de activar altas reales.

No almacenar logs de contraseñas, tokens, cookies ni URLs de recuperación. La aplicación no los imprime y Next ignora el registro de URLs /auth/confirm en desarrollo; también usa Referrer-Policy: no-referrer. Antes de desplegar, configurar redacción equivalente en proxy, hosting, correo, observabilidad y trazas de BD. Las cookies SSR del navegador requieren cuidar XSS; no se utiliza dangerouslySetInnerHTML para datos de usuario.

Pendientes de operación comercial: prueba real de JWT/Auth/RLS del proyecto, SMTP, endurecimiento de límites, gestión de empleados/invitaciones, auditoría operativa y respaldos comprobados. No se crean políticas de pedidos, caja, pagos ni suscripciones en Fase 1A.
