# Propuesta y Documentación de Rediseño UI/UX — LavaGest SaaS

> **Estado**: Implementación completa de diseño y maquetación UI/UX aprobada y verificada.
> **Equipo**: Senior Product Designer, UI/UX Designer, Senior Next.js/React/Tailwind Frontend Engineer, Especialista en Accesibilidad y Arquitecto de Interfaces.

---

## 1. Diagnóstico y Auditoría UI/UX del Sistema Actual (Etapa 1)

Tras una inspección técnica minuciosa del repositorio, archivos fuente, pruebas y estilos globales, se detectaron los siguientes hallazgos y áreas críticas de mejora:

### 1.1. Arquitectura de Estilos y Consistencia Técnica
- **Inconsistencia de clases y estilos no compilados**: La página pública (`src/app/page.tsx`), el preview de producto (`src/components/shared/product-preview.tsx`) y los formularios de autenticación (`src/components/forms/auth-card.tsx`) hacen uso de decenas de clases CSS (`.marketing-page`, `.landing-hero`, `.preview-window`, `.preview-rail`, `.auth-story`, etc.) que **no se encuentran declaradas en `src/app/globals.css`**. Como resultado, la landing page y las pantallas de acceso no muestran su diseño proyectado y presentan roturas de espaciado y alineación.
- **Error en Next.js Linting y Build**: En `src/components/layout/public-header.tsx` y `src/components/layout/public-footer.tsx`, se utilizan elementos `<a>` nativos hacia rutas internas (`/#funciones`, `/#demo`, `/#planes`, `/#inicio`) en lugar del componente `<Link>` de Next.js. Esto genera 5 errores bloqueantes en `eslint` e impide completar `npm run build`.
- **Valores mágicos y estilos inline**: Existen múltiples declaraciones de estilo en línea (`style={{ display: "grid", gridTemplateColumns: "245px minmax(0,1fr)" }}`) y propiedades CSS con valores arbitrarios de radio (`17px`, `11px`, `10px`, `8px`) y paleta no estandarizada (`#102b50`, `#266be6`, `#e4eaf3`, `#73849d`).

### 1.2. Shell de la Aplicación y Navegación (`AppShell`)
- **Sidebar rígido y problemas en móvil**: El menú lateral tiene un ancho estático de `245px` en escritorio. En pantallas menores a `750px`, se colapsa bruscamente al flujo vertical convirtiendo la navegación en un carrusel horizontal con scroll (`overflow-x: auto`), lo cual resta valioso espacio vertical para trabajar en dispositivos móviles y no ofrece la experiencia de un menú lateral o drawer accesible con botón hamburguesa.
- **Encabezado desaprovechado**: El header superior contiene un breadcrumb plano y una etiqueta estática. No incluye buscador rápido (`Ctrl+K`), selector o identificador claro del negocio activo, perfil de usuario con avatar y rol, ni accesos rápidos de acción.
- **Contraste de texto en barra lateral**: El texto auxiliar `#8fb0d6` y `#a7bfdf` sobre el fondo `#102b50` no alcanza en tamaños pequeños (11px-12px) el ratio mínimo de contraste WCAG 2.1 AA (4.5:1).

