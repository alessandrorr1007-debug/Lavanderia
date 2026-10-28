import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/badge";
import { Calendar, CreditCard, AlertCircle } from "lucide-react";
import { formatPEN } from "@/lib/billing";

const subscriptionsList = [
  { tenant: "Lavandería San Isidro", plan: "Básico", amount: 24.9, renewalDate: "15 nov 2026", status: "Activa", badgeVariant: "emerald" as const },
  { tenant: "EcoWash Miraflores", plan: "Básico", amount: 24.9, renewalDate: "05 nov 2026", status: "En prueba", badgeVariant: "primary" as const },
  { tenant: "LavaRápido Surco", plan: "Básico", amount: 24.9, renewalDate: "18 nov 2026", status: "Activa", badgeVariant: "emerald" as const },
  { tenant: "AquaLimpia La Molina", plan: "Básico", amount: 24.9, renewalDate: "20 oct 2026", status: "Vencida", badgeVariant: "amber" as const },
];

export default function PlatformSubscriptionsPage() {
  return (
    <Section
      title="Monitoreo de Suscripciones y Cobros"
      description="Supervisión global de facturación recurrente, periodos de prueba vigentes y renovaciones en LavaGest."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Suscripciones Activas"
          value="24"
          trend="85% del total"
          trendPositive={true}
          description="Al día con mensualidad"
          icon={<CreditCard className="w-4 h-4" />}
        />
        <MetricCard
          label="En Período de Prueba"
          value="8"
          trend="14 días gratuitos"
          trendPositive={true}
          description="Sin cobro inicial"
          icon={<Calendar className="w-4 h-4" />}
        />
        <MetricCard
          label="Cuentas Vencidas"
          value="2"
          trend="Operación restringida"
          trendPositive={false}
          description="Sin renovación"
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Estado de suscripción por lavandería</h2>
            <p className="text-xs text-slate-500">Métricas simuladas para la fase de arquitectura</p>
          </div>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Lavandería</th>
                <th>Plan Contratado</th>
                <th>Importe Mensual</th>
                <th>Próxima Renovación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionsList.map(s => (
                <tr key={s.tenant} className="hover:bg-slate-50/80 transition-colors">
                  <td className="font-semibold text-slate-900 text-xs sm:text-sm">{s.tenant}</td>
                  <td className="text-xs text-slate-700">{s.plan}</td>
                  <td className="font-mono font-bold text-xs text-slate-900">{formatPEN(s.amount)}</td>
                  <td className="font-mono text-xs text-slate-600">{s.renewalDate}</td>
                  <td>
                    <StatusBadge variant={s.badgeVariant}>{s.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
