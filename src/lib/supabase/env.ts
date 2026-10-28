import { z } from "zod";

export function getSupabaseEnv() {
  const url = z.url().safeParse(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url.success || !key?.startsWith("sb_publishable_") || key.length < 25) {
    throw new Error("La conexión de autenticación no está configurada correctamente.");
  }
  const parsed = new URL(url.data);
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("La URL de autenticación debe ser un origen sin credenciales ni rutas.");
  }
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
    throw new Error("La conexión de autenticación requiere HTTPS.");
  }
  return { url: parsed.origin, key };
}

export function getAppOrigin() {
  const result = z.url().safeParse(process.env.APP_URL);
  if (!result.success) throw new Error("Configura APP_URL en el servidor.");
  const url = new URL(result.data);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("APP_URL requiere HTTPS fuera del entorno local.");
  }
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("APP_URL debe contener únicamente el origen de la aplicación.");
  }
  return url.origin;
}
