import { AppShell } from "@/components/layout/app-shell";
import { requirePlatformAdmin } from "@/lib/auth/access";
export const dynamic = "force-dynamic";
export default async function Layout({children}:{children:React.ReactNode}) {
  await requirePlatformAdmin();
  return <AppShell superadmin>{children}</AppShell>;
}
