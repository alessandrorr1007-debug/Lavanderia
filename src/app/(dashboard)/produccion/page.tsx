"use client";

import { useState } from "react";
import {
  WashingMachine,
  ClipboardList,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { orders as initialOrders } from "@/lib/demo";

type Stage = "Recibido" | "En lavado" | "Listo" | "Entregado";

const stages: { key: Stage; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: "Recibido", label: "1. Recepción y Pesaje", icon: ClipboardList, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { key: "En lavado", label: "2. Lavado y Secado", icon: WashingMachine, color: "text-sky-600 bg-sky-50 border-sky-200" },
  { key: "Listo", label: "3. Listo para Entrega", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { key: "Entregado", label: "4. Entregado al Cliente", icon: PackageCheck, color: "text-slate-600 bg-slate-100 border-slate-200" },
];

export default function ProductionPage() {
  const [tickets, setTickets] = useState(initialOrders);

  const moveOrder = (id: string, currentStatus: string) => {
    let nextStatus: Stage = "En lavado";
    if (currentStatus === "Recibido") nextStatus = "En lavado";
    else if (currentStatus === "En lavado") nextStatus = "Listo";
    else if (currentStatus === "Listo") nextStatus = "Entregado";
    else if (currentStatus === "Entregado") nextStatus = "Recibido";

    setTickets(prev =>
      prev.map(item => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  };

  return (
    <Section
      title="Flujo de Producción y Lavado"
      description="Visualiza y organiza el procesamiento de prendas por etapas de trabajo en tiempo real. Tablero interactivo demostrativo."
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Controles interactivos en memoria</span>
        </span>
      }
    >
      {/* Informative notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-semibold mb-0.5">
            Tablero Kanban de planta demostrativo
          </strong>
          Haz clic en &ldquo;Avanzar etapa&rdquo; en cualquier ticket para comprobar cómo se desplaza la prenda de forma fluida entre etapas. Esta interacción solo modifica la vista actual y no altera la base de datos remota.
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {stages.map(stage => {
          const StageIcon = stage.icon;
          const stageOrders = tickets.filter(t => t.status === stage.key);

          return (
            <div
              key={stage.key}
              className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[460px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${stage.color}`}>
                    <StageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-800 leading-tight">{stage.label}</h2>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {stageOrders.length}
                </span>
              </div>

              {/* Tickets Column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageOrders.map(t => (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {t.id}
                      </span>
                      <span className="text-[11px] text-slate-400">{t.date}</span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{t.customer}</h3>
                      <p className="text-xs text-slate-500">{t.service}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="font-mono text-slate-700 font-medium">{t.items}</span>
                      <span className="font-mono font-bold text-slate-800">S/ {t.amount}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => moveOrder(t.id, t.status)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Avanzar etapa</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {stageOrders.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                    <span>Sin pedidos en esta etapa</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
