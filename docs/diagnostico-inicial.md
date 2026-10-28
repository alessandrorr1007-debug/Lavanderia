# Diagnóstico inicial de LavaGest

Fecha: 28 de octubre de 2026 (America/Lima). Alcance: revisión y reparación de Fase 0. No se inició la Fase 1, no se ejecutó SQL, no se conectó Supabase ni una pasarela, no se publicó la aplicación y no se realizaron commits.

## 1. Estado general

Base de demostración navegable, coherente con el monolito modular documentado. No es un sistema comercial operativo ni contiene autenticación efectiva. Los datos son ficticios y no persisten. La carpeta entregada no contiene `.git`: `git status` devolvió «not a git repository». No se inicializó Git ni se puede establecer un diff contra una revisión anterior.

Se inspeccionaron AGENTS.md y README.md completos, todos los documentos de docs/, archivos fuente, configuraciones, tests, SQL, lockfile y directorios de reserva. public/, hooks/, types/, styles/, components/forms y components/tables contienen reservas `.gitkeep`; src/features reserva módulos futuros. No se eliminaron archivos.

## 2. Estructura y tecnologías

Next.js 15 con App Router, React 19, TypeScript estricto, Tailwind CSS 4 vía PostCSS, Lucide, Zod y SDK de Supabase. Versiones resueltas iniciales: Next 15.5.28, React 19.3.1, TypeScript 5.9.3. Node local v24.14.1 y npm 11.11.0; cumple el mínimo del README, que recomienda Node 22 LTS.

