export type Membership = { tenant_id: string; role: "owner" | "worker" };

export function destinationForAccess(platformAdmin: boolean, membership: Membership | null) {
  if (platformAdmin) return "/plataforma";
  return membership ? "/dashboard" : "/crear-lavanderia";
}

export const privatePaths = ["/cuenta", "/dashboard", "/pedidos", "/clientes", "/servicios", "/produccion", "/caja", "/reportes", "/empleados", "/configuracion", "/suscripcion", "/plataforma", "/crear-lavanderia", "/nueva-contrasena"];
export function isPrivatePath(pathname: string) {
  return privatePaths.some(path => pathname === path || pathname.startsWith(path + "/"));
}