### 1.3. Dashboard y Módulos Operativos
- **Dashboard (`/dashboard`)**: Los indicadores clave (KPIs) son bloques tipográficos estáticos sin iconografía contextual, sin badges de tendencia porcentual (ej. `+12% vs. ayer`), y la tabla de últimos pedidos carece de búsqueda, filtrado interactivo por estado y badges diferenciados por color semántico.
- **Clientes (`/clientes`)**: Tabla plana de 3 columnas sin buscador, sin ordenamiento, sin estado del cliente ni tarjetas de métricas del directorio (Total clientes, Frecuentes, Nuevos este mes).
- **Pedidos (`/pedidos`)**: Lista sin opciones de búsqueda en tiempo real, sin filtros por estado ("Recibido", "En lavado", "Listo", "Entregado"), ni vista rápida de detalle del pedido.
- **Servicios (`/servicios`)**: Presentación plana sin categorías de servicios (Lavado por kilo, Prendas delicadas, Ropa de cama/Edredones) ni visualización de tiempos estimados.
- **Producción (`/produccion`)**: Actualmente contiene un texto de "Pendiente de implementación". No ofrece la interfaz visual de tablero Kanban que el sector lavandería requiere para monitorear el flujo de prendas en tiempo real.
- **Caja (`/caja`)**: Actualmente una tarjeta vacía. Debe presentar una interfaz demostrativa con arqueo diario, desglose por métodos de cobro (Efectivo, Yape/Plin, Tarjeta) y movimientos del día.
- **Reportes (`/reportes`)**: Tarjeta vacía. Requiere un panel visual moderno con gráficos SVG limpios para horas punta, servicios más demandados y ticket promedio de venta.
- **Empleados y Configuración (`/empleados`, `/configuracion`)**: Pantallas vacías. Requieren directorios de personal con roles visuales y formularios de configuración agrupados en pestañas temáticas (Negocio, Horarios, Impresión de tickets).
- **Suscripciones (`/suscripcion`)**: Interfaz tosca con selectores nativos sin estilizar. Requiere un diseño SaaS moderno tipo Stripe Billing con resumen del plan, días de prueba y selector interactivo estilizado.

### 1.4. Panel de Superadministración (`/plataforma`)
- Actualmente es indistinguible en identidad respecto al panel de una lavandería cliente. Debe proyectar una estética técnica corporativa diferenciada (acentos en índigo/púrpura profundo), con métricas de plataforma SaaS (tenants activos, volumen de operaciones simuladas, estado del sistema) y directorios de empresas.

---

## 2. Nueva Identidad Visual: "Aqua Pura & Slate Modern" (Etapa 2)

Proponemos una dirección de diseño que comunica **limpieza, agua, frescura, tecnología y eficiencia operativa**, alejándose de dashboards aburridos o plantillas genéricas.

### 2.1. Tokens de Color Semánticos (Tailwind CSS v4)

```css
/* Paleta Institucional LavaGest */
--brand-950: #0a1526; /* Fondo ultra-oscuro para sidebar moderno */
--brand-900: #0f2038; /* Superficie base de navegación */
--brand-800: #183357; /* Hover de enlaces e items activos */
--brand-700: #22487a; /* Bordes sutiles en sidebar */

/* Acento Primario: Pure Aqua (Agua y Limpieza Tecnológica) */
--primary-600: #0284c7; /* Botones principales, enlaces clave */
--primary-500: #0ea5e9; /* Acento dinámico, foco, active ring */
--primary-400: #38bdf8; /* Resaltados suaves, badges de agua */
--primary-50:  #f0f9ff; /* Fondos de selección y estados activos */

/* Semántica Operativa para Lavandería */
--stage-received: #64748b; /* Recibido: Pizarra neutro organizado */
--stage-washing:  #0ea5e9; /* En Lavado: Azul agua dinámico */
--stage-drying:   #f59e0b; /* Secado/Planchado: Ámbar sol cálido */
--stage-ready:    #10b981; /* Listo para entrega: Verde esmeralda fresco */
--stage-done:     #475569; /* Entregado: Pizarra oscuro completado */

/* Superficies y Lienzos */
--canvas-bg:      #f8fafc; /* Lienzo de fondo limpio y relajante */
--card-bg:        #ffffff; /* Tarjeta blanca pura con micro-borde */
--border-subtle:  #e2e8f0; /* Borde de delimitación 1px */
--text-primary:   #0f172a; /* Texto de máxima nitidez */
--text-secondary: #64748b; /* Metadatos, fechas, estados secundarios */
```

