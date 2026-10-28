import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { registerAction } from "../actions";
export default function Register() {
  return <AuthCard title="Crea tu cuenta" description="Primero confirma tu cuenta. Después podrás crear la lavandería. Este registro no activa planes ni pruebas gratuitas.">
    <AuthForm action={registerAction} submitLabel="Crear cuenta" fields={[
      { name: "ownerName", label: "Nombre del propietario", autoComplete: "name" },
      { name: "businessName", label: "Nombre de la lavandería", autoComplete: "organization" },
      { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", maxLength: 254 },
      { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", maxLength: 25 },
      { name: "address", label: "Dirección (opcional)", autoComplete: "street-address", required: false, maxLength: 300 },
      { name: "password", label: "Contraseña (12 a 128 caracteres)", type: "password", autoComplete: "new-password", minLength: 12 },
      { name: "confirmPassword", label: "Repite la contraseña", type: "password", autoComplete: "new-password", minLength: 12 },
    ]} />
  </AuthCard>;
}
