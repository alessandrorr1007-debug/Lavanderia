# LavaGest — Fase 1A preparada (autenticación e identidad)
Plataforma SaaS multiempresa para lavanderías (una sucursal por empresa en la versión inicial).

## Requisitos
Node.js 20.9+ (recomendado 22 LTS), npm.

## Instalación
1. Descomprime el ZIP y copia **el contenido de la carpeta** `lavanderia/` a tu proyecto local.
2. En la terminal, desde la carpeta del proyecto, ejecuta `npm ci` (instalación reproducible con `package-lock.json`).
3. Configura `.env.local` según `.env.example`, sin versionar credenciales. APP_URL debe coincidir con el origen usado al abrir la aplicación.
4. Ejecuta `npm run dev` y abre el origen local configurado. `/login`, `/registro` y `/recuperar-contrasena` contienen formularios reales; no probar envíos al proyecto remoto sin aprobar la configuración.
5. Los paneles requieren identidad y permisos de BD. Revisa `docs/fase-1a.md` antes de aplicar SQL o crear cuentas de ensayo.

## Verificaciones
`npm run typecheck` · `npm run lint` · `npm test` · `npm run build`.

## Estado real
- Fase 1A: código de autenticación SSR e identidad preparado; aceptación remota pendiente.
- Las rutas de panel ya no son demos públicas: requieren sesión y autorización de servidor. Las pantallas operativas siguen mostrando datos ficticios, sin CRUD ni pagos.
- El esquema de identidad/RLS está preparado y probado localmente; no se ejecutaron migraciones remotas.
- No se ha validado un flujo completo contra Auth/SMTP remoto. Consulta [Fase 1A](docs/fase-1a.md), [autenticación](docs/autenticacion.md) y [seguridad](docs/seguridad-supabase.md).

## Seguridad
Nunca usar claves `service_role` en el navegador. El superadministrador utiliza autorización de servidor independiente de la membresía del negocio; su configuración remota sigue pendiente. Antes de usar datos reales aplicar únicamente el SQL aprobado y superar las pruebas de Auth/RLS en el proyecto de ensayo; la auditoría operativa y los demás módulos permanecen pendientes.

## Organización
`src/app`: rutas y pantallas. `src/components`: UI. `src/lib`: utilidades y demo. `src/features`: módulos futuros. `supabase`: SQL. `docs`: especificaciones. `AGENTS.md`: reglas para Codex.

## Novedades de esta versión
- Básico: S/ 24.90/mes; futuro con facturación electrónica: S/ 44.90/mes.
- Catálogo público en `/planes` y sección de planes en el inicio.
- `/suscripcion`: ejemplo del fin de prueba, primer cobro, condiciones y selector de estados. No acepta tarjetas ni ejecuta pagos.
- `/plataforma/planes` y `/plataforma/suscripciones`: catálogo y reglas de acceso de ejemplo.
- Prueba prevista de 14 días con tarjeta y una sola prueba por tarjeta; renovación automática con aceptación expresa y cancelación accesible.
- Mejora del menú móvil y foco visible para navegación.
- Reglas completas en `docs/suscripciones.md`. Los precios no habilitan una contratación real. El tratamiento del IGV y los límites comerciales se deben definir antes del lanzamiento.

Esta entrega no implementa la Fase 4. No uses sus pantallas demo como validación de seguridad, prueba antifraude o evidencia de cobros.

## Revisión local
Consulta [el diagnóstico inicial](docs/diagnostico-inicial.md) para conocer el alcance, las correcciones y las verificaciones de esta revisión de Fase 0.
