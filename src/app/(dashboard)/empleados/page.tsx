import { requireOwner } from "@/lib/auth/access";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/badge";
import { UserPlus, Shield, Clock, Mail } from "lucide-react";

const demoEmployees = [
  {
    name: "Alejandro Mendoza",
    email: "propietario@lavanderia.ejemplo",
    role: "Propietario",
    shift: "Completo",
    status: "Activo",
    badgeVariant: "purple" as const,
    access: "Acceso total a configuración, caja, reportes y personal",
  },
  {
    name: "Rosa Martínez",
    email: "rosa.planta@lavanderia.ejemplo",
    role: "Operador de Planta",
    shift: "Mañana (08:00 - 16:00)",
    status: "Activo",
    badgeVariant: "primary" as const,
    access: "Recepción de pedidos, pesaje, lavado y control de entrega",
  },
  {
    name: "Miguel Ángel Flores",
    email: "miguel.caja@lavanderia.ejemplo",
    role: "Cajero / Atención",
    shift: "Tarde (12:00 - 20:00)",
    status: "Activo",
    badgeVariant: "emerald" as const,
    access: "Emisión de tickets, recepción de abonos y entrega de prendas",
  },
];

export default async function EmployeesPage() {
  await requireOwner();

  return (
    <Section
      title="Equipo de Trabajo y Roles"
      description="Gestiona los colaboradores autorizados para acceder al panel de tu lavandería. Próxima fase: invitaciones por correo y control de permisos granular."
      actions={
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invitar colaborador (Próximamente)</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Employees Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Personal del negocio</h2>
              <p className="text-xs text-slate-500">Colaboradores con credenciales demostrativas asignadas</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {demoEmployees.length} miembros
            </span>
          </div>

          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Rol Asignado</th>
                  <th>Turno Habitual</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {demoEmployees.map(emp => {
                  const initials = emp.name
                    .split(" ")
                    .map(n => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={emp.email} className="hover:bg-slate-50/80 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge variant={emp.badgeVariant}>{emp.role}</StatusBadge>
                      </td>
                      <td>
                        <div className="text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{emp.shift}</span>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Explanatory Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Esquema de Permisos RLS</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            La plataforma garantiza separación absoluta entre negocios. Ningún trabajador de una lavandería puede consultar pedidos o datos de otra empresa.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-semibold mb-1">Rol Propietario (Owner)</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Control total del tenant: apertura y arqueo de caja, configuración, tarifas, métricas de negocio y gestión de colaboradores.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-semibold mb-1">Rol Trabajador (Worker)</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Acceso restringido a la operación diaria: consulta de clientes, registro y avance de pedidos en producción y emisión de tickets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
