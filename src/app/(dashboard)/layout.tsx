import { AppShell } from "@/components/layout/app-shell";
import { requireTenant } from "@/lib/auth/access";
export const dynamic = "force-dynamic";
export default async function Layout({children}:{children:React.ReactNode}) {
  const access = await requireTenant();
  return <AppShell businessName={access.tenant.name} role={access.membership.role} canAccessPlatform={access.platformAdmin}>{children}</AppShell>;
}