### 2.2. Tipografía y Jerarquía
- **Familia tipográfica**: Pila moderna nativa de alto rendimiento (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) con renderizado `-webkit-font-smoothing: antialiased`.
- **Cifras tabulares**: Uso de `tabular-nums font-mono` para códigos de pedidos (`LV-00125`), importes en moneda (`S/ 35.00`) y cantidades, garantizando alineación vertical perfecta en tablas y tarjetas.
- **Escala modular clara**:
  - Títulos principales de vista: `text-2xl font-bold tracking-tight text-slate-900`
  - Subtítulos descriptivos: `text-sm text-slate-500`
  - Encabezados de sección y tarjetas: `text-base font-semibold text-slate-800`
  - Métricas numéricas: `text-3xl font-extrabold tracking-tight text-slate-900`

### 2.3. Radios, Bordes y Elevaciones
- **Bento Grid & Tarjetas**: `rounded-2xl` (16px) en contenedores y módulos principales; `rounded-xl` (12px) en botones, campos de formulario y tarjetas internas.
- **Sombras**:
  - `shadow-xs border border-slate-200/80` para tarjetas en reposo.
  - `shadow-md shadow-slate-200/60 -translate-y-0.5` para microinteracciones en tarjetas interactivas.
  - `shadow-xl shadow-slate-900/10` para menús desplegables y modales.

---

## 3. Arquitectura de Navegación y Shell de la Aplicación

### 3.1. Sidebar Inteligente y Responsive
- **Modo Desktop**: Barra fija de 256px con logotipo con micro-icono de lavadora en gradiente aqua, información de la lavandería en chip interactivo, navegación agrupada por áreas (Operación diaria, Administración, Sistema) y botón de cierre de sesión integrado con confirmación visual.
- **Modo Móvil / Tablet**: Barra superior compacta con botón hamburguesa accesible (`aria-expanded`, `aria-controls`), apertura de Drawer lateral mediante transición suave `transform translate-x` y backdrop difuminado (`backdrop-blur-sm bg-slate-900/40`), cerrable con tecla `Escape` o toque fuera.
- **Indicador de Modo Demostración**: Badge profesional con icono de escudo y texto "Entorno demostrativo", informando claramente al usuario sin saturar la vista.

### 3.2. Topbar Contextual
- Breadcrumbs jerárquicos con enlaces funcionales.
- Buscador rápido con atajo visual `⌘K / Ctrl+K`.
- Selector/Badge del negocio con avatar de 2 letras y rol del usuario ("Propietario" / "Personal").
- Pastilla elegante indicadora de datos demo con tooltip explicativo.

---

## 4. Rediseño Pantalla por Pantalla: Especificación Detallada

### 4.1. Página Pública (`/` y `/planes`)
- **Hero Comercial**: Encabezado visual de impacto con propuesta de valor clara, badge de estado "SaaS para lavanderías en Perú", llamadas a la acción diferenciadas (botón principal aqua con icono, botón secundario enlace a planes) y disclaimer transparente de versión en desarrollo.
- **Interactive Product Preview (Demo Live)**: Envoltura tipo ventana de aplicación SaaS con controles de ventana macOS estilizados, rail lateral interactivo, selector entre "Vista de Pedidos" y "Tablero de Producción", buscador en vivo y filtros instantáneos ("Todos", "En proceso", "Listos").
- **Grid de Beneficios "Bento Box"**: Bloques visuales que explican la recepción rápida, el seguimiento del proceso y el control de caja mediante ilustraciones vectoriales limpias.
- **Sección de Planes (`/planes`)**: Tarjetas de precios con toggle de moneda (Soles PEN), desglose detallado de características con checks verdes, distinción clara entre el plan base y el plan con facturación electrónica futura, y sección de condiciones transparentes de la prueba de 14 días.
- **FAQ y Footer**: Acordeones de preguntas frecuentes con animación nativa y pie de página corporativo con enlaces a inicio, planes, login y copyright. Corrección de enlaces `<a>` a `<Link>` para garantizar compilación perfecta.

