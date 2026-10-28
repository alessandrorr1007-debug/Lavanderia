# Autenticación — Fase 1A

## Implementación

Next.js 15 App Router conserva su arquitectura. `@supabase/ssr` crea un cliente por solicitud en servidor y un cliente de navegador compatible con cookies. Las acciones de servidor realizan registro, login, recuperación, confirmación, cambio de contraseña y logout; no hay rutas demo que concedan sesión.

`src/middleware.ts` actualiza las cookies de petición/respuesta antes del render. Usa `getUser()` contra Auth para validar identidad y sesiones revocadas, no confía en el usuario de `getSession()`. Conserva cookies también al redirigir y marca las respuestas privadas como no almacenables. Los layouts vuelven a comprobar membresías y roles en servidor; middleware por sí solo no concede permisos. El cliente de navegador está disponible para integraciones posteriores, pero los formularios de esta fase ejecutan sus operaciones en servidor.

Variables: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY son configuración pública; APP_URL fija el origen confiable del servidor, sin depender del Host de la petición; AUTH_RECOVERY_SECRET firma exclusivamente la autorización temporal de recuperación. Los valores reales solo están en .env.local, ignorado por Git. No se usa service_role. No copiar claves ni tokens a informes o logs.

Las cookies Supabase usan SameSite=Lax y Secure con HTTPS. No se marca HttpOnly a esas cookies porque el cliente oficial de navegador necesita acceder a ellas; la autorización sigue verificándose en servidor y BD. La cookie adicional de recuperación sí es HttpOnly, está firmada, vinculada a usuario y session_id, y vence en diez minutos. El servidor requiere HTTPS fuera de localhost/127.0.0.1.

## Flujos

1. `/registro` valida propietario, nombre de lavandería, email, teléfono, dirección opcional y contraseña de 12 a 128 caracteres con confirmación. Registra únicamente la cuenta Auth. Los datos de presentación en user_metadata no conceden ningún rol ni se confían al crear el negocio sin validarlos otra vez.
2. Con Confirm Email habilitado no se anuncia sesión activa. El mensaje de registro es genérico tanto para cuentas existentes como nuevas; la unicidad de email la impone Auth. No se consulta un directorio de correos para detectar duplicados.
3. `/auth/confirm` recibe token_hash y type=email o recovery. GET solo presenta la confirmación: la verificación se realiza por POST mediante Server Action, para evitar que una previsualización del correo consuma el enlace. No acepta redirecciones arbitrarias.
4. `/login` usa signInWithPassword y redirige a `/cuenta`. Allí se consulta la BD: administrador de plataforma a `/plataforma`, miembro a `/dashboard`, usuario sin membresía a `/crear-lavanderia`. Si el esquema falla, se muestra `/acceso` y no se abre el panel.
5. `/crear-lavanderia` confirma datos y llama a create_laundry con cuatro campos de negocio. La identidad proviene de auth.uid(), no del formulario. No hay alta de suscripción ni prueba gratuita.
6. `/recuperar-contrasena` solicita un correo sin revelar si existe la cuenta. Después de verificar un OTP de tipo recovery se firma la autorización temporal. `/nueva-contrasena` y su acción exigen usuario validado y autorización de recuperación válida para esa misma sesión. Una sesión normal no basta para este formulario.
7. Tras cambiar la contraseña se elimina la autorización temporal y se cierra la sesión local. Logout solicita a Auth revocar la sesión correspondiente, elimina sus cookies y redirige al login; si falla no se anuncia éxito. Otras sesiones no se cierran automáticamente. Los JWT ya emitidos pueden conservar validez hasta su expiración; no confundir revocación de refresh tokens con invalidación instantánea universal.

Los formularios presentan errores por campo, estado de carga y bloqueo durante el envío; no devuelven contraseñas en el estado del formulario. Server Actions conservan la verificación de origen de Next.js. La recuperación evita privilegios derivados de un parámetro de URL controlado por el navegador.

## Configuración pendiente en Supabase (no realizada)

- Mantener Email habilitado y Confirm Email activado; configurar un mínimo de 12 caracteres para las contraseñas y comprobar límites y SMTP antes de probar envíos.
- Site URL debe coincidir con APP_URL local (el origen configurado en .env.local). No mezclar localhost con 127.0.0.1 entre login y enlaces.
- Añadir ese mismo origen seguido de `/auth/confirm` a Redirect URLs. Antes de cualquier despliegue, aprobar el origen HTTPS y actualizar las listas explícitas; no usar comodines de producción.
- Plantilla Confirm signup, enlace: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
- Plantilla Reset password, enlace: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`.
- La implementación usa estos enlaces token_hash verificados en servidor. No implementa OAuth ni un callback genérico para cualquier código PKCE. Las plantillas predeterminadas deben revisarse antes del ensayo real.
- Revisar políticas, funciones y tablas existentes antes de aplicar las migraciones. El primer platform_admin se asigna únicamente mediante una operación administrativa explícita de BD, nunca mediante registro o metadatos; esa asignación no se ejecutó.
- Configurar límites de Auth y protección frente a abuso/captcha según el entorno, sin sustituirlos por el botón deshabilitado del frontend.

## Verificación y límites

Las pruebas locales cubren validación, roles, firmas temporales, cookies SSR, renovación y cierre mediante transporte simulado, middleware frente a cookies falsificadas y RLS PostgreSQL aislado. No prueban el SMTP ni representan un login real contra el proyecto remoto. No se crearon usuarios ni enviaron correos remotos. Registro, recepción de correo, OTP, recuperación y alta reales de extremo a extremo siguen pendientes de configuración y autorización.

Referencias oficiales consultadas: [clientes SSR y cookies](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [contraseñas](https://supabase.com/docs/guides/auth/passwords) y [autenticación en Next.js](https://nextjs.org/docs/app/guides/authentication). Se usa middleware.ts porque el proyecto conserva Next.js 15.
