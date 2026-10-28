import { LogoutForm } from "@/components/forms/logout-form";
import { AuthCard } from "@/components/forms/auth-card";

export default async function Access({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const messages: Record<string, string> = {
    conexion: "No pudimos verificar la sesión. Comprueba la conexión y la configuración del servidor.",
    esquema: "No pudimos verificar el acceso a tu cuenta. Contacta con el administrador de LavaGest antes de continuar.",
    permiso: "Tu cuenta no tiene los permisos necesarios para acceder a esta sección.",
    salida: "No se pudo confirmar el cierre de sesión. Vuelve a intentarlo cuando se restablezca la conexión.",
  };
  return <AuthCard title="Acceso no disponible" description={messages[estado ?? ""] ?? "No se pudo autorizar el acceso solicitado."}>
    <p>No se mostrarán datos de negocios sin una autorización válida.</p>
    <LogoutForm />
  </AuthCard>;
}
