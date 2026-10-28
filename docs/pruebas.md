# Estrategia de pruebas
Fase 0: typecheck, lint, build, tests unitarios de reglas simples, revisión manual responsive.
Fase 1: tests de RLS para 2 tenants, roles y acceso sin sesión, pruebas de API contra manipulación de tenant_id.
Fase 2: integridad de precios, transiciones, concurrencia, historial, cancelaciones.
Fase 3: cobros duplicados, cierre concurrente, reversos y auditoría.
Fase 4: vencimientos, reactivaciones, permisos SaaS.
Registrar resultados y limitaciones en cada entrega.

Referencia comercial y técnica: `docs/suscripciones.md`. Esta ampliación mantiene la Fase 0 como demo; no añade políticas, migraciones ni cobros reales.
