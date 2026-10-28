import { z } from "zod";

const email = z.email("Escribe un correo válido.").trim().max(254).transform(value => value.toLowerCase());
const password = z.string().min(12, "Usa al menos 12 caracteres.").max(128, "Usa como máximo 128 caracteres.");
const name = z.string().trim().min(2, "Escribe al menos 2 caracteres.").max(120, "Usa como máximo 120 caracteres.");
const phone = z.string().trim().min(7, "Escribe un teléfono válido.").max(25).regex(/^[+\d() .-]+$/, "Escribe un teléfono válido.").refine(value => value.replace(/\D/g, "").length >= 7, "Escribe al menos 7 dígitos.");

export const loginSchema = z.object({ email, password: z.string().min(1, "Escribe tu contraseña.").max(128) });
export const recoverySchema = z.object({ email });
export const passwordSchema = z.object({ password, confirmPassword: z.string() }).refine(value => value.password === value.confirmPassword, {
  path: ["confirmPassword"], message: "Las contraseñas no coinciden.",
});
export const businessSchema = z.object({
  businessName: name, ownerName: name, phone,
  address: z.string().trim().max(300, "Usa como máximo 300 caracteres."),
});
export const registrationSchema = businessSchema.extend({ email, password, confirmPassword: z.string() }).refine(value => value.password === value.confirmPassword, {
  path: ["confirmPassword"], message: "Las contraseñas no coinciden.",
});
export const confirmationSchema = z.object({
  tokenHash: z.string().min(10).max(512).regex(/^[a-zA-Z0-9_-]+$/),
  type: z.enum(["email", "recovery"]),
});

export type ActionState = { message?: string; success?: boolean; errors?: Record<string, string[]> };
export function validationState(error: z.ZodError): ActionState {
  return { message: "Revisa los campos indicados.", errors: z.flattenError(error).fieldErrors as Record<string, string[]> };
}
