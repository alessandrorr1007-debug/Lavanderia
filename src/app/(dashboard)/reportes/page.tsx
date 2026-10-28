import { requireOwner } from "@/lib/auth/access";
import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartColumn, TrendingUp, Clock, Sparkles, CheckCircle2 } from "lucide-react";

export default async function ReportsPage() {
  await requireOwner();

  const weeklyData = [
    { day: "Lun", count: 24, percent: 65 },
    { day: "Mar", count: 18, percent: 50 },
    { day: "Mié", count: 32, percent: 85 },
    { day: "Jue", count: 22, percent: 60 },
    { day: "Vie", count: 38, percent: 100 },
    { day: "Sáb", count: 35, percent: 92 },
    { day: "Dom", count: 12, percent: 32 },
  ];

  const categoryDistribution = [
    { name: "Lavado por Kilo", percent: 48, color: "bg-sky-500", count: "84 pedidos" },
    { name: "Prendas & Planchado", percent: 24, color: "bg-emerald-500", count: "42 prendas" },
    { name: "Edredones & Frazadas", percent: 18, color: "bg-amber-500", count: "31 piezas" },
    { name: "Tintorería & Ternas", percent: 10, color: "bg-purple-500", count: "17 unidades" },
  ];

  return (
    <Section
      title="Reportes y Estadísticas de Rendimiento"
      description="Analiza la demanda de servicios, horas punta de recepción y volumen semanal de tu negocio. Datos demostrativos calculados con datos ficticios."
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Gráficos nativos ligeros</span>
        </span>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Ticket Promedio"
          value="S/ 43.50"
          trend="+8% vs. mes anterior"
          trendPositive={true}
          description="Por orden recepcionada"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Puntualidad en Entrega"
          value="96.8%"
          trend="Excelente estándar"
          trendPositive={true}
          description="Cumplimiento de horario"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <MetricCard
          label="Horas Punta de Local"
          value="10am - 12pm"
          trend="Recepción matutina"
          trendPositive={true}
          description="Mayor afluencia"
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          label="Prendas Procesadas"
          value="182"
          trend="Semana actual"
          trendPositive={true}
          description="Kilos y unidades"
          icon={<ChartColumn className="w-4 h-4" />}
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Volumen semanal de pedidos</h2>
              <p className="text-xs text-slate-500">Distribución de órdenes por día de la semana</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Semana actual</span>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2">
              {weeklyData.map(item => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${item.percent}%` }}
                      className="w-full bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-700 group-hover:to-sky-500 transition-all rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Demanda por tipo de servicio</h2>
              <p className="text-xs text-slate-500">Proporción de ingresos del local según especialidad</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Últimos 30 días</span>
          </div>

          {/* Progress Bars Stack */}
          <div className="w-full h-3 rounded-full overflow-hidden flex my-4 bg-slate-100">
            {categoryDistribution.map(cat => (
              <div
                key={cat.name}
                style={{ width: `${cat.percent}%` }}
                className={`${cat.color} h-full transition-all`}
                title={`${cat.name}: ${cat.percent}%`}
              />
            ))}
          </div>

          {/* Category Legend list */}
          <div className="space-y-3 pt-2">
            {categoryDistribution.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 font-mono">{cat.count}</span>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">
                    {cat.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
