import { Section } from "@/components/ui/section";
import { LifeBuoy } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";

const supportTickets = [
  { id: "TCK-101", tenant: "Lavandería San Isidro", subject: "Consulta sobre formato de impresión de ticket", priority: "Baja", status: "Resuelto", date: "27 oct 2026", badgeVariant: "emerald" as const },
  { id: "TCK-102", tenant: "EcoWash Miraflores", subject: "Configuración de horario de atención en domingo", priority: "Media", status: "En atención", date: "28 oct 2026", badgeVariant: "primary" as const },
  { id: "TCK-103", tenant: "Tintorería Imperial", subject: "Duda sobre ampliación con facturación electrónica", priority: "Alta", status: "Pendiente", date: "28 oct 2026", badgeVariant: "amber" as const },
];

export default function PlatformSupportPage() {
  return (
    <Section
      title="Centro de Soporte a Lavanderías"
      description="Atención de incidencias, consultas sobre el software y solicitudes de los negocios suscritos."
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <LifeBuoy className="w-3.5 h-3.5 text-purple-600" />
          <span>Canal de Mesa de Ayuda</span>
        </span>
      }
    >
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Tickets de soporte recientes</h2>
            <p className="text-xs text-slate-500">Muestra de solicitudes recibidas por los negocios</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {supportTickets.length} tickets
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Lavandería</th>
                <th>Asunto</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {t.id}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{t.tenant}</div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-700">{t.subject}</span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-800">{t.priority}</span>
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
