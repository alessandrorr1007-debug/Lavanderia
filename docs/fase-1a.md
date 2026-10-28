# Fase 1A — integración y autenticación

Fecha: 28 de octubre de 2026 (America/Lima). Estado: código preparado y verificación local; configuración y aceptación remotas pendientes. No se inicia Fase 1B.

## Alcance implementado

- Configuración local en .env.local ignorado, ejemplo sin credenciales y validación de URL/clave publishable/origen del servidor.
- @supabase/ssr para navegador y servidor, renovación de sesiones mediante middleware de Next 15, cookies y respuestas sin caché compartida.
- Formularios y acciones de registro, login, confirmación por correo, recuperación, contraseña nueva y logout local.
- Guards de identidad, membresía y rol en servidor. Administradores de plataforma separados de owner/worker; sin privilegios desde metadata.
- Alta posterior a confirmación de email con validación de servidor y función SQL atómica e idempotente.
- Migración incremental y guion de inspección preparados, sin aplicación remota.
- Interfaz compartida, validaciones por campo, estados de carga y bloqueo de envíos repetidos.

Los indicadores, pedidos, servicios y clientes de los paneles continúan siendo ficticios. Proteger sus rutas no los convierte en operaciones reales. Caja, reportes, empleados, configuración y suscripciones siguen sin operaciones comerciales.

## Archivos intervenidos

Configuración: .env.local (solo local/ignorado), .env.example, package.json, package-lock.json y next.config.ts.

Integración y permisos: src/middleware.ts; src/lib/supabase/client.ts, server.ts y env.ts; src/lib/auth/access.ts, policy.ts, recovery.ts y validation.ts.

UI: src/components/forms/auth-card.tsx, auth-form.tsx y logout-form.tsx; src/components/layout/app-shell.tsx; src/app/globals.css; presentación de acceso en src/app/page.tsx.

Rutas auth: acciones y layout de src/app/(auth), login, registro, recuperar-contrasena, nueva-contrasena, auth/confirm, crear-lavanderia, cuenta y acceso. Layouts dashboard/superadmin y guards mínimos de owner en caja, reportes, empleados, configuración y layout de suscripción. No se cambió su lógica operativa.

SQL: supabase/migrations/202610280002_auth_identity.sql y supabase/preflight-auth.sql. Se conservó la migración inicial sin cambios.

Pruebas: tests/auth.test.ts, env.test.ts, session.test.ts, rls.test.ts y tests/fixtures/auth.sql. Se conservan los tests iniciales; se añade tsx para ejecutar TypeScript y PGlite para el entorno aislado.

Documentación: este informe, autenticacion.md, seguridad-supabase.md y ajustes de estado en README, arquitectura, base de datos y roadmap. El diagnóstico de Fase 0 permanece como registro histórico.

## Comprobación remota permitida de solo lectura

La consulta de configuración pública de Auth respondió HTTP 200. El proveedor email está habilitado y exige confirmación. No se obtuvieron datos de clientes ni otras lavanderías, ni se crearon usuarios o enviaron correos. No se inspeccionó ni cambió el esquema remoto y no se usaron claves secretas o CLI.

## Qué falta por comprobar realmente

No se ha verificado un registro o login real en el proyecto remoto. Tampoco envío/recepción de emails, OTP real, cambio de contraseña real, cierre real contra Auth, alta de lavandería remota, políticas reales ni concurrencia de la BD remota. Esos procesos están implementados en código, pero requieren configuración y autorización antes de declararlos operativos de extremo a extremo.

Las pruebas de sesión utilizan el SDK SSR real con transporte simulado; las de BD ejecutan SQL real en PostgreSQL aislado con identidad de fixture. No deben presentarse como sustituto de un Supabase completo ni del piloto.

## Próximo paso que requiere aprobación

