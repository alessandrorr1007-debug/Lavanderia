# LavaGest — Base mejorada (Fase 0 · planes y suscripción)
Plataforma SaaS multiempresa para lavanderías (una sucursal por empresa en la versión inicial).

## Requisitos
Node.js 20.9+ (recomendado 22 LTS), npm.

## Instalación
1. Descomprime el ZIP y copia **el contenido de la carpeta** `lavanderia/` a tu proyecto local.
2. En la terminal, desde la carpeta del proyecto, ejecuta `npm ci` (instalación reproducible con `package-lock.json`).
3. Ejecuta `npm run dev` y abre http://localhost:3000.
4. Prueba `/dashboard`, `/pedidos`, `/clientes`, `/servicios` y `/plataforma`.

## Verificaciones
`npm run typecheck` · `npm run lint` · `npm test` · `npm run build`.

## Estado real
- Fase 0: UI navegable y demostración local, sin backend activo.
- Rutas `/login` y `/plataforma` son **demos públicas**; NO protegen información real.
- Datos ficticios, sin persistencia. No hay pagos ni registro reales.
- `supabase/migrations/` contiene un esquema de partida con RLS activado **sin políticas de acceso**. No activar producción hasta completar y probar Fase 1.
- `.env.example` documenta variables futuras. No requiere Supabase para arrancar.

## Seguridad
Nunca usar claves `service_role` en el navegador. El superadministrador requerirá autorización en servidor independiente de la membresía del negocio. Antes de usar datos reales implementar autenticación, políticas RLS, pruebas de aislamiento y auditoría.

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