### 4.2. Dashboard Principal (`/dashboard`)
- **Banner de Bienvenida Propietario**: Saludo personalizado con estado del día, botón de acceso rápido para "Registrar Pedido (Demo)" y "Ver Producción".
- **Grid de 4 KPIs Estratégicos**:
  1. *Pedidos de Hoy*: Conteo de órdenes, chip `+3 vs ayer` y desglose de pendientes.
  2. *Ingresos Estimados*: Monto del día en soles con nota de valor demostrativo.
  3. *En Lavado / Secado*: Cantidad de prendas en máquinas actualmente.
  4. *Listos para Entrega*: Clientes que pueden recoger hoy.
- **Sección Dual**:
  - *Columna Izquierda (70%)*: Tabla de últimos pedidos con filtros rápidos, estados con chips a color y selector de acciones demostrativas.
  - *Columna Derecha (30%)*: Widget de capacidad de planta (ocupación de lavadoras y secadoras) y accesos rápidos del día.

### 4.3. Módulo de Clientes (`/clientes`)
- **Encabezado y Métricas**: Tarjetas superiores con Total de Clientes, Clientes Recurrentes y Nuevos Registrados.
- **Barra de Herramientas**: Input con icono de lupa para búsqueda instantánea por nombre o teléfono, y botón de acción para "Nuevo Cliente (Demo)".
- **Tabla Enriquecida**: Avatar con iniciales en círculos de color suave, nombre completo, teléfono formateado con icono de teléfono/WhatsApp ilustrativo, número de pedidos históricos acumulados, último servicio solicitado y menú de opciones de fila.

### 4.4. Módulo de Pedidos (`/pedidos`)
- **Pestañas de Filtro Rápido**: "Todos", "Recibidos", "En Lavado", "Listos para entrega", "Entregados".
- **Buscador y Rango de Fechas**: Búsqueda por código de orden (`LV-00125`) o cliente.
- **Tabla Operativa Avanzada**:
  - Código en fuente monoespaciada en negrita con badge de prioridad.
  - Cliente con teléfono secundario.
  - Servicio detallado con icono de prenda y pesaje/piezas.
  - Fecha y hora de recepción y promesa de entrega.
  - Importe formateado con etiqueta de abono/saldo.
  - `StatusBadge` semántico:
    - *Recibido*: Slate
    - *En lavado*: Cyan / Aqua
    - *Listo*: Esmeralda con icono Check
    - *Entregado*: Pizarra suave

### 4.5. Módulo de Servicios y Tarifas (`/servicios`)
- **Visualización en Cuadrícula de Tarjetas y Tabla**: Selector de visualización (Tarjetas por categoría o Tabla comparativa).
- **Categorías Claras**:
  - *Por Kilo*: Lavado, Secado y Doblado.
  - *Prendas Delicadas / Tintorería*: Ternas, Vestidos, Abrigos.
  - *Hogar y Blancos*: Edredones, Cobertores, Cortinas.
- **Detalle de Servicio**: Icono de la prenda, unidad de cobro (`kg`, `prenda`, `unidad`), tarifa en soles y tiempo de entrega estimado sugerido (ej. 24h, 48h).

### 4.6. Módulo de Producción (`/produccion`)
- **Tablero Visual de Flujo de Lavandería (Kanban Operativo)**:
  - 4 Columnas principales:
    1. **Recibido**: Prendas recepcionadas listas para clasificación y pesaje.
    2. **En Lavado / Proceso**: En máquina lavadora o secadora.
    3. **Listo**: Prendas planchadas y embolsadas en estantería.
    4. **Entregado**: Entregado al cliente con conformidad.
  - **Tickets de Producción**: Tarjeta compacta con número de ticket, nombre de cliente, tipo de servicio, cantidad de prendas/kilos y selector visual para avanzar de etapa en la demostración interactiva sin alterar persistencia de datos.

### 4.7. Módulo de Caja y Pagos (`/caja`)
- **Resumen Ejecutivo de Caja**:
  - Saldo Inicial en Caja.
  - Total Cobrado en Efectivo.
  - Total Cobrado por Billeteras Digitales (Yape / Plin).
  - Total Tarjetas.
  - Saldo Total en Caja con Arqueo Teórico.
