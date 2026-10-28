"use client";

import { useState } from "react";
import { Users, Search, Phone, ShoppingBag, Plus, UserCheck, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { customers } from "@/lib/demo";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.replace(/\s+/g, "").includes(search.replace(/\s+/g, ""))
  );

  return (
    <Section
      title="Directorio de Clientes"
      description="Consulta la base de clientes de tu lavandería, sus teléfonos de contacto y el historial de pedidos acumulados. Datos demostrativos."
      actions={
        <button
          type="button"
          onClick={() => alert("Función demostrativa: En la fase operativa se abrirá el formulario para registrar un nuevo cliente.")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo cliente (Demo)</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Clientes"
          value={String(customers.length + 145)}
          trend="+12 este mes"
          trendPositive={true}
          description="Base activa"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Clientes Frecuentes"
          value="68%"
          trend="Alta fidelidad"
          trendPositive={true}
          description="2+ pedidos al mes"
          icon={<UserCheck className="w-4 h-4" />}
        />
        <MetricCard
          label="Promedio por Cliente"
          value="S/ 48.50"
          trend="Ticket medio"
          trendPositive={true}
          description="Consumo habitual"
          icon={<ShoppingBag className="w-4 h-4" />}
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Mostrando {filtered.length} de {customers.length} clientes de ejemplo</span>
          </div>
        </div>

        {/* Clients Table */}
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono de Contacto</th>
                <th>Pedidos Acumulados</th>
                <th>Frecuencia</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, index) => {
                const initials = c.name
                  .split(" ")
                  .map(part => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                const colors = [
                  "bg-sky-100 text-sky-700",
                  "bg-emerald-100 text-emerald-700",
                  "bg-purple-100 text-purple-700",
                ];
                const color = colors[index % colors.length];

                return (
                  <tr key={c.name} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${color} flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">{c.name}</div>
                          <div className="text-[11px] text-slate-400">Cliente registrado</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                        {c.orders} pedidos
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Habitual
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => alert(`Historial demostrativo de ${c.name}. Esta vista no realiza consultas reales a base de datos.`)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                      >
                        Ver historial →
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    No se encontraron clientes con el término &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
