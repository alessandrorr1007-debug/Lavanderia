# Instrucciones para agentes de desarrollo (Codex)
1. Inspecciona el repositorio y su estado antes de modificar archivos.
2. Trabaja SOLO en la fase y el alcance expresamente autorizados. No adelantes fases.
3. No reestructures el proyecto, reemplaces tecnologías o elimines código existente sin autorización.
4. Mantén la separación multiempresa. `tenant_id` debe verificarse en servidor y BD; no confiar en un identificador enviado por cliente.
5. Nunca expongas secretos, `service_role`, contraseñas o claves privadas en frontend, repositorio o logs.
6. No uses rutas demo como autenticación. Antes de activar datos reales, implementar Auth, autorizaciones y pruebas RLS positivas/negativas.
7. No ejecutes migraciones destructivas ni borres datos sin autorización explícita y respaldo.
8. Las operaciones de caja y pagos requieren transacciones, idempotencia, historial y permisos.
9. Conserva la UI consistente, accesible y responsive; evita componentes duplicados.
10. Ejecuta `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` cuando el entorno lo permita. Informa qué ejecutaste y qué no.
11. Al finalizar, resume archivos cambiados, pruebas, limitaciones y riesgos pendientes.
12. Los datos en `src/lib/demo.ts` son ficticios; no presentarlos como reales ni conectar operaciones reales sin autorización.
13. Consulta `docs/` antes de cada fase; si hay ambigüedad, plantea opciones y solicita decisión.

Referencia comercial y técnica: `docs/suscripciones.md`. Esta ampliación mantiene la Fase 0 como demo; no añade políticas, migraciones ni cobros reales.
14. No recoger tarjetas en formularios propios ni simular que una prueba o pago demo se activó realmente. Validar elegibilidad y vigencia en servidor; el selector de demo no concede permisos.
