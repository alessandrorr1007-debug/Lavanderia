"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function getSupabaseBrowserClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key, { cookieOptions: { sameSite: "lax", secure: typeof window !== "undefined" && window.location.protocol === "https:" } });
}
