import { cookies } from "next/headers";
import { requireIdentity } from "@/lib/auth/access";
import { RECOVERY_COOKIE, verifyRecoveryGrant } from "@/lib/auth/recovery";
import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { changePasswordAction } from "../actions";
export default async function NewPassword() {
  const { supabase, user } = await requireIdentity();
  const { data, error } = await supabase.auth.getClaims();
  const sessionId = data?.claims.session_id;
  const valid = !error && typeof sessionId === "string" && verifyRecoveryGrant((await cookies()).get(RECOVERY_COOKIE)?.value, user.id, sessionId, process.env.AUTH_RECOVERY_SECRET ?? "");
  return <AuthCard title="Nueva contraseña" description={valid ? "Elige una contraseña nueva. Al guardarla se cerrará esta sesión." : "El enlace de recuperación no es válido o venció. Solicita uno nuevo."}>
    {valid && <AuthForm action={changePasswordAction} submitLabel="Guardar contraseña" fields={[
      { name: "password", label: "Contraseña (12 a 128 caracteres)", type: "password", autoComplete: "new-password", minLength: 12 },
      { name: "confirmPassword", label: "Repite la contraseña", type: "password", autoComplete: "new-password", minLength: 12 },
    ]} />}
  </AuthCard>;
}
