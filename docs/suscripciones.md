# Suscripciones y prueba gratuita — requisitos aprobados

## Alcance de esta entrega
Ampliación de Fase 0: documentación, catálogo y pantallas demo. No implementa Auth, registro real, almacenamiento de tarjetas, cobros, facturación electrónica, autorización de acceso ni migraciones adicionales. El selector de estados no es un control de seguridad.

## Oferta
- Básico: S/ 24.90 mensuales por lavandería, un local. Clientes, servicios, pedidos, producción, caja, abonos, saldos, reportes básicos y tickets de recepción/entrega.
- Con facturación electrónica: S/ 44.90 mensuales, futuro no contratable. Incluye Básico y boletas/facturas electrónicas cuando se integre un proveedor.
- No se han fijado límites comerciales de usuarios, pedidos ni almacenamiento: no anunciarlos como ilimitados. Definirlos antes del lanzamiento.
- Antes de vender: confirmar costos de pasarela, facturación, soporte e infraestructura y determinar si los precios finales incluyen IGV. El cobro visible y el consentimiento deben usar el total final aprobado, sin suplementos ocultos.
- Los cobros se liquidan a la cuenta comercial del propietario de LavaGest, descontando las comisiones aplicables. No confundir estos pagos SaaS con la caja de los clientes de cada lavandería.

## Activación y prueba
1. Verificar identidad y pertenencia al negocio con Auth y permisos de servidor.
2. Mostrar plan, importe final mensual, 14 días gratuitos, fecha exacta del primer cobro, renovación automática, cancelación y tratamiento de datos.
3. Recabar aceptación explícita de cargos recurrentes y registrar versión de términos y fecha. No marcar aceptación por defecto.
4. Recoger y validar la tarjeta exclusivamente con campos alojados por la pasarela. No guardar PAN completo, CVV ni registrar estos datos en logs.
5. Verificar en servidor con la pasarela que la tarjeta esté configurada correctamente y sea apta; no confiar en la respuesta del navegador.
6. Consultar elegibilidad global y reclamar la prueba de manera atómica; activar solo después de confirmar tarjeta y reserva de elegibilidad. No consumir una prueba por un intento fallido.
7. Establecer trial_started_at y trial_ends_at desde el reloj del servidor (14 × 24 horas). Guardar UTC; mostrar fechas en America/Lima.
8. No cobrar la mensualidad al iniciar. Si existe autorización bancaria temporal, explicar el comportamiento concreto del proveedor antes de confirmar.

## Una sola prueba por tarjeta
- Usar una huella estable emitida por el proveedor que permita comparación entre clientes de la misma integración. Un token de pago distinto no demuestra tarjeta distinta; últimos cuatro dígitos no identifican una tarjeta.
- La consulta es global de plataforma, no por tenant; su registro no será accesible desde el navegador ni mediante políticas de lectura de negocios.
- Definir alcance y restricciones del proveedor antes de diseñar índices únicos. No dar por hecho equivalencia entre distintas pasarelas, billeteras tokenizadas o reemplazos de tarjetas.
- Reclamo transaccional con unicidad para impedir dos activaciones concurrentes; rechazar la segunda sin generar otra suscripción ni cobro inesperado.
- Cambiar correo, cuenta, negocio o tarjeta dentro de una suscripción no reinicia trial_ends_at. Eliminar una cuenta no debe permitir otra prueba automáticamente; definir política de retención mínima y privacidad antes de conservar identificadores antifraude.
- Una tarjeta ya utilizada puede contratar una mensualidad, con confirmación explícita de pago inmediato; nunca cobrarla solo por rechazar una prueba.
- La regla reduce abuso, no elimina multicuentas con otras tarjetas. Complementar con correo y teléfono verificados y controles de frecuencia; no bloquear por IP compartida como única señal.

## Estados y acceso
| Estado | Regla prevista |
| --- | --- |
| trialing / En prueba | Operación permitida hasta trial_ends_at. |
| active / Activa | Operación permitida hasta current_period_end, con pago confirmado. |
| expired / Vencida | Operaciones restringidas; mantener datos y acceso limitado a renovación y exportación autorizada. |
| cancelled / Cancelada | Renovación desactivada. Conservar acceso hasta el fin del período o prueba vigente; luego restringir. |

En implementación conviene separar entitlement de cancel_at_period_end: una cancelación no anula un período ya pagado. El acceso se evalúa siempre con fechas de servidor, aunque una tarea de vencimiento no se haya ejecutado.

## Renovación y cancelación
- Avisar antes del fin de prueba y mostrar fecha/monto de renovación en el panel.
- Cancelación accesible desde Mi suscripción; su confirmación requiere éxito en servidor/pasarela y debe ser auditable.
- No cobrar al final de prueba si se canceló antes del límite efectivo. Probar carrera entre cancelación y renovación.
- Tras el período vigente, iniciar el primer período mensual pagado solo con confirmación válida de la pasarela.
- Definir calendario mensual con el proveedor (incluidos meses cortos); no asumir que un mes equivale siempre a 30 días.
- Pago fallido: no ampliar acceso como si se hubiera pagado. Restringir al vencer el período vigente, conservar datos y ofrecer actualización de tarjeta. Política de reintentos pendiente de proveedor.
- Renovar restaura acceso después de confirmar el pago. No reiniciar la prueba.
- Sin borrado automático por falta de pago. Establecer retención, eliminación solicitada y exportación antes de operación real.

## Integración futura y evidencia
Seleccionar pasarela compatible con el país del comerciante, PEN, tarjeta sin cobro inicial, cargos recurrentes, cancelación y huellas útiles para elegibilidad. No se ha elegido proveedor ni se ha confirmado disponibilidad comercial.
Webhooks firmados, deduplicación por evento, idempotencia, control de eventos tardíos/fuera de orden, reconciliación y registro de auditoría. No habilitar servicio por una URL de retorno o un estado enviado por cliente.

## Modelo futuro (no aplicado)
Ampliar subscriptions con customer/subscription IDs del proveedor, inicio/fin de prueba, período pagado, precio/moneda aceptados, cancelación y estado. Registro privado global de elegibilidad de prueba; tabla de eventos procesados y auditoría de aceptación/cancelación. Índices, RLS, restricciones y migraciones aditivas después de aprobar diseño.
No sobrecargar payments/cash_sessions, que pertenecen a operaciones de la lavandería. Nunca permitir al propietario editar su vigencia, precio, huella o estado de pago.

## Pruebas necesarias antes de cobrar
Dos cuentas con la misma tarjeta, dos solicitudes simultáneas, intento de repetir tras borrar cuenta, cambio de tarjeta sin reinicio, tarjeta rechazada, aceptación de cargos, cancelación antes de vencimiento, cancelación concurrente, vencimiento sin tarea, cobro fallido, renovación exitosa, meses cortos, webhooks duplicados/falsos/fuera de orden, acceso entre tenants y exportación autorizada con acceso restringido.
