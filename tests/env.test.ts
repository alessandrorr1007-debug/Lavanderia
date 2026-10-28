import test from "node:test";
import assert from "node:assert/strict";
import { getAppOrigin, getSupabaseEnv } from "../src/lib/supabase/env";

test("variables inválidas fallan sin revelar valores", t => {
  const names = ["APP_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] as const;
  const previous = names.map(name => process.env[name]);
  t.after(() => names.forEach((name, index) => { if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index]; }));
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://fixture.supabase.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fixture_no_real_credentials";
  assert.equal(getSupabaseEnv().url, "https://fixture.supabase.invalid");
  for (const value of ["", "sb_secret_fixture_no_real_credentials", "service_role_fixture"]) {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = value;
    assert.throws(getSupabaseEnv, error => error instanceof Error && !error.message.includes(value || "fixture"));
  }
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fixture_no_real_credentials";
  for (const value of ["http://external.example.invalid", "https://user:pass@example.invalid", "https://fixture.supabase.invalid/path"]) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = value;
    assert.throws(getSupabaseEnv);
  }
  process.env.APP_URL = "http://127.0.0.1:3000";
  assert.equal(getAppOrigin(), "http://127.0.0.1:3000");
  for (const value of ["https://app.example.invalid/path", "javascript:alert(1)", "https://user:pass@app.example.invalid"]) {
    process.env.APP_URL = value;
    assert.throws(getAppOrigin);
  }
});
