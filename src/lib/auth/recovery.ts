import { createHmac, timingSafeEqual } from "node:crypto";

export const RECOVERY_COOKIE = "lavagest-recovery";
const TTL = 10 * 60;

function signature(value: string, secret: string) {
  if (secret.length < 64) throw new Error("Configura el secreto de recuperación del servidor.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createRecoveryGrant(userId: string, sessionId: string, secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ userId, sessionId, expires: now + TTL * 1000 })).toString("base64url");
  return payload + "." + signature(payload, secret);
}

export function verifyRecoveryGrant(value: string | undefined, userId: string, sessionId: string, secret: string, now = Date.now()) {
  try {
    if (!value || value.length > 2048) return false;
    const [payload, mac, extra] = value.split(".");
    if (!payload || !mac || extra) return false;
    const expected = Buffer.from(signature(payload, secret));
    const actual = Buffer.from(mac);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.userId === userId && data.sessionId === sessionId && typeof data.expires === "number" && data.expires > now && data.expires <= now + TTL * 1000;
  } catch { return false; }
}