- **Historial de Movimientos del Día**: Tabla de ingresos, abonos y cobros contra entrega, con indicación de hora, número de pedido y método de pago.
- **Etiqueta Transparente**: Indicador visual permanente de "Módulo demostrativo — Las transacciones reales requerirán apertura formal de turno y cuadre transaccional".

### 4.8. Módulo de Reportes (`/reportes`)
- **Métricas Clave de Rendimiento**: Ticket promedio de venta, tiempo medio de permanencia de prendas en planta y tasa de pedidos entregados a tiempo.
- **Gráficos Visuales SVG Modernos**:
  - Gráfico de barras: Volumen de pedidos por día de la semana.
  - Gráfico de pastel / anillos: Proporción de ingresos por tipo de servicio (Kilo vs. Edredón vs. Planchado).
  - Gráfico de líneas / áreas: Evolución de pedidos mensuales ilustrativos.

### 4.9. Módulo de Empleados (`/empleados`)
- **Directorio de Personal**: Lista de trabajadores con avatar, nombre, correo, rol asignado con pastilla distintiva (Propietario / Administrador / Operador de Planta), turno y fecha de ingreso de ejemplo.
- **Explicación de Permisos**: Tarjeta lateral con resumen de roles y capacidades previstas (quién puede ver caja, quién puede modificar servicios, quién solo opera producción).

### 4.10. Módulo de Configuración (`/configuracion`)
- **Organización por Pestañas Temáticas**:
  - *General*: Nombre del negocio, RUC/DNI, teléfono de contacto y dirección.
  - *Horarios de Atención*: Días de atención y rangos horarios.
  - *Comprobantes y Tickets*: Personalización de encabezado y pie de ticket de entrega.
  - *Notificaciones*: Simulación de aviso por WhatsApp al estar el pedido "Listo".

### 4.11. Módulo de Suscripción (`/suscripcion`)
- **Tarjeta de Suscripción Actual**: Estado del plan, días de prueba restantes calculados visualmente con barra de progreso, fecha del primer cobro previsto e importe mensual en Soles.
- **Selector de Estados Demostrativos Mejorado**: Diseño de botones o selector estilizado que permite alternar entre "En prueba", "Activa", "Vencida" y "Cancelada" para previsualizar cómo reacciona la interfaz.
- **Condiciones y Botones Deshabilitados**: Políticas claras de no cobro en formulario propio, con botones "Registrar tarjeta (Próximamente)" y "Gestionar facturación" adecuadamente señalizados.

### 4.12. Panel de Superadministración (`/plataforma`)
- **Identidad Diferenciada**: Barra lateral con acentos índigo/violeta (`#4f46e5`) y título "LavaGest Platform Admin".
- **Métricas Globales SaaS**: Lavanderías activas totales, lavanderías en periodo de prueba, tasa de retención simulada y estado de los servicios.
- **Gestión de Negocios**: Tabla de lavanderías registradas con ID de tenant, nombre comercial, propietario, plan asignado, fecha de creación y estado de la cuenta.

---

## 5. Accesibilidad (a11y) y Estándares WCAG 2.1 AA

1. **Ratios de Contraste**: Todos los textos sobre fondos claros y oscuros cumplirán con un mínimo de 4.5:1 para texto normal y 3:1 para texto en negrita superior a 18px o controles gráficos.
2. **Navegación por Teclado Completa**:
   - `focus-visible` claramente identificable con anillo exterior (`focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`).
   - Salto al contenido principal (`.skip-link`) funcional en la landing page y en el dashboard.
   - Drawer móvil y modales atrapan el foco y se cierran con tecla `Escape`.
3. **Semántica ARIA**:
   - Tablas con `<caption>` accesibles vía clase `.sr-only`.
   - Botones interactivos con `aria-pressed`, `aria-expanded` y `aria-label` descriptivos.
   - Alertas dinámicas con `role="status"` o `role="alert"`.
4. **Preferencia de Movimiento Reducido**:
   - Todas las transiciones y microanimaciones envolverán sus efectos con `motion-reduce:transition-none` y `motion-reduce:transform-none`.

