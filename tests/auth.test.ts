import test from "node:test";
import assert from "node:assert/strict";
import { businessSchema, confirmationSchema, loginSchema, passwordSchema, registrationSchema } from "../src/lib/auth/validation";
import { destinationForAccess, isPrivatePath } from "../src/lib/auth/policy";
import { createRecoveryGrant, verifyRecoveryGrant } from "../src/lib/auth/recovery";

const business = { businessName: "Lavandería de prueba", ownerName: "Persona de prueba", phone: "999111222", address: "Lima" };
const secret = "a".repeat(64);
test("registro valida confirmación, email, contraseña y datos del negocio", () => {
  const data = { ...business, email: "TEST@example.com", password: "clave-de-prueba-larga", confirmPassword: "clave-de-prueba-larga" };
  assert.equal(registrationSchema.parse(data).email, "test@example.com");
  for (const override of [{ email: "incorrecto" }, { password: "corta", confirmPassword: "corta" }, { confirmPassword: "otra" }, { phone: "......." }, { businessName: "x" }, { address: "a".repeat(301) }]) {
    assert.equal(registrationSchema.safeParse({ ...data, ...override }).success, false);
  }
  assert.equal(loginSchema.safeParse({ email: "test@example.com", password: "" }).success, false);
  assert.equal(passwordSchema.safeParse({ password: "clave-de-prueba-larga", confirmPassword: "otra" }).success, false);
});
test("campos de privilegios y tenant aportados por cliente nunca entran en el alta", () => {
  const parsed = businessSchema.parse({ ...business, role: "platform_admin", tenant_id: "ajeno", user_id: "ajeno" });
  assert.deepEqual(Object.keys(parsed).sort(), ["address", "businessName", "ownerName", "phone"]);
});
test("destinos dependen del permiso de BD y no del nombre de ruta", () => {
  assert.equal(destinationForAccess(false, null), "/crear-lavanderia");
  assert.equal(destinationForAccess(false, { tenant_id: "validado", role: "worker" }), "/dashboard");
  assert.equal(destinationForAccess(false, { tenant_id: "validado", role: "owner" }), "/dashboard");
  assert.equal(destinationForAccess(true, null), "/plataforma");
  for (const path of ["/dashboard", "/plataforma/planes", "/crear-lavanderia", "/nueva-contrasena", "/cuenta"]) assert.equal(isPrivatePath(path), true);
  for (const path of ["/", "/planes", "/login", "/dashboard-falso"]) assert.equal(isPrivatePath(path), false);
});
test("confirmación solo admite los tipos y tokens previstos", () => {
  assert.equal(confirmationSchema.safeParse({ tokenHash: "a".repeat(64), type: "recovery" }).success, true);
  assert.equal(confirmationSchema.safeParse({ tokenHash: "a".repeat(64), type: "invite" }).success, false);
  assert.equal(confirmationSchema.safeParse({ tokenHash: "", type: "email" }).success, false);
});
test("recuperación firmada se vincula a usuario, sesión, secreto y vencimiento", () => {
  const now = 1000000;
  const grant = createRecoveryGrant("user-A", "session-A", secret, now);
  assert.equal(verifyRecoveryGrant(grant, "user-A", "session-A", secret, now + 1), true);
  assert.equal(verifyRecoveryGrant(grant, "user-B", "session-A", secret, now), false);
  assert.equal(verifyRecoveryGrant(grant, "user-A", "session-B", secret, now), false);
  assert.equal(verifyRecoveryGrant(grant + "x", "user-A", "session-A", secret, now), false);
  assert.equal(verifyRecoveryGrant(grant, "user-A", "session-A", "b".repeat(64), now), false);
  assert.equal(verifyRecoveryGrant(grant, "user-A", "session-A", secret, now + 600000), false);
  assert.equal(verifyRecoveryGrant(undefined, "user-A", "session-A", secret, now), false);
  assert.equal(verifyRecoveryGrant(grant, "user-A", "session-A", "", now), false);
});
