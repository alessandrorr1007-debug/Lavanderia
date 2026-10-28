import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const fullTenantsList = [
  { id: "TNT-001", name: "Lavandería San Isidro", owner: "Alejandro Mendoza", phone: "999 123 456", plan: "Básico", status: "Activo", badgeVariant: "emerald" as const },
  { id: "TNT-002", name: "EcoWash Miraflores", owner: "Patricia Salas", phone: "998 765 432", plan: "Básico", status: "En prueba", badgeVariant: "primary" as const },
  { id: "TNT-003", name: "LavaRápido Surco", owner: "Gonzalo Paredes", phone: "997 112 233", plan: "Básico", status: "Activo", badgeVariant: "emerald" as const },
  { id: "TNT-004", name: "Tintorería Imperial", owner: "Lucía Benavides", phone: "996 445 566", plan: "Con facturación", status: "En prueba", badgeVariant: "purple" as const },
  { id: "TNT-005", name: "AquaLimpia La Molina", owner: "Martín Rivas", phone: "995 778 899", plan: "Básico", status: "Vencida", badgeVariant: "amber" as const },
];

export default function PlatformTenantsPage() {
  return (
    <Section
      title="Gestión de Lavanderías"
      description="Directorio de empresas registradas en LavaGest SaaS. Alta, suspensión de acceso y control de suscripción por tenant."
      actions={
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva lavandería (Manual)</span>
        </button>
      }
    >
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Listado de Tenants</h2>
            <p className="text-xs text-slate-500">Aislamiento por Row Level Security (RLS) verificado</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {fullTenantsList.length} empresas
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Tenant ID</th>
                <th>Lavandería</th>
                <th>Propietario / Contacto</th>
                <th>Plan</th>
                <th>Estado Cuenta</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fullTenantsList.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {t.id}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{t.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.phone}</div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-700">{t.owner}</span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-800">{t.plan}</span>
                  </td>
                  <td>
                    <StatusBadge variant={t.badgeVariant}>{t.status}</StatusBadge>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Detalles de administración para el tenant ${t.id}.`)}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
                    >
                      Inspeccionar →
                    </button>
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
