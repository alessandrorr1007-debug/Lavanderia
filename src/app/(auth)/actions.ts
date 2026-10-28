"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAppOrigin } from "@/lib/supabase/env";
import { requireIdentity } from "@/lib/auth/access";
import { createRecoveryGrant, RECOVERY_COOKIE, verifyRecoveryGrant } from "@/lib/auth/recovery";
import { businessSchema, confirmationSchema, loginSchema, passwordSchema, recoverySchema, registrationSchema, validationState, type ActionState } from "@/lib/auth/validation";

const connectionError: ActionState = { message: "No pudimos completar la solicitud. Comprueba la conexión y vuelve a intentarlo." };
function authError(code?: string, status?: number): ActionState {
  if (status === 0 || (status !== undefined && status >= 500)) return connectionError;
  if (code === "weak_password") return { message: "La contraseña no cumple los requisitos de seguridad del servicio. Utiliza una contraseña más larga y diferente." };
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit") return { message: "Se alcanzó el límite de intentos. Espera unos minutos antes de volver a intentar." };
  if (code === "email_not_confirmed") return { message: "Confirma tu correo antes de iniciar sesión." };
  return { message: "No se pudo completar la solicitud. Revisa tus datos o utiliza la recuperación de contraseña." };
}

export async function loginAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationState(parsed.error);
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return authError(error.code, error.status);
  } catch { return connectionError; }
  revalidatePath("/", "layout");
  redirect("/cuenta");
}

export async function registerAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationState(parsed.error);
  let hasSession = false;
  try {
    const supabase = await getSupabaseServerClient();
    const { email, password, ownerName, businessName, phone, address } = parsed.data;
    const { data, error } = await supabase.auth.signUp({ email, password, options: {
      emailRedirectTo: getAppOrigin() + "/auth/confirm",
      // Solo presentación: ningún permiso se deriva de user_metadata.
      data: { full_name: ownerName, business_name: businessName, phone, address },
    } });
    if (error && error.code !== "user_already_exists" && error.code !== "email_exists") return authError(error.code, error.status);
    hasSession = Boolean(data.session);
  } catch { return connectionError; }
  if (hasSession) { revalidatePath("/", "layout"); redirect("/cuenta"); }
  return { success: true, message: "Si el correo puede registrarse, recibirás las instrucciones de confirmación. Si ya tienes cuenta, inicia sesión o recupera tu contraseña. Aún no se ha creado una lavandería." };
}

export async function recoverAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = recoverySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationState(parsed.error);
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: getAppOrigin() + "/auth/confirm" });
    if (error) return authError(error.code, error.status);
  } catch { return connectionError; }
  return { success: true, message: "Si existe una cuenta asociada, recibirás las instrucciones por correo. Revisa también spam. El enlace será de un solo uso." };
}

export async function confirmAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = confirmationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { message: "El enlace no es válido. Solicita uno nuevo." };
  const { type, tokenHash } = parsed.data;
  try {
    const secret = process.env.AUTH_RECOVERY_SECRET ?? "";
    if (type === "recovery" && secret.length < 64) return connectionError;
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error || !data.user || !data.session) return { message: "El enlace venció, ya se utilizó o no es válido. Solicita uno nuevo." };
    const store = await cookies();
    store.delete(RECOVERY_COOKIE);
    if (type === "recovery") {
      const { data: verified, error: claimsError } = await supabase.auth.getClaims(data.session.access_token);
      const sessionId = verified?.claims.session_id;
      if (claimsError || typeof sessionId !== "string") return connectionError;
      store.set(RECOVERY_COOKIE, createRecoveryGrant(data.user.id, sessionId, secret), {
        httpOnly: true, sameSite: "lax", secure: getAppOrigin().startsWith("https:"), path: "/", maxAge: 600,
      });
    }
  } catch { return connectionError; }
  revalidatePath("/", "layout");
  redirect(type === "recovery" ? "/nueva-contrasena" : "/cuenta");
}

export async function changePasswordAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = passwordSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationState(parsed.error);
  const { supabase, user } = await requireIdentity();
  try {
    const { data, error } = await supabase.auth.getClaims();
    const sessionId = data?.claims.session_id;
    const store = await cookies();
    if (error || typeof sessionId !== "string" || !verifyRecoveryGrant(store.get(RECOVERY_COOKIE)?.value, user.id, sessionId, process.env.AUTH_RECOVERY_SECRET ?? "")) {
      return { message: "La recuperación no es válida o venció. Solicita un nuevo enlace." };
    }
    const updated = await supabase.auth.updateUser({ password: parsed.data.password });
    if (updated.error) return authError(updated.error.code, updated.error.status);
    store.delete(RECOVERY_COOKIE);
    const signedOut = await supabase.auth.signOut({ scope: "local" });
    if (signedOut.error) return { success: true, message: "Contraseña actualizada. No se pudo confirmar el cierre de sesión; utiliza Cerrar sesión y vuelve a entrar." };
  } catch { return connectionError; }
  revalidatePath("/", "layout");
  redirect("/login?actualizada=1");
}

export async function createBusinessAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = businessSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationState(parsed.error);
  const { supabase, user } = await requireIdentity();
  if (!user.email_confirmed_at) return { message: "Debes confirmar tu correo antes de crear la lavandería." };
  try {
    const { businessName, ownerName, phone, address } = parsed.data;
    // El RPC obtiene auth.uid(); nunca recibe tenant_id, user_id ni role del cliente.
    const { error } = await supabase.rpc("create_laundry", { p_business_name: businessName, p_owner_name: ownerName, p_phone: phone, p_address: address });
    if (error) return { message: "No pudimos crear la lavandería. Intenta nuevamente o contacta al administrador. No se activó ninguna suscripción." };
  } catch { return connectionError; }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  let failed = false;
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    failed = Boolean(error);
    if (!error) (await cookies()).delete(RECOVERY_COOKIE);
  } catch { failed = true; }
  if (failed) redirect("/acceso?estado=salida");
  revalidatePath("/", "layout");
  redirect("/login?salida=1");
}
