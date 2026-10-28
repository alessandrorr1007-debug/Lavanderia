import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { confirmationSchema } from "@/lib/auth/validation";
import { confirmAction } from "../../actions";
export default async function Confirm({ searchParams }: { searchParams: Promise<{ token_hash?: string; type?: string }> }) {
  const params = await searchParams;
  const parsed = confirmationSchema.safeParse({ tokenHash: params.token_hash, type: params.type });
  return <AuthCard title="Confirma tu solicitud" description={parsed.success ? "Continúa para validar el enlace. No compartas esta dirección." : "El enlace no es válido. Solicita uno nuevo."}>
    {parsed.success && <AuthForm action={confirmAction} submitLabel={parsed.data.type === "recovery" ? "Continuar recuperación" : "Confirmar correo"} fields={[
      { name: "tokenHash", label: "Token", type: "hidden", defaultValue: parsed.data.tokenHash },
      { name: "type", label: "Tipo", type: "hidden", defaultValue: parsed.data.type },
    ]} />}
  </AuthCard>;
}
