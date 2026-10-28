# Roadmap y criterios de aceptación
## Fase 0 — Base (entrega actual)
Next.js funcional, rutas navegables, componentes, demo, estructura, documentación y migración de referencia.
## Fase 1 — Seguridad
Auth real, invitaciones, membresías, políticas RLS, autorización de servidor, pruebas cruzadas entre tenants y protección de rutas. Criterio: tenant A no puede leer ni alterar tenant B, incluso mediante API directa.
## Fase 2 — Operación
CRUD clientes/servicios, pedidos con ítems y snapshots de precio, historial de estados, tickets y validaciones. Criterio: flujo recepción→entrega persistente y auditable.
## Fase 3 — Caja
Apertura/cierre, abonos, devoluciones, saldos y transacciones idempotentes. Criterio: cuadre reproducible sin doble cobro.
## Fase 4 — SaaS
Onboarding, planes, suscripciones, restricciones, recuperación segura. Seguir `docs/suscripciones.md`: Básico S/ 24.90/mes, prueba de 14 días con tarjeta, elegibilidad global por tarjeta, consentimiento de renovación y cancelación. Criterio: suspensión sin pérdida de datos y aislamiento probado.
## Fase 5 — Piloto
Pruebas E2E, seguridad, rendimiento, respaldos y capacitación. Criterio: operación real de piloto con incidentes resueltos.
## Fase 6 — Extensiones
Inventario, delivery, portal cliente, WhatsApp y facturación electrónica según demanda. Plan futuro con facturación: S/ 44.90/mes, no disponible hasta integrar y probar el proveedor.
No iniciar una fase sin autorización explícita.
