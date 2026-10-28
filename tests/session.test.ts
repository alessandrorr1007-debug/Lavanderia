import { createServerClient, type CookieOptions } from "@supabase/ssr";
import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";

const user = { id: "00000000-0000-4000-8000-000000000099", aud: "authenticated", role: "authenticated", email: "fixture@example.invalid", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" };
function jwt(exp: number) {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return encode({ alg: "HS256", typ: "JWT" }) + "." + encode({ sub: user.id, exp, session_id: "fixture-session", role: "authenticated" }) + ".fixture-signature";
}
function session(expired = false) {
  const exp = Math.floor(Date.now() / 1000) + (expired ? -60 : 3600);
  return { access_token: jwt(exp), refresh_token: "fixture-refresh-token", token_type: "bearer", expires_in: expired ? -60 : 3600, expires_at: exp, user };
}

test("SSR: login, sesión por cookies, renovación y cierre (transporte simulado)", async () => {
  const jar = new Map<string, string>();
  const writes: { name: string; value: string; options: CookieOptions }[] = [];
  let refreshes = 0;
  let logouts = 0;
  let expiredLogin = false;
  const makeClient = () => createServerClient("https://fixture.supabase.invalid", "sb_publishable_fixture_no_real_credentials", {
    cookieOptions: { sameSite: "lax", secure: true },
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll(values) {
        for (const cookie of values) {
          writes.push(cookie);
          if (!cookie.value || cookie.options.maxAge === 0) jar.delete(cookie.name);
          else jar.set(cookie.name, cookie.value);
        }
      },
    },
    global: { fetch: async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/token")) {
        const body = JSON.parse(String(init?.body));
        if (url.searchParams.get("grant_type") === "refresh_token") {
          assert.equal(body.refresh_token, "fixture-refresh-token");
          refreshes++;
          return Response.json(session());
        }
        if (body.password === "incorrecta") return Response.json({ code: "invalid_credentials", msg: "Invalid login credentials" }, { status: 400 });
        return Response.json(session(expiredLogin));
      }
      if (url.pathname.endsWith("/user")) return Response.json(user);
      if (url.pathname.endsWith("/logout")) { logouts++; return new Response(null, { status: 204 }); }
      throw new Error("Solicitud inesperada en fixture");
    } },
  });
  const invalid = await makeClient().auth.signInWithPassword({ email: user.email, password: "incorrecta" });
  assert.ok(invalid.error);
  assert.equal(jar.size, 0);
  const signedIn = await makeClient().auth.signInWithPassword({ email: user.email, password: "fixture-password" });
  assert.equal(signedIn.error, null);
  assert.ok(jar.size > 0);
  assert.ok(writes.some(cookie => cookie.options.sameSite === "lax" && cookie.options.secure));
  assert.equal((await makeClient().auth.getUser()).data.user?.id, user.id);
  const signedOut = await makeClient().auth.signOut({ scope: "local" });
  assert.equal(signedOut.error, null);
  assert.equal(logouts, 1);
  assert.equal(jar.size, 0);
  assert.ok((await makeClient().auth.getUser()).error);

  expiredLogin = true;
  await makeClient().auth.signInWithPassword({ email: user.email, password: "fixture-password" });
  const before = writes.length;
  assert.equal((await makeClient().auth.getUser()).data.user?.id, user.id);
  assert.equal(refreshes, 1);
  assert.ok(writes.length > before);
});

test("middleware no acepta una identidad o rol falsificados en cookies", async t => {
  const prior = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, app: process.env.APP_URL, fetch: globalThis.fetch };
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://fixture.supabase.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fixture_no_real_credentials";
  process.env.APP_URL = "https://app.example.invalid";
  globalThis.fetch = async () => Response.json({ code: "bad_jwt", msg: "Invalid token" }, { status: 401 });
  t.after(() => {
    for (const [key, value] of [["NEXT_PUBLIC_SUPABASE_URL", prior.url], ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", prior.key], ["APP_URL", prior.app]]) {
      if (value === undefined) delete process.env[key!]; else process.env[key!] = value;
    }
    globalThis.fetch = prior.fetch;
  });
  const absent = await middleware(new NextRequest("https://app.example.invalid/dashboard"));
  assert.equal(absent.status, 307);
  assert.equal(new URL(absent.headers.get("location")!).pathname, "/login");
  assert.match(absent.headers.get("cache-control")!, /no-store/);
  const forged = { ...session(), user: { ...user, user_metadata: { role: "platform_admin" } } };
  const encoded = "base64-" + Buffer.from(JSON.stringify(forged)).toString("base64url");
  const response = await middleware(new NextRequest("https://app.example.invalid/plataforma", { headers: { cookie: "sb-fixture-auth-token=" + encoded } }));
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location")!).pathname, "/login");
  globalThis.fetch = async () => Response.json({ msg: "Temporalmente indisponible" }, { status: 503 });
  const unavailable = await middleware(new NextRequest("https://app.example.invalid/dashboard", { headers: { cookie: "sb-fixture-auth-token=" + encoded } }));
  assert.equal(new URL(unavailable.headers.get("location")!).pathname, "/acceso");
  assert.equal(unavailable.cookies.getAll().length, 0);
  globalThis.fetch = async () => Response.json({ error_code: "session_not_found", msg: "Session revoked" }, { status: 403 });
  const revoked = await middleware(new NextRequest("https://app.example.invalid/plataforma", { headers: { cookie: "sb-fixture-auth-token=" + encoded } }));
  assert.equal(revoked.status, 307);
  assert.ok(revoked.cookies.getAll().some(cookie => cookie.name.startsWith("sb-fixture-auth-token") && cookie.value === ""));
});