- src/app: inicio, planes, grupo auth, grupo dashboard y grupo superadmin. Los grupos solo organizan layouts; no son barreras de acceso.
- src/components: AppShell compartido, Section y PlanCards reutilizables.
- src/lib: navegación, constantes comerciales, datos demo, roles, esquema Zod y factoría de cliente Supabase.
- supabase: migración inicial de referencia y seed sin inserciones.
- tests: dos comprobaciones de contenido con node:test.
- Configuración: alias @/*, modo TypeScript estricto y exclusiones ESLint para archivos generados. No hay API, Server Actions, middleware de autorización ni cliente Supabase de servidor.

## 3. Funcionalidades existentes

- `/`: presentación del producto y catálogo comercial de ejemplo.
- `/planes`: precios previstos y condiciones, sin contratación.
- `/login`: elección pública entre panel de propietario y plataforma. No recibe credenciales ni crea sesión.
- `/registro` y `/recuperar-contrasena`: pantallas informativas, sin formularios ni envío de correos.
- `/dashboard`: indicadores ilustrativos y tabla de pedidos ficticios; las cifras no son agregados calculados de la tabla.
- `/pedidos`, `/clientes`, `/servicios`: listados estáticos, sin CRUD ni persistencia.
- `/produccion`, `/caja`, `/reportes`, `/empleados`, `/configuracion`: marcadores explícitos de trabajo pendiente.
- `/suscripcion`: precios, fechas ilustrativas y selector de cuatro estados en memoria. No concede acceso ni activa una prueba; botones de tarjeta/cancelación deshabilitados.
- `/plataforma`, `/plataforma/lavanderias`, `/plataforma/soporte`: estructura informativa pública.
- `/plataforma/planes`, `/plataforma/suscripciones`: catálogo y reglas previstas; no administran negocios ni cobros.

## 4. Funcionalidades pendientes

Fase 1: Auth, recuperación segura, invitaciones, membresías, autorización de servidor, rol de plataforma independiente, RLS y pruebas de aislamiento. Fase 2: CRUD y flujo persistente de pedidos, historial, tickets y validación completa. Fase 3: caja transaccional, abonos, reversos e idempotencia. Fase 4: onboarding y suscripciones reales, consentimiento, vigencia y webhooks. Piloto: pruebas E2E, respaldos y restauración, rendimiento y preparación operativa. Las extensiones se mantienen según el roadmap, sin adelantarlas.

## 5. Errores e inconsistencias detectados

1. El login no enlazaba a registro ni recuperación, aunque sus rutas existían.
2. El menú mostraba el estado activo solo mediante color; no exponía aria-current ni nombre de navegación.
3. Texto secundario #73849d y encabezados #7a8aa0 sobre blanco presentan contraste insuficiente para texto pequeño (aproximadamente 3.8:1 y 3.5:1). Se ajustaron a #536681, aproximadamente 5.8:1.
4. Las tarjetas podían quedar comprimidas en móviles pequeños; se ajustaron anchos mínimos y distribución de indicadores.
5. El README indicaba npm install pese a existir lockfile y documentarse npm ci en la entrega previa.
6. .gitignore no cubría variantes como .env.production o .env.development. No se encontraron archivos de entorno reales en la raíz; solo .env.example vacío.
7. npm audit inicial detectó Next (moderado, por dependencia) y PostCSS (alto). Next fijaba PostCSS 8.4.31, aunque Tailwind ya utilizaba PostCSS 8.5.32.
8. El borrador SQL usa subscriptions.status='trial', mientras la demo usa 'trialing'; plan_code/status no están restringidos y no hay unicidad de suscripción por tenant. Resolver al diseñar la fase correspondiente, sin modificar esta migración.
9. Los tests actuales no ejercitan roles de TypeScript, validación Zod, autenticación ni BD. Sus nombres no deben interpretarse como evidencia de aislamiento.
10. Utilidades de permisos, validaciones y Supabase no tienen consumidores. Son preparación para fases futuras, no funcionalidades implementadas; se conservaron.

## 6. Correcciones realizadas

- Navegación del login hacia registro, recuperación e inicio.
- Nombres accesibles para los menús y aria-current en la ruta activa.
- Contraste de textos secundarios y encabezados de tablas, enlaces auxiliares y ajustes responsive acotados.
- Instalación reproducible documentada con npm ci.
- Exclusión de variantes .env.* manteniendo .env.example versionable.
- Corrección limitada de la dependencia PostCSS de Next mediante overrides, conservando Next.js 15 y PostCSS 8; ver resultados finales abajo.

## 7. Resultados de las pruebas

Los resultados finales de instalación, comprobaciones y navegador se registran al final de este documento. No se ejecutaron pruebas de BD/Auth/RLS ni pagos: no existen implementaciones que validarlas en esta fase.

## 8. Riesgos de seguridad y arquitectura

### Acceso y aislamiento

Todas las rutas son públicas, incluido el panel de plataforma. Cambiar de panel o el selector de suscripción es navegación demo y no autorización. roles.ts solo declara una matriz parcial: nadie la aplica en servidor. No hay sesión de la que derivar tenant_id. El cliente Supabase está preparado, pero no importado por las pantallas; configurar variables por sí solo no implementa seguridad.

El SQL declara tenant_id en entidades de negocio y FKs compuestas para pedidos/clientes, ítems/pedidos/servicios, historial/pedidos, pagos/pedidos y movimientos/caja. Esto impide referencias cruzadas en esas relaciones si el esquema se aplica, pero no sustituye RLS ni comprueba al actor. Los 12 objetos declaran RLS, sin políticas ALLOW; se espera denegación para roles de cliente sujetos a RLS. Esto se verificó por lectura del SQL, no en una instancia PostgreSQL. Propietarios de tabla y roles con BYPASSRLS requieren tratamiento separado; no afirmar protección universal.

Faltan políticas por operación y rol, validación de membresía vigente, control de autoasignación de roles y un modelo de platform_admin separado. changed_by, opened_by y actor_id referencian auth.users pero no garantizan pertenencia al tenant. Audit logs admite tenant_id nulo; debe definirse quién puede registrar y consultar eventos globales.

### Integridad de datos

Faltan índices de acceso por tenant y claves foráneas según consultas, restricciones de transiciones y valores del historial, sincronización del total con ítems y snapshots completos. La BD no implementa transacciones de caja, relación de cobros con sesión de caja, unicidad de caja abierta, idempotencia, reversos ni historial inmutable. No activar operaciones reales con este borrador.

El esquema Zod valida UUID, cantidad positiva y tamaño de notas, pero no se utiliza, no verifica pertenencia al tenant, vigencia del servicio, permisos, precio de servidor ni consistencia del pedido. No usar validaciones del navegador como frontera de seguridad.

### Entorno y suscripciones

No se encontraron secretos incrustados en el código revisado; .env.example no contiene valores. Solo se prevén URL y clave pública anon. service_role nunca debe estar en NEXT_PUBLIC_, frontend o logs. No se verificaron credenciales remotas ni configuración de una cuenta Supabase porque no se conectó ninguna.

Las fechas y estados de suscripción son ilustrativos. Elegibilidad global por tarjeta, reloj de servidor, consentimiento, vigencia, cancelación y webhooks siguen pendientes. No hay captura de tarjetas ni integración de cobros. Definir IGV, límites y proveedor antes de vender, conforme a docs/suscripciones.md.

## 9. Recomendaciones para iniciar la Fase 1

Solo después de autorización expresa:

1. Aprobar modelo de identidad/membresías, alta de tenant, invitaciones y asignación separada del administrador de plataforma.
2. Diseñar sesión de servidor y autorización centralizada por operación; derivar tenant de identidad y membresía comprobadas. Rechazar tenant_id manipulado por cliente.
3. Diseñar políticas RLS de mínimo privilegio para SELECT/INSERT/UPDATE/DELETE, incluyendo WITH CHECK, y protección frente a escalada mediante memberships.
4. Preparar pruebas positivas/negativas con dos tenants, owner/worker, sin sesión y administrador de plataforma; probar API directa y referencias cruzadas. Usar clientes anon/autenticados para comprobar RLS, no service_role.
5. Revisar migración en entorno aislado y respaldado, con índices/restricciones y estrategia de evolución aditiva. No aplicar el borrador directamente a producción.
6. Completar recuperación, cierre de sesión y revocación; limitar abuso y evitar filtrar existencia de cuentas. Definir gestión de secretos, auditoría y respaldo/restauración.
7. Mantener operaciones y suscripciones reales desactivadas hasta superar las fases y criterios documentados. La compilación y las rutas HTTP 200 no acreditan preparación comercial.

## 10. Archivos intervenidos

- `.gitignore`: cobertura de archivos de entorno.
- `README.md`: comando de instalación reproducible y referencia a este diagnóstico.
- `package.json`: override acotado de PostCSS para Next.
- `package-lock.json`: resolución reproducible de la dependencia corregida.
- `src/app/(auth)/login/page.tsx`: enlaces a rutas auth existentes.
- `src/components/layout/app-shell.tsx`: semántica accesible del menú.
- `src/app/globals.css`: contraste y ajustes responsive.
- `docs/diagnostico-inicial.md`: informe nuevo.

Next.js genera `.next/`, `next-env.d.ts` y TypeScript puede generar `tsconfig.tsbuildinfo` durante las verificaciones. Son artefactos de herramientas; no se añadieron módulos comerciales ni se cambiaron archivos SQL.

### Referencias de la corrección de dependencias

La auditoría inicial de npm identificó PostCSS 8.4.31 bajo Next. Se fijó PostCSS 8.5.32 únicamente para esa dependencia, conservando Next 15.5.28. Avisos consultados:

- [Lectura de archivos por sourceMappingURL, GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q).
- [Corrección incompleta, resuelta desde 8.5.23, GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).

No se utilizó npm audit fix --force ni se migró a Next 16. La actualización dentro de PostCSS 8 se valida con instalación, auditoría, compilación y navegador; debe reevaluarse cuando se actualice Next. La advertencia de soporte de ESLint 9 se conserva como mantenimiento pendiente; su ejecución actual funciona y no se cambió a otra versión mayor.

### Incidencias durante la verificación

Un intento de typecheck mientras npm ci todavía estaba instalando falló porque el ejecutable tsc aún no estaba disponible. Tras completar la instalación, el mismo comando pasó sin errores de código. El primer build también pasó. La resolución inicial del override no actualizó la entrada anidada de PostCSS: npm ls la detectó como inválida y audit seguía mostrando dos alertas. Se reconstruyó la resolución del lockfile en una carpeta temporal con el mismo manifest, sin eliminar archivos del proyecto; posteriormente se repitió npm ci con el lockfile corregido. Los resultados finales son los relevantes para la entrega.

## 11. Verificaciones finales del entorno

- `npm ci`: aprobado con el lockfile corregido; 334 paquetes instalados, 335 auditados, cero vulnerabilidades.
- `npm run typecheck`: aprobado, sin errores.
- `npm run lint`: aprobado, sin errores ni advertencias del analizador.
- `npm test`: aprobado, 2/2 tests existentes. No son pruebas funcionales de seguridad.
- `npm audit`: aprobado, cero vulnerabilidades reportadas en este momento.
- `npm ls postcss`: árbol válido; Next y Tailwind resuelven PostCSS 8.5.32. No queda el PostCSS 8.4.31 vulnerable.

La advertencia de deprecación/soporte de ESLint procede de la instalación, no de un fallo de lint. No garantiza ausencia de vulnerabilidades desconocidas ni reemplaza pruebas de seguridad.
- `npm run build`: aprobado tras corregir PostCSS. Next generó 23 páginas estáticas (incluye páginas internas del framework); la aplicación tiene 20 rutas públicas revisadas.
- `npm run dev -- --hostname 127.0.0.1 --port 3000`: servidor local iniciado y enlazado únicamente a loopback. No se publicó en Internet.
- La primera navegación automatizada agotó 30 segundos mientras Next compilaba `/` por primera vez (33.1 s de compilación; luego respondió 200). Se amplió el tiempo de espera del navegador para la pasada completa; no fue un error de build ni un fallo de la ruta.

### Hallazgo visual adicional

En 768 px, la cuadrícula de cuatro indicadores dejaba tarjetas de unos 103 px y el texto «Clientes registrados» excedía su caja. Se ajustó a dos columnas entre 751 y 1100 px, manteniendo cuatro en escritorio amplio y una en móviles pequeños. Detectado mediante captura real de Chromium y medición de scrollWidth/clientWidth; se repite la verificación tras el cambio.

El primer script de interacción encontró dos elementos con aria-live (el estado de la demo y el anunciador de rutas de Next). Falló por un selector ambiguo del script, no por la aplicación; se corrigió el selector de la herramienta a `.status-preview`. Tras el ajuste visual de tablet se vuelve a compilar y se repite el recorrido completo sobre el servidor de producción exclusivamente local; al terminar se deja activo el servidor de desarrollo solicitado.

## 12. Resultado final en navegador y cierre

Chromium 156, ejecución local de la compilación final (npm start, loopback, sin despliegue):

- 20 rutas × 4 anchos (1440, 768, 390 y 320 px): 80/80 respuestas HTTP 200, encabezado principal presente y sin desbordamiento horizontal del documento.
- Sin errores pageerror de JavaScript y sin enlaces internos hacia rutas desconocidas en el recorrido.
- Selector de suscripción: active, expired, cancelled y trialing muestran sus textos correspondientes. No produce activaciones reales.
- Login: enlaces a registro, recuperación, panel propietario y panel plataforma comprobados con espera explícita de la URL de destino: 4/4 aprobados.
- En una primera comprobación de recuperación se leyó la URL inmediatamente después del click y el script marcó false antes de completar la transición. La repetición con waitForURL pasó; no se detectó un fallo de navegación de la aplicación.
- En móvil se confirmó el desplazamiento horizontal interno de pedidos y la navegación a Configuración mediante el menú horizontal. Las tablas mantienen scroll interno cuando las columnas exceden el ancho disponible.
- Suscripción: botón de registrar tarjeta deshabilitado y cero inputs de tarjeta/datos personales en esa pantalla.
- Capturas inspeccionadas: dashboard escritorio y móvil, dashboard tablet antes/después, pedidos tablet, login móvil, inicio a 320 px y suscripción móvil. El indicador de tablet quedó sin textos desbordados: cuatro tarjetas de aproximadamente 222 px en dos columnas.
- Build posterior al último ajuste CSS: aprobado, incluidas comprobaciones de tipos y lint integradas por Next.

La revisión responsive utiliza viewports de navegador, no dispositivos físicos. No constituye auditoría WCAG completa ni pruebas E2E de operaciones comerciales. Las capturas y scripts auxiliares quedaron en la carpeta temporal del sistema, fuera del proyecto; la evidencia resumida y el alcance se conservan en este documento.

Se detuvo el servidor de producción local utilizado para las pruebas y se reinició el servidor de desarrollo en http://127.0.0.1:3000. El proceso debe permanecer abierto para seguir utilizando la demo; si se cierra, arrancar desde la raíz con npm run dev. No hay verificaciones obligatorias pendientes de esta revisión, salvo las limitaciones de seguridad y operación deliberadamente reservadas para las fases futuras.

La Fase 0 queda instalada y revisada. Se detiene el trabajo aquí; la Fase 1 requiere nueva autorización.

Comprobación final tras reiniciar desarrollo: GET / respondió HTTP 200 y el HTML contiene LavaGest. Se deja activo el proceso de desarrollo local.
