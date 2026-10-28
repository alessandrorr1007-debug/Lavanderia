import { requireOwner } from "@/lib/auth/access";
export default async function Layout({children}:{children:React.ReactNode}) { await requireOwner(); return children; }
