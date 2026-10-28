import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAppOrigin, getSupabaseEnv } from "@/lib/supabase/env";
import { isPrivatePath } from "@/lib/auth/policy";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const redirectTo = (path: string) => {
    const redirected = NextResponse.redirect(new URL(path, request.url));
    response.cookies.getAll().forEach(cookie => redirected.cookies.set(cookie));
    redirected.headers.set("Cache-Control", "private, no-store");
    redirected.headers.set("Referrer-Policy", "no-referrer");
    redirected.headers.set("Pragma", "no-cache");
    redirected.headers.set("Expires", "0");
    return redirected;
  };
  try {
    const { url, key } = getSupabaseEnv();
    const supabase = createServerClient(url, key, {
      cookieOptions: { sameSite: "lax", secure: getAppOrigin().startsWith("https:") },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values, headers) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    });
    // getUser valida con Auth, también tras revocar una sesión. No confiar en getSession.
    const { data, error } = await supabase.auth.getUser();
    if (isPrivatePath(request.nextUrl.pathname) && error && (error.status === 0 || (error.status !== undefined && error.status >= 500))) return redirectTo("/acceso?estado=conexion");
    if (isPrivatePath(request.nextUrl.pathname) && (error || !data.user)) return redirectTo("/login");
  } catch {
    if (isPrivatePath(request.nextUrl.pathname)) return redirectTo("/acceso?estado=conexion");
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = {
  matcher: ["/cuenta/:path*", "/dashboard/:path*", "/pedidos/:path*", "/clientes/:path*", "/servicios/:path*", "/produccion/:path*", "/caja/:path*", "/reportes/:path*", "/empleados/:path*", "/configuracion/:path*", "/suscripcion/:path*", "/plataforma/:path*", "/crear-lavanderia/:path*", "/nueva-contrasena/:path*", "/login", "/registro", "/recuperar-contrasena", "/auth/:path*", "/acceso"],
};
