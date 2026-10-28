import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { loginAction } from "../actions";
export default async function Login({ searchParams }: { searchParams: Promise<{ actualizada?: string; salida?: string }> }) {
  const params = await searchParams;
  return <AuthCard title="Acceso a LavaGest" description="Inicia sesión con tu cuenta. Los permisos se verifican en el servidor.">
    {params.actualizada === "1" && <p className="notice" role="status">Contraseña actualizada. Inicia sesión nuevamente.</p>}
    {params.salida === "1" && <p className="notice" role="status">Sesión cerrada.</p>}
    <AuthForm action={loginAction} submitLabel="Iniciar sesión" fields={[
      { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", maxLength: 254 },
      { name: "password", label: "Contraseña", type: "password", autoComplete: "current-password" },
    ]} />
  </AuthCard>;
}
