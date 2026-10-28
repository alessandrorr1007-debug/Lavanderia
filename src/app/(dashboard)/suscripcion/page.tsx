"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight, Sparkles, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/badge";
import { formatPEN, plans, subscriptionStates, TRIAL_DAYS, type SubscriptionState } from "@/lib/billing";

export default function SubscriptionPage() {
  const [state, setState] = useState<SubscriptionState>("trialing");
  const info = subscriptionStates[state];

  let stateBadgeVariant: "primary" | "emerald" | "amber" | "slate" = "primary";
  if (state === "active") stateBadgeVariant = "emerald";
  else if (state === "expired") stateBadgeVariant = "amber";
  else if (state === "cancelled") stateBadgeVariant = "slate";

  return (
    <Section
      title="Mi Suscripción y Facturación"
      description="Consulta el estado de tu plan SaaS, ciclo de prueba y condiciones de renovación del servicio. Demostración interactiva sin cobros reales."
      actions={
        <Link
          href="/planes"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-2xs transition-colors"
        >
          <span>Comparar planes comerciales</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-3 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold mb-0.5">Demostración comercial sin cobros activos</strong>
          No ingreses números de tarjeta ni datos bancarios en esta plataforma. La pasarela de pagos oficial se integrará en una fase posterior con validación bancaria externa y seguridad tokenizada.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Active Plan Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                Plan Actual
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{plans[0].name}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                {formatPEN(plans[0].price)}
              </span>
              <span className="text-xs text-slate-500 block"> / mes</span>
            </div>
          </div>

          {/* Trial Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Período de prueba gratuito ({TRIAL_DAYS} días)</span>
              <span className="font-mono text-sky-600">3 de 14 días</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-full w-[25%]" />
            </div>
            <p className="text-[11px] text-slate-400">
              Primer cobro previsto en este ejemplo: 11 de noviembre de 2026 ({formatPEN(plans[0].price)})
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Beneficios incluidos en tu local:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {plans[0].features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* State Explorer Card (Interactive demo) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Simulador de Estados de Suscripción</h2>
              <p className="text-xs text-slate-500">Prueba cómo responde la plataforma ante cada estado de acceso</p>
            </div>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>

          <div>
            <label htmlFor="subscription-state" className="block text-xs font-semibold text-slate-700 mb-2">
              Seleccionar estado para previsualizar:
            </label>
            <div className="grid grid-cols-2 gap-2" id="subscription-state">
              {(Object.keys(subscriptionStates) as SubscriptionState[]).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setState(key)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    state === key
                      ? "border-sky-500 bg-sky-50 text-sky-900 shadow-2xs"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold">{subscriptionStates[key].label}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{key}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Preview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Estado resultante:</span>
              <StatusBadge variant={stateBadgeVariant}>{info.label}</StatusBadge>
            </div>
            <p className="text-xs text-slate-700 font-medium">{info.description}</p>
            <div className="text-xs font-semibold text-sky-800 bg-sky-100/60 p-2 rounded-lg">
              {info.access}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Este selector interactivo es exclusivamente demostrativo. Los permisos reales se verifican siempre en el servidor mediante políticas de base de datos.
          </p>
        </div>
      </div>

      {/* Conditions Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Condiciones previstas para la activación oficial</h2>
        <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
            <span>No se cobrará ninguna mensualidad durante los 14 días de prueba inicial.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
            <span>Una sola prueba gratuita por tarjeta de crédito o débito en toda la plataforma.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
            <span>Al concluir la prueba, se renovará mensualmente si mantienes activa la renovación automática.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
            <span>Sin renovación, tus datos se conservan íntegramente y se restringe la operativa diaria.</span>
          </li>
        </ul>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 flex-wrap">
          <button
            type="button"
            disabled
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
          >
            Registrar tarjeta · Próximamente
          </button>
          <button
            type="button"
            disabled
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
          >
            Cancelar renovación · Próximamente
          </button>
        </div>
      </div>
    </Section>
  );
}
