import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { recoverAction } from "../actions";
export default function Recovery() {
  return <AuthCard title="Recuperar contraseña" description="Te enviaremos las instrucciones si existe una cuenta asociada al correo.">
    <AuthForm action={recoverAction} submitLabel="Solicitar recuperación" fields={[
      { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", maxLength: 254 },
    ]} />
  </AuthCard>;
}