---

## 6. Plan de Implementación Progresiva (Fases de Ejecución)

Una vez obtenida la aprobación del usuario, la ejecución se llevará a cabo en las siguientes etapas secuenciales sin romper funcionalidades previas ni alterar el backend:

- **Paso 1: Fundamentos y Sistema de Componentes UI**
  - Configurar las variables temáticas en `src/app/globals.css`.
  - Crear biblioteca de componentes compartidos en `src/components/ui/` (`Button`, `Badge`, `Card`, `Table`, `Input`, `Select`, `Modal`, `EmptyState`).
  - Corregir los enlaces `<a>` por `<Link>` en `public-header.tsx` y `public-footer.tsx` para restablecer el build limpio (`npm run lint` y `npm run build`).

- **Paso 2: Rediseño del Layout y Navegación Principal**
  - Modernizar `AppShell` con sidebar responsivo, menú móvil hamburguesa accesible, header contextual enriquecido y perfil de usuario.
  - Implementar diferenciación estética para el panel de superadministrador.

- **Paso 3: Rediseño de la Página Pública y Planes**
  - Implementar los estilos completos de la landing page comercial, el preview de producto interactivo y la sección de planes en `/planes`.

- **Paso 4: Rediseño de Pantallas Operativas del Dashboard**
  - Transformar el Dashboard con KPIs y tabla interactiva.
  - Implementar las vistas ricas de Clientes, Pedidos, Servicios y el Tablero Kanban de Producción.
  - Diseñar las vistas demostrativas de Caja, Reportes, Empleados, Configuración y Suscripción.

- **Paso 5: Pulido de Autenticación y Formularios**
  - Estilizar `AuthCard` y `AuthForm` con estética SaaS de alta gama, conservando intactos todos los Server Actions y esquemas de validación existentes.

- **Paso 6: Verificación de Calidad y Pruebas**
  - Ejecutar `npm run typecheck`, `npm run lint`, `npm test` y `npm run build`.
  - Verificar visualmente en viewport de escritorio (1280px+), tablet (768px) y móvil (375px).

---

## 7. Compromiso de Seguridad y Límites Técnicos

- **Cero cambios destructivos**: No se modificaron esquemas de base de datos, políticas RLS, ni Server Actions de backend.
- **Datos de prueba transparentes**: Toda información operativa en clientes, pedidos, servicios, caja y producción continúa proviniendo de `src/lib/demo.ts` y mantiene avisos claros de datos demostrativos.
- **Suscripciones**: Ningún formulario solicita tarjetas bancarias ni simula cobros reales. Todo se mantiene alineado estrictamente a `docs/suscripciones.md` y `AGENTS.md`.

---

## 8. Resultados de Pruebas y Compilación (Etapa 5)

Las verificaciones ejecutadas en el entorno local confirman calidad de nivel de producción:

1. **`npm run typecheck` (`tsc --noEmit`)**:
   - **Resultado**: Exitoso (código 0). Cero errores de tipos en TypeScript 5.9 en todo el proyecto.
2. **`npm run lint` (`eslint .`)**:
   - **Resultado**: Exitoso (código 0). Cero errores y cero advertencias. Todos los enlaces internos usan `<Link>` de Next.js y los imports huérfanos fueron saneados.
3. **`npm test` (Suite de pruebas unitarias y RLS en PostgreSQL aislado)**:
   - **Resultado**: 22 de 22 pruebas superadas con éxito (0 fallos, 0 canceladas). Se verificaron las políticas RLS, el aislamiento multi-tenant, la expiración de sesiones y los esquemas de validación Zod.
4. **`npm run build` (`next build`)**:
   - **Resultado**: Compilación de producción exitosa (código 0). Todas las rutas estáticas y dinámicas compiladas y optimizadas correctamente (First Load JS shared: 103 kB).

---

## 9. Inventario de Archivos Modificados y Creados

