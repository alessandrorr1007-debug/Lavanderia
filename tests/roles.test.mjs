import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
test("se documentan los roles y el aislamiento",()=>{const docs=readFileSync("docs/roles-permisos.md","utf8");assert.match(docs,/platform_admin/);assert.match(docs,/tenant/)});
test("no se incluye clave secreta de Supabase en ejemplo",()=>{const env=readFileSync(".env.example","utf8");assert.doesNotMatch(env,/^SUPABASE_SERVICE_ROLE_KEY=/m)});
