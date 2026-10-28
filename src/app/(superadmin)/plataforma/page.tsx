import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/badge";
import { Store, CreditCard, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPEN } from "@/lib/billing";

const demoTenants = [
  { id: "TNT-001", name: "Lavandería San Isidro", owner: "Alejandro Mendoza", plan: "Básico", status: "Activo", date: "15 oct 2026", badgeVariant: "emerald" as const },
  { id: "TNT-002", name: "EcoWash Miraflores", owner: "Patricia Salas", plan: "Básico", status: "En prueba", date: "22 oct 2026", badgeVariant: "primary" as const },
  { id: "TNT-003", name: "LavaRápido Surco", owner: "Gonzalo Paredes", plan: "Básico", status: "Activo", date: "05 oct 2026", badgeVariant: "emerald" as const },
  { id: "TNT-004", name: "Tintorería Imperial", owner: "Lucía Benavides", plan: "Con facturación", status: "En prueba", date: "26 oct 2026", badgeVariant: "purple" as const },
];

export default function PlatformOverviewPage() {
  return (
    <Section
      title="Administración Global de la Plataforma"
      description="Panel de control maestro de LavaGest SaaS. Monitoreo de empresas clientes, volumen de suscripciones y métricas del servicio."
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Acceso Restringido a Superadmin</span>
        </span>
      }
    >
      {/* SaaS Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Lavanderías Totales"
          value="34"
          trend="+6 este mes"
          trendPositive={true}
          description="Empresas registradas"
          icon={<Store className="w-4 h-4" />}
        />
        <MetricCard
          label="MRR Estimado"
          value={formatPEN(846.6)}
          trend="Recurrente mensual"
          trendPositive={true}
          description="En planes activos"
          icon={<CreditCard className="w-4 h-4" />}
        />
        <MetricCard
          label="Cuentas en Prueba"
          value="8"
          trend="Pruebas de 14 días"
          trendPositive={true}
          description="Posible conversión"
          icon={<Sparkles className="w-4 h-4" />}
        />
        <MetricCard
          label="Disponibilidad Sistema"
          value="99.98%"
          trend="Supabase Postgres"
          trendPositive={true}
          description="Servicio saludable"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Lavanderías registradas en la plataforma</h2>
            <p className="text-xs text-slate-500">Separación multi-tenant verificada en servidor</p>
          </div>
          <Link
            href="/plataforma/lavanderias"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
          >
            <span>Ver listado completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>ID Tenant</th>
                <th>Nombre Comercial</th>
                <th>Propietario</th>
                <th>Plan Asignado</th>
                <th>Fecha de Alta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {demoTenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {t.id}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{t.name}</div>
                    <div className="text-[11px] text-slate-400">Lima, Perú</div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-700">{t.owner}</span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-800">{t.plan}</span>
                  </td>
                  <td className="text-xs text-slate-500 font-mono">{t.date}</td>
                  <td>
                    <StatusBadge variant={t.badgeVariant}>{t.status}</StatusBadge>
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
