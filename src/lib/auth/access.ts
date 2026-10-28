import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { destinationForAccess, type Membership } from "./policy";

export const getIdentity = cache(async () => {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error && (error.status === 0 || (error.status !== undefined && error.status >= 500))) return null;
    if (error || !data.user) return { supabase, user: null };
    return { supabase, user: data.user };
  } catch { return null; }
});

export async function requireIdentity() {
  const identity = await getIdentity();
  if (!identity) redirect("/acceso?estado=conexion");
  if (!identity.user) redirect("/login");
  return { supabase: identity.supabase, user: identity.user };
}

export const getAccess = cache(async () => {
  const { supabase, user } = await requireIdentity();
  const [admin, membership] = await Promise.all([
    supabase.from("platform_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase.from("memberships").select("tenant_id,role").eq("user_id", user.id).order("tenant_id").limit(1).maybeSingle(),
  ]);
  if (admin.error || membership.error) redirect("/acceso?estado=esquema");
  const row = membership.data;
  if (row && row.role !== "owner" && row.role !== "worker") redirect("/acceso?estado=permiso");
  return { supabase, user, platformAdmin: Boolean(admin.data), membership: row as Membership | null };
});

export async function requireTenant() {
  const access = await getAccess();
  if (!access.membership) redirect(destinationForAccess(access.platformAdmin, null));
  const { data: tenant, error } = await access.supabase.from("tenants").select("id,name").eq("id", access.membership.tenant_id).single();
  if (error || !tenant) redirect("/acceso?estado=permiso");
  return { ...access, membership: access.membership, tenant };
}

export async function requirePlatformAdmin() {
  const access = await getAccess();
  if (!access.platformAdmin) redirect("/acceso?estado=permiso");
  return access;
}

export async function requireOwner() {
  const access = await requireTenant();
  if (access.membership.role !== "owner") redirect("/acceso?estado=permiso");
  return access;
}