### Componentes Creados:
- `src/components/ui/badge.tsx`: Componente `StatusBadge` con variantes semánticas de lavandería (recibido, en lavado, secado, listo, entregado, activo, vencida).
- `src/components/ui/metric-card.tsx`: Tarjetas KPI ejecutivas con contenedor de icono, cifras tabulares, chip de tendencia y notas descriptivas.
- `src/components/ui/empty-state.tsx`: Estados vacíos profesionales con icono, mensaje y llamada a la acción accesible.

### Archivos Modificados y Perfeccionados:
- `src/app/globals.css`: Sistema de tokens temáticos Tailwind CSS v4 (`@theme`), paleta "Aqua Pura & Slate Modern", clases de marketing bento-box, mockup interactivo y ajustes responsive.
- `src/components/ui/section.tsx`: Estructura enriquecida con subtítulos claros y ranura para botones de acción.
- `src/components/layout/public-header.tsx` y `public-footer.tsx`: Reemplazo de enlaces `<a>` por `<Link>` para cumplir con ESLint y Next.js.
- `src/components/layout/app-shell.tsx`: Barra lateral responsive moderna, drawer móvil accesible vía teclado con backdrop, topbar contextual con buscador y perfil de usuario.
- `src/components/forms/logout-form.tsx`: Estilo integrado al sidebar con icono `LogOut` y feedback `aria-busy`.
- `src/components/forms/auth-card.tsx`: Presentación de autenticación corporativa con rail lateral de marca.
- `src/components/forms/auth-form.tsx`: Soporte para alternar visibilidad de contraseña (`Eye` / `EyeOff`), indicador de campos requeridos y spinner de carga en envío.
- `src/app/page.tsx` y `src/app/planes/page.tsx`: Landing page comercial formateada, bento-grid de beneficios, acordeón FAQ y comparativa de planes comerciales.
- `src/app/(dashboard)/dashboard/page.tsx`: Centro de control del negocio con 4 KPIs, tabla filtrada de últimos pedidos y widget de capacidad de planta.
- `src/app/(dashboard)/clientes/page.tsx`: Directorio de clientes con buscador instantáneo, avatares y métricas.
- `src/app/(dashboard)/pedidos/page.tsx`: Estación de trabajo de pedidos con filtros por estado, búsqueda y modal de ticket demostrativo.
- `src/app/(dashboard)/servicios/page.tsx`: Catálogo de servicios con alternador entre tarjetas y tabla comparativa.
- `src/app/(dashboard)/produccion/page.tsx`: Tablero Kanban de 4 etapas con avance de pedidos en memoria.
- `src/app/(dashboard)/caja/page.tsx`: Panel ejecutivo con desglose de métodos de cobro, saldo y movimientos del turno.
- `src/app/(dashboard)/reportes/page.tsx`: Métricas de ticket promedio, horas punta y gráficos SVG nativos.
- `src/app/(dashboard)/empleados/page.tsx`: Directorio de colaboradores y matriz explicativa de roles y permisos RLS.
- `src/app/(dashboard)/configuracion/page.tsx`: Formularios categorizados de datos del negocio, horarios y tickets.
- `src/app/(dashboard)/suscripcion/page.tsx`: Panel SaaS Billing con barra de prueba de 14 días y simulador de estados.
- `src/app/(superadmin)/plataforma/**`: Páginas de superadministración diferenciadas con acento púrpura y métricas globales de plataforma.

---

## 10. Limitaciones y Pendientes (Fases Posteriores)

1. **Activación de Supabase Remoto (Fase 1B)**: Las credenciales remotas continúan pendientes de conexión; todo el código de seguridad e identidad está listo para enlazarse sin cambios en frontend.
2. **Persistencia Operativa (Fase 2+)**: Los módulos de clientes, pedidos, servicios, caja y producción operan en modo demostrativo con datos en memoria; en la fase operativa se conectarán a tablas reales con transacciones PostgreSQL.
3. **Pasarela de Pagos (Fase Suscripciones)**: La contratación real del servicio se realizará mediante integración externa con pasarela autorizada (Stripe / Mercado Pago / Niubiz), sin almacenar tarjetas en servidores propios.

