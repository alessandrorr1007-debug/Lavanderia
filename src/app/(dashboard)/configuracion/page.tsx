import { requireOwner } from "@/lib/auth/access";
import { Section } from "@/components/ui/section";
import { Store, Clock, Printer, ShieldAlert, Save } from "lucide-react";

export default async function SettingsPage() {
  await requireOwner();

  return (
    <Section
      title="Configuración de la Lavandería"
      description="Personaliza los datos comerciales, horarios de atención y mensajes de los tickets impresos. Formulario demostrativo para la fase de diseño."
      actions={
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar cambios (Próximamente)</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Settings Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Business Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Store className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Datos comerciales del negocio</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-field">
                <label htmlFor="businessName">Nombre Comercial</label>
                <input
                  id="businessName"
                  type="text"
                  defaultValue="Lavandería San Isidro"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="form-field">
                <label htmlFor="taxId">RUC o DNI Comercial</label>
                <input
                  id="taxId"
                  type="text"
                  defaultValue="20601234567"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">Teléfono de Atención</label>
                <input
                  id="phone"
                  type="text"
                  defaultValue="999 123 456"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Correo de Contacto</label>
                <input
                  id="email"
                  type="email"
                  defaultValue="contacto@lavanderiaejemplo.pe"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2 form-field">
                <label htmlFor="address">Dirección del Local</label>
                <input
                  id="address"
                  type="text"
                  defaultValue="Av. Los Conquistadores 450, San Isidro, Lima"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Ticket customization */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Printer className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Tickets impresos y comprobantes</h2>
            </div>

            <div className="space-y-4">
              <div className="form-field">
                <label htmlFor="ticketHeader">Encabezado de Ticket de Recepción</label>
                <input
                  id="ticketHeader"
                  type="text"
                  defaultValue="¡Gracias por confiar tus prendas en LavaGest!"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="form-field">
                <label htmlFor="ticketFooter">Pie de Ticket / Políticas de Recojo</label>
                <textarea
                  id="ticketFooter"
                  rows={2}
                  defaultValue="Plazo de recojo: 30 días calendario. Pasado el término no nos responsabilizamos por prendas olvidadas."
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          {/* Schedule Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Horario de Operación</h3>
            </div>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Lunes a Viernes:</span>
                <strong className="text-slate-800">08:00 - 20:00</strong>
              </div>
              <div className="flex justify-between">
                <span>Sábados:</span>
                <strong className="text-slate-800">09:00 - 18:00</strong>
              </div>
              <div className="flex justify-between">
                <span>Domingos:</span>
                <strong className="text-rose-600">Cerrado</strong>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Entorno demostrativo</strong>
              Los ajustes reales se almacenarán en la base de datos de tu lavandería cuando se active la persistencia en Supabase.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
