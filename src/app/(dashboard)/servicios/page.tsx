"use client";

import { useState } from "react";
import { Shirt, Plus, Sparkles, Clock, Tag, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { formatPEN } from "@/lib/billing";

interface ExtendedService {
  name: string;
  unit: string;
  price: number;
  category: "peso" | "prenda" | "hogar";
  turnaround: string;
  popular?: boolean;
}

const detailedServices: ExtendedService[] = [
  {
    name: "Lavado por kilo",
    unit: "kg",
    price: 7.0,
    category: "peso",
    turnaround: "24 horas",
    popular: true,
  },
  {
    name: "Lavado y planchado",
    unit: "prenda",
    price: 8.0,
    category: "prenda",
    turnaround: "48 horas",
    popular: true,
  },
  {
    name: "Planchado solo",
    unit: "prenda",
    price: 5.0,
    category: "prenda",
    turnaround: "24 horas",
  },
  {
    name: "Edredón / Cubrecama",
    unit: "unidad",
    price: 45.0,
    category: "hogar",
    turnaround: "72 horas",
    popular: true,
  },
  {
    name: "Terno completo (2 piezas)",
    unit: "unidad",
    price: 32.0,
    category: "prenda",
    turnaround: "48 horas",
  },
  {
    name: "Cortinas por metro",
    unit: "metro",
    price: 12.0,
    category: "hogar",
    turnaround: "72 horas",
  },
];

export default function ServicesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <Section
      title="Catálogo de Servicios y Tarifas"
      description="Define los servicios de lavado, planchado y cuidado de prendas que ofreces a tus clientes. Precios de ejemplo editables en la fase operativa."
      actions={
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista de cuadrícula"
              aria-label="Vista de cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista de tabla"
              aria-label="Vista de tabla"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => alert("Función demostrativa: En la fase operativa podrás crear nuevos servicios, asignar unidades y configurar precios.")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo servicio (Demo)</span>
          </button>
        </div>
      }
    >
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {detailedServices.map(s => (
            <div
              key={s.name}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-slate-300 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Shirt className="w-5 h-5" />
                  </div>
                  {s.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">{s.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    Unidad: <strong className="text-slate-700">{s.unit}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Entrega: <strong className="text-slate-700">{s.turnaround}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tarifa sugerida</span>
                  <span className="text-xl font-mono font-extrabold text-slate-900">
                    {formatPEN(s.price)}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / {s.unit}</span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Edición demostrativa para el servicio ${s.name}.`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
                >
                  Editar (Demo)
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Categoría</th>
                  <th>Unidad de Cobro</th>
                  <th>Tiempo Estimado</th>
                  <th>Precio Demostrativo</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {detailedServices.map(s => (
                  <tr key={s.name} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                        <Shirt className="w-4 h-4 text-sky-600" />
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="capitalize text-xs text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                        {s.category}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-semibold text-slate-700">{s.unit}</span>
                    </td>
                    <td className="text-xs text-slate-600">{s.turnaround}</td>
                    <td>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {formatPEN(s.price)}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Edición demostrativa para ${s.name}.`)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
                      >
                        Configurar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
}
