import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAppOrigin, getSupabaseEnv } from "./env";

export async function getSupabaseServerClient() {
  const store = await cookies();
  const { url, key } = getSupabaseEnv();
  return createServerClient(url, key, {
    cookieOptions: { sameSite: "lax", secure: getAppOrigin().startsWith("https:") },
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        // Server Components no pueden escribir cookies; middleware renueva antes.
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* En acciones y handlers las escrituras sí están permitidas. */ }
      },
    },
  });
}
