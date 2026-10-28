"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionState } from "@/lib/auth/validation";

export type AuthField = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "hidden";
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
};

export function AuthForm({
  action,
  fields,
  submitLabel,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  fields: AuthField[];
  submitLabel: string;
}) {
  const [state, submit, pending] = useActionState(action, {});
  // Conservar datos no sensibles ante errores; las contraseñas siguen sin persistirse.
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <form action={submit} className="auth-form space-y-4">
      <fieldset disabled={pending || state.success} className="space-y-4">
        {fields.map(field => {
          if (field.type === "hidden") {
            return (
              <input
                key={field.name}
                type="hidden"
                name={field.name}
                value={field.defaultValue ?? ""}
              />
            );
          }

          const isPassword = field.type === "password";
          const inputType = isPassword
            ? showPasswords[field.name]
              ? "text"
              : "password"
            : field.type ?? "text";

          const hasError = Boolean(state.errors?.[field.name]);

          return (
            <div className="form-field space-y-1.5" key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-xs font-semibold text-slate-700"
              >
                {field.label}
                {field.required !== false && <span className="text-rose-500 ml-0.5">*</span>}
              </label>

              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  type={inputType}
                  autoComplete={field.autoComplete}
                  required={field.required !== false}
                  value={
                    isPassword
                      ? undefined
                      : values[field.name] ?? field.defaultValue ?? ""
                  }
                  defaultValue={isPassword ? field.defaultValue : undefined}
                  onChange={event => {
                    if (!isPassword) {
                      setValues(previous => ({
                        ...previous,
                        [field.name]: event.target.value,
                      }));
                    }
                  }}
                  maxLength={field.maxLength ?? (isPassword ? 128 : 120)}
                  minLength={field.minLength}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    hasError
                      ? "border-rose-400 bg-rose-50/30 focus:ring-rose-400/20 focus:border-rose-500"
                      : "border-slate-300 focus:ring-sky-500/20 focus:border-sky-600"
                  } ${isPassword ? "pr-11" : ""}`}
                />

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => togglePassword(field.name)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer transition-colors"
                    aria-label={
                      showPasswords[field.name]
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords[field.name] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {hasError && (
                <p
                  className="field-error flex items-center gap-1.5 text-xs text-rose-600 mt-1 font-medium"
                  id={`${field.name}-error`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{state.errors?.[field.name]?.join(" ")}</span>
                </p>
              )}
            </div>
          );
        })}

        <button
          className="button w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          type="submit"
          aria-busy={pending}
          disabled={pending || state.success}
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
          <span>{pending ? "Procesando solicitud…" : submitLabel}</span>
        </button>
      </fieldset>

      {state.message && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 mt-3 ${
            state.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
          role={state.success ? "status" : "alert"}
        >
          {state.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{state.message}</span>
        </div>
      )}
    </form>
  );
}
