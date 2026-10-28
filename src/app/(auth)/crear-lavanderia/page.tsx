import { LogoutForm } from "@/components/forms/logout-form";
import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";
import { destinationForAccess } from "@/lib/auth/policy";
import { AuthCard } from "@/components/forms/auth-card";
import { AuthForm } from "@/components/forms/auth-form";
import { createBusinessAction } from "../actions";
export default async function CreateLaundry() {
  const access = await getAccess();
  if (access.membership || access.platformAdmin) redirect(destinationForAccess(access.platformAdmin, access.membership));
  const metadata = access.user.user_metadata;
  const initial = (key: string, max = 120) => typeof metadata[key] === "string" ? metadata[key].slice(0, max) : "";
  return <AuthCard title="Crea tu lavandería" description="Confirma los datos del negocio. El propietario se obtiene de tu sesión; no se activarán suscripciones.">
    <AuthForm action={createBusinessAction} submitLabel="Crear lavandería" fields={[
      { name: "ownerName", label: "Nombre del propietario", autoComplete: "name", defaultValue: initial("full_name") },
      { name: "businessName", label: "Nombre de la lavandería", autoComplete: "organization", defaultValue: initial("business_name") },
      { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", maxLength: 25, defaultValue: initial("phone", 25) },
      { name: "address", label: "Dirección (opcional)", required: false, autoComplete: "street-address", maxLength: 300, defaultValue: initial("address", 300) },
    ]} />
    <LogoutForm />
  </AuthCard>;
}
