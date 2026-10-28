# Entrega — planes y suscripción demo

## Alcance y cambios
Ampliación de Fase 0; sin activar backend, Auth, pagos o facturación ni ejecutar migraciones.
- Básico: S/ 24.90/mes. Con facturación electrónica: S/ 44.90/mes, futuro no contratable.
- Catálogo /planes y tarjetas en inicio; Mi suscripción /suscripcion con condiciones, fechas ilustrativas y selector de estados.
- Planes y reglas de suscripción en el panel de plataforma.
- Constantes compartidas en src/lib/billing.ts y tarjetas en src/components/shared/plan-cards.tsx.
- Reglas completas en docs/suscripciones.md: prueba de 14 días, una por tarjeta, renovación con aceptación, cancelación y conservación de datos.
- Menú móvil horizontal y foco visible. package-lock.json para instalaciones reproducibles con npm ci.

## Verificaciones
- npm run typecheck: aprobado.
- npm run lint: aprobado sin errores ni advertencias. Se excluyen archivos generados de .next del análisis.
- npm test: 2 tests existentes aprobados; no cubren seguridad ni pagos.
- npm run build: aprobado; 23 páginas estáticas generadas.
- HTTP local: /, /planes, /suscripcion, /plataforma/planes y /plataforma/suscripciones responden 200. Precios comprobados; no hay inputs de tarjeta en suscripción.
- No se completó revisión visual ni interacción en navegador: no hay un navegador instalado en el entorno. Revisar escritorio y móvil antes de publicar.

## Limitaciones
Datos ficticios y rutas públicas. El selector de estados no cambia permisos. Pendientes: Auth/RLS, operaciones persistentes, selección de pasarela, costos, tratamiento de IGV, límites comerciales, control antifraude, webhooks, consentimiento, cancelación y autorización de servidor. La huella de tarjeta reduce abuso sin impedir todas las multicuentas. No hay formularios de tarjeta ni cobros reales.

## Archivos originales modificados
- package.json
- eslint.config.mjs
- README.md
- AGENTS.md
- next-env.d.ts
- postcss.config.mjs
- docs/base-de-datos.md
- docs/modulos.md
- docs/pruebas.md
- docs/arquitectura.md
- docs/fases-desarrollo.md
- src/lib/navigation.ts
- src/app/globals.css
- src/app/page.tsx
- src/app/(superadmin)/plataforma/suscripciones/page.tsx
- src/app/(superadmin)/plataforma/planes/page.tsx

## Archivos nuevos
- src/lib/billing.ts
- src/components/shared/plan-cards.tsx
- src/app/planes/page.tsx
- src/app/(dashboard)/suscripcion/page.tsx
- docs/suscripciones.md
- docs/entrega-mejoras.md
- package-lock.json
