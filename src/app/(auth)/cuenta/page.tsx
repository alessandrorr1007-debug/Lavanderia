import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";
import { destinationForAccess } from "@/lib/auth/policy";
export default async function Account() {
  const access = await getAccess();
  redirect(destinationForAccess(access.platformAdmin, access.membership));
}
