import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const a = "00000000-0000-4000-8000-000000000001";
const b = "00000000-0000-4000-8000-000000000002";
const worker = "00000000-0000-4000-8000-000000000003";
const unconfirmed = "00000000-0000-4000-8000-000000000004";
const atomic = "00000000-0000-4000-8000-000000000005";

test("RLS y alta transaccional en PostgreSQL aislado (sin conexión remota)", async t => {
  const db = new PGlite();
  try {
    await db.exec(readFileSync("tests/fixtures/auth.sql", "utf8"));
    // gen_random_uuid es nativo en este PostgreSQL. PGlite no incluye pgcrypto.
    const initial = readFileSync("supabase/migrations/202610280001_initial.sql", "utf8").replace("create extension if not exists pgcrypto;", "");
    await db.exec(initial);
    await db.exec(readFileSync("supabase/migrations/202610280002_auth_identity.sql", "utf8"));
    for (const id of [a, b, worker, atomic]) await db.query("insert into auth.users values ($1, now())", [id]);
    await db.query("insert into auth.users values ($1, null)", [unconfirmed]);
    async function asUser(id: string) {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
      await db.exec("set role authenticated");
    }
    async function create(name = "Lavandería", owner = "Propietario") {
      return (await db.query<{ id: string }>("select public.create_laundry($1,$2,$3,$4) as id", [name, owner, "999111222", "Lima"])).rows[0].id;
    }
    await asUser(a);
    const tenantA = await create("Lavandería A", "Dueño A");
    await asUser(b);
    const tenantB = await create("Lavandería B", "Dueño B");
    await db.exec("reset role");
    await db.query("insert into public.memberships values($1,$2,'worker')", [tenantA, worker]);
    await db.query("insert into public.platform_admins(user_id) values($1)", [a]);

    await t.test("propietario ve solo su tenant, perfil y membresía", async () => {
      await asUser(a);
      assert.deepEqual((await db.query("select id from public.tenants")).rows, [{ id: tenantA }]);
      assert.deepEqual((await db.query("select id from public.profiles")).rows, [{ id: a }]);
      assert.equal((await db.query("select * from public.memberships")).rows.length, 1);
      assert.equal((await db.query("select * from public.tenants where id=$1", [tenantB])).rows.length, 0);
      assert.equal((await db.query("select * from public.profiles where id=$1", [b])).rows.length, 0);
    });
    await t.test("tenant B tampoco puede leer tenant A", async () => {
      await asUser(b);
      assert.deepEqual((await db.query("select id from public.tenants")).rows, [{ id: tenantB }]);
      assert.equal((await db.query("select * from public.memberships where tenant_id=$1", [tenantA])).rows.length, 0);
    });
    await t.test("trabajador solo ve su lavandería y no escala su rol", async () => {
      await asUser(worker);
      assert.deepEqual((await db.query("select id from public.tenants")).rows, [{ id: tenantA }]);
      await assert.rejects(db.query("update public.memberships set role='owner' where user_id=$1", [worker]), /permission denied/i);
      await assert.rejects(db.query("insert into public.memberships values($1,$2,'owner')", [tenantB, worker]), /permission denied/i);
    });
    await t.test("no se permite mutar otro tenant ni crear tenants por REST directo", async () => {
      await asUser(a);
      await assert.rejects(db.query("update public.tenants set name='Intrusión' where id=$1", [tenantB]), /permission denied/i);
      await assert.rejects(db.query("delete from public.tenants where id=$1", [tenantB]), /permission denied/i);
      await assert.rejects(db.query("insert into public.tenants(name) values('Otro negocio')"), /permission denied/i);
      await assert.rejects(db.query("update public.profiles set full_name='Intrusión' where id=$1", [b]), /permission denied/i);
    });
    await t.test("administración de plataforma separada, sin acceso global a tenants", async () => {
      await asUser(b);
      assert.equal((await db.query("select * from public.platform_admins")).rows.length, 0);
      await assert.rejects(db.query("insert into public.platform_admins(user_id) values($1)", [b]), /permission denied/i);
      await asUser(a);
      assert.equal((await db.query("select * from public.platform_admins")).rows.length, 1);
      assert.deepEqual((await db.query("select id from public.tenants")).rows, [{ id: tenantA }]);
    });
    await t.test("alta idempotente no duplica perfil, lavandería ni propietario", async () => {
      await asUser(a);
      assert.equal(await create("Reintento"), tenantA);
      assert.equal((await db.query("select * from public.tenants")).rows.length, 1);
      assert.equal((await db.query("select * from public.profiles")).rows.length, 1);
      assert.equal((await db.query("select * from public.memberships")).rows.length, 1);
    });
    await t.test("usuario sin confirmar no puede dar de alta una lavandería", async () => {
      await asUser(unconfirmed);
      await assert.rejects(create(), /Cuenta confirmada requerida/);
    });
    await t.test("validación SQL rechaza datos que evaden el formulario", async () => {
      await asUser(atomic);
      await assert.rejects(create("x"), /inválidos/);
      await assert.rejects(db.query("select public.create_laundry('Negocio','Persona','.......','')"), /inválidos/);
      await assert.rejects(db.query("select public.create_laundry('Negocio','Persona','999111222',null)"), /inválidos/);
      await assert.rejects(db.query("select public.create_laundry('Negocio','Persona','999111222','',$1)", [tenantA]), /does not exist/);
    });
    await t.test("un fallo al asignar propietario revierte toda el alta", async () => {
      await db.exec("reset role");
      await db.exec(`create function public.test_fail_membership() returns trigger language plpgsql as $$ begin raise exception 'fallo controlado'; end $$;
        create trigger test_fail_membership before insert on public.memberships for each row execute function public.test_fail_membership();`);
      await asUser(atomic);
      await assert.rejects(create(), /fallo controlado/);
      await db.exec("reset role");
      assert.equal((await db.query("select * from public.tenants where created_by=$1", [atomic])).rows.length, 0);
      assert.equal((await db.query("select * from public.profiles where id=$1", [atomic])).rows.length, 0);
      await db.exec("drop trigger test_fail_membership on public.memberships; drop function public.test_fail_membership();");
    });
    await t.test("anon y sesión ausente no obtienen acceso ni pueden ejecutar alta", async () => {
      await db.exec("reset role; set role anon");
      await assert.rejects(db.query("select * from public.tenants"), /permission denied/i);
      await assert.rejects(create(), /permission denied/i);
      await asUser("");
      assert.equal((await db.query("select * from public.tenants")).rows.length, 0);
      await assert.rejects(create(), /Cuenta confirmada requerida/);
    });
    await t.test("los módulos operativos siguen sin políticas de acceso", async () => {
      await db.exec("reset role; grant select on public.customers to authenticated");
      await db.query("insert into public.customers(tenant_id,name) values($1,'Cliente de fixture')", [tenantA]);
      await asUser(a);
      assert.equal((await db.query("select * from public.customers")).rows.length, 0);
    });
  } finally { await db.close(); }
});