Revisar el esquema y respaldo remoto, resolver conflictos si existen, aprobar/aplicar las migraciones correspondientes, configurar URLs/plantillas/SMTP y ejecutar una prueba controlada con cuentas de ensayo. El procedimiento está detallado en seguridad-supabase.md. Si se utiliza Supabase CLI, el usuario debe autorizar el inicio de sesión en su computadora. No se realizaron commits, push, despliegues ni cambios remotos durante esta fase.

Los resultados finales de comandos y navegador se añaden al cierre de este documento.


## Verificaciones locales

- npm run typecheck: aprobado.
- npm run lint: aprobado sin errores ni advertencias del analizador.
- npm test: 22/22 aprobadas, incluidas 11 comprobaciones de BD dentro del caso PostgreSQL.
- Una expectativa inicial del test de cookies asumía que cualquier JWT rechazado borraba la sesión; se corrigió para comprobar el comportamiento real del SDK: rechazo sin acceso y eliminación al recibir session_not_found. La repetición completa pasó.
- La primera compilación pasó, con advertencias de rendimiento de caché Webpack sobre cadenas grandes; la compilación final se registra tras terminar los últimos ajustes.
- El cliente Docker existe, pero docker info no pudo contactar dockerDesktopLinuxEngine. No se arrancó Docker ni se descargaron imágenes. psql y Supabase CLI no están disponibles. El runner PGlite no depende de ese daemon.

## Cierre de verificaciones

- `npm run typecheck`: aprobado; también se comprobaron tipos en el build final.
- `npm run lint`: aprobado; también se ejecutó durante el build final.
- `npm test`: 22/22 aprobadas. Se añadió el caso de indisponibilidad temporal de Auth: acceso denegado con mensaje de conexión y sin borrar las cookies válidas.
- `npm run build`: aprobado tras los ajustes finales. Las rutas de identidad/panel se generan dinámicamente y el middleware se incluye. Se conservan inicio y catálogo públicos.
- `npm audit`: cero vulnerabilidades reportadas.
- `git diff --check`: sin errores de espacios; Git advierte sobre su normalización LF/CRLF en Windows.
- `.env.local`: exclusión verificada con git check-ignore; comparación de valores locales contra archivos versionables aprobada, sin coincidencias ni valores impresos.
- Navegador Chromium: 7 rutas públicas por 4 anchos (1440/768/390/320 px), 28/28 respuestas HTTP 200 y sin desbordamiento de documento. Las 18 rutas privadas probadas devolvieron 307 hacia login sin sesión y Cache-Control no-store.
- Registro: una solicitud deliberadamente inválida fue rechazada en el servidor antes de contactar Auth. Se mostraron tres errores por campo; se conservó el nombre introducido sin conservar contraseñas. No se creó ninguna cuenta.
- Sin errores JavaScript pageerror. Capturas revisadas de login móvil, registro tablet y errores de registro móvil. Se usaron viewports, no dispositivos físicos; no es una auditoría WCAG completa.
- La primera espera del script de navegador coincidía con el anunciador de rutas de Next y leía el resultado demasiado pronto; se ajustó a esperar el error del formulario. La repetición completa pasó.

El servidor de producción local usado para la comprobación se detuvo y se volvió a iniciar desarrollo en http://127.0.0.1:3000. Scripts y capturas auxiliares de navegador están en la carpeta temporal del sistema, fuera del proyecto. Los tests unitarios, de sesión y SQL sí están en tests/ y se ejecutan con npm test.

No se realizó ningún commit ni push de estos cambios. No se cambiaron Auth/SMTP, plantillas, URLs, usuarios, políticas o tablas remotas. El siguiente paso remoto y cualquier inicio de sesión mediante CLI requieren autorización explícita.

Comprobación final de desarrollo: GET /login respondió HTTP 200 y contiene el formulario de correo. El proceso local queda activo. El HEAD de Git permanece en el commit inicial de Fase 0; los cambios de Fase 1A siguen sin commit.
