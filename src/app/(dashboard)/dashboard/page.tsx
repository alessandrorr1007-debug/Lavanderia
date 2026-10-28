import Link from "next/link";
import {
  ClipboardList,
  Wallet,
  WashingMachine,
  Users,
  ArrowRight,
  Sparkles,
  Plus,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/badge";
import { orders } from "@/lib/demo";
import { formatPEN } from "@/lib/billing";

export default function DashboardPage() {
  const stats = [
    {
      label: "Pedidos de hoy",
      value: "12",
      trend: "+3 vs. ayer",
      trendPositive: true,
      description: "Recepción activa",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      label: "Ingresos del día",
      value: formatPEN(385),
      trend: "Ilustrativo",
      trendPositive: true,
      description: "Efectivo y digital",
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      label: "En proceso",
      value: "7",
      trend: "3 por entregar",
      trendPositive: false,
      description: "Lavado y secado",
      icon: <WashingMachine className="w-4 h-4" />,
    },
    {
      label: "Clientes registrados",
      value: "148",
      trend: "+5 esta semana",
      trendPositive: true,
      description: "Base de ejemplo",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <Section
      title="Resumen del negocio"
      description="Así se visualiza la operación diaria de tu lavandería. Todos los valores mostrados son demostrativos."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo pedido (Demo)</span>
          </Link>
        </div>
      }
    >
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-900/60 text-sky-300 border border-sky-700/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Centro de Control Operativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ¡Bienvenido a LavaGest!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Supervisa el flujo de pedidos, controla las etapas de lavado y mantén el orden financiero de tu local desde un solo lugar.
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Link
              href="/pedidos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <span>Ver todos los pedidos</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            </Link>
            <Link
              href="/produccion"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-sky-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
            >
              <WashingMachine className="w-3.5 h-3.5" />
              <span>Flujo de producción</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <MetricCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.trend}
            trendPositive={s.trendPositive}
            description={s.description}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Main Workspace: Left (Recent Orders Table) + Right (Plant Status & Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Orders Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Últimos pedidos recepcionados</h2>
              <p className="text-xs text-slate-500">Muestra de órdenes en proceso y listas para entrega</p>
            </div>
            <Link
              href="/pedidos"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>Ver tabla completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  let badgeVariant: "ready" | "washing" | "received" | "delivered" = "washing";
                  if (order.status === "Listo") badgeVariant = "ready";
                  else if (order.status === "Recibido") badgeVariant = "received";
                  else if (order.status === "Entregado") badgeVariant = "delivered";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-mono font-bold text-sky-700 text-xs">{order.id}</td>
                      <td>
                        <div className="font-semibold text-slate-900 text-xs">{order.customer}</div>
                        <div className="text-[11px] text-slate-400">{order.date}</div>
                      </td>
                      <td>
                        <div className="text-xs text-slate-700">{order.service}</div>
                        <div className="text-[11px] text-slate-400">{order.items}</div>
                      </td>
                      <td className="font-mono font-bold text-slate-800 text-xs">
                        {formatPEN(order.amount)}
                      </td>
                      <td>
                        <StatusBadge variant={badgeVariant}>{order.status}</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Plant capacity & Operational alerts */}
        <div className="space-y-6">
          {/* Machine capacity widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Capacidad de planta</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                Turno Actual
              </span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Uso estimado de maquinaria en local</p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>Lavadoras activas</span>
                  <span className="font-mono">4 de 6 en uso (67%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-2 rounded-full w-[67%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>Secadoras activas</span>
                  <span className="font-mono">3 de 4 en uso (75%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>Estación de planchado</span>
                  <span className="font-mono">Disponible</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[40%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Acciones operativas</h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/produccion"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <WashingMachine className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold">Actualizar etapas de lavado</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/caja"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Revisar caja y abonos</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/clientes"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">Consultar directorio de clientes</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
