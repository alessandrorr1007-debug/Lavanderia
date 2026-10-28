"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  Check,
  Clock,
  Printer,
  Plus,
  Eye,
  X,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/badge";
import { orders } from "@/lib/demo";
import { formatPEN } from "@/lib/billing";

const filterTabs = ["Todos", "Recibido", "En lavado", "Listo", "Entregado"] as const;

export default function OrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filterTabs)[number]>("Todos");
  const [search, setSearch] = useState("");
  const [activeOrder, setActiveOrder] = useState<(typeof orders)[number] | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = selectedFilter === "Todos" || o.status === selectedFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.service.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countPending = orders.filter(o => o.status !== "Entregado").length;
  const countReady = orders.filter(o => o.status === "Listo").length;
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <Section
      title="Gestión de Pedidos"
      description="Monitorea el ciclo completo de las prendas desde su recepción hasta la entrega al cliente. Vista demostrativa con datos ficticios."
      actions={
        <button
          type="button"
          onClick={() => alert("Función demostrativa: En la fase operativa se abrirá el formulario para recepcionar prendas, pesar ropa y emitir tickets.")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Pedido (Demo)</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Pedidos Activos"
          value={String(countPending)}
          trend="En proceso"
          trendPositive={false}
          description="En lavado y secado"
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          label="Listos para Entrega"
          value={String(countReady)}
          trend="Recojo hoy"
          trendPositive={true}
          description="Esperando cliente"
          icon={<Check className="w-4 h-4" />}
        />
        <MetricCard
          label="Volumen del Día"
          value={formatPEN(totalAmount)}
          trend="Ilustrativo"
          trendPositive={true}
          description="Monto acumulado demo"
          icon={<ClipboardList className="w-4 h-4" />}
        />
      </div>

      {/* Main Table Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        {/* Toolbar: Filter Tabs + Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" aria-label="Filtrar por estado">
            {filterTabs.map(tab => {
              const count = tab === "Todos" ? orders.length : orders.filter(o => o.status === tab).length;
              const isSelected = selectedFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedFilter(tab)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-sky-800 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar código o cliente..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Servicio / Detalle</th>
                <th>Fecha Ingreso</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => {
                let badgeVariant: "ready" | "washing" | "received" | "delivered" = "washing";
                if (o.status === "Listo") badgeVariant = "ready";
                else if (o.status === "Recibido") badgeVariant = "received";
                else if (o.status === "Entregado") badgeVariant = "delivered";

                return (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {o.id}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">{o.customer}</div>
                      <div className="text-[11px] text-slate-400">Cliente registrado</div>
                    </td>
                    <td>
                      <div className="font-medium text-slate-800 text-xs">{o.service}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{o.items}</div>
                    </td>
                    <td className="text-xs text-slate-600">{o.date}</td>
                    <td>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {formatPEN(o.amount)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge variant={badgeVariant}>{o.status}</StatusBadge>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveOrder(o)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                          title="Ver ticket de pedido"
                          aria-label={`Ver ticket ${o.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Impresión demostrativa del ticket ${o.id}. No requiere impresora física conectada.`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Imprimir ticket"
                          aria-label={`Imprimir ${o.id}`}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    No se encontraron pedidos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal (Demo detail) */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setActiveOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 mb-4 border-b border-dashed border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                Ticket Demostrativo
              </span>
              <h3 className="text-xl font-mono font-black text-slate-900 mt-2">{activeOrder.id}</h3>
              <p className="text-xs text-slate-500">LavaGest · Control de Entrega</p>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <span className="font-bold text-slate-800">{activeOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Servicio:</span>
                <span className="font-semibold text-slate-800">{activeOrder.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cantidad / Peso:</span>
                <span className="font-mono text-slate-700">{activeOrder.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha de recepción:</span>
                <span className="text-slate-700">{activeOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado de prenda:</span>
                <span className="font-semibold text-sky-600">{activeOrder.status}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold">
                <span className="text-slate-900">Total a pagar:</span>
                <span className="font-mono text-slate-900">{formatPEN(activeOrder.amount)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert("Simulación de impresión enviada.");
                  setActiveOrder(null);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
              >
                Imprimir ticket
              </button>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
