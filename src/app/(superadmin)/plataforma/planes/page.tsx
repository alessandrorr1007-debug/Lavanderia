import { Section } from "@/components/ui/section";
import { Sparkles, Check } from "lucide-react";
import { plans, formatPEN } from "@/lib/billing";

export default function PlatformPlansPage() {
  return (
    <Section
      title="Configuración de Planes Comerciales"
      description="Estructura de precios, límites por plan y módulos autorizados para la plataforma LavaGest SaaS."
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Configuración Global</span>
        </span>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(p => (
          <div key={p.code} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Código: {p.code}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{p.name}</h2>
              </div>
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                {formatPEN(p.price)}
                <span className="text-xs text-slate-400 font-normal"> / mes</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Módulos autorizados:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
