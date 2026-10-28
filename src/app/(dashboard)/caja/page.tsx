import { requireOwner } from "@/lib/auth/access";
import { Section } from "@/components/ui/section";
import { MetricCard } from "@/components/ui/metric-card";
import { Wallet, CreditCard, Banknote, ShieldAlert, Sparkles, Smartphone } from "lucide-react";
import { formatPEN } from "@/lib/billing";

const demoTransactions = [
  { time: "09:15 AM", order: "LV-00125", customer: "María Fernández", concept: "Abono 50% recepción", method: "Yape", amount: 17.5, type: "in" },
  { time: "10:30 AM", order: "LV-00124", customer: "Carlos Ruiz", concept: "Cancelación completa", method: "Efectivo", amount: 45.0, type: "in" },
  { time: "11:45 AM", order: "LV-00123", customer: "Ana Torres", concept: "Cobro contra entrega", method: "Tarjeta POS", amount: 64.0, type: "in" },
  { time: "01:20 PM", order: "GASTO-01", customer: "Proveedor Detergente", concept: "Compra insumos de lavado", method: "Efectivo", amount: 35.0, type: "out" },
  { time: "02:10 PM", order: "LV-00122", customer: "José Vega", concept: "Cancelación entrega", method: "Plin", amount: 30.0, type: "in" },
];

export default async function CashPage() {
  await requireOwner();

  return (
    <Section
      title="Caja y Movimientos del Turno"
      description="Supervisa los ingresos por servicios, abonos recibidos y métodos de pago del día. Módulo demostrativo sin operaciones bancarias reales."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
          >
            <span>Arqueo de caja (Próximamente)</span>
          </button>
        </div>
      }
    >
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold mb-0.5">Operaciones financieras simuladas</strong>
          La apertura formal de turnos, arqueo ciego, cuadre de caja e integración con terminales de pago se implementarán con transacciones atómicas verificadas en la fase operativa. No ingresar datos bancarios reales.
        </div>
      </div>

      {/* Cash Register KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Saldo Total en Caja"
          value={formatPEN(521.5)}
          trend="Apertura S/ 300.00"
          trendPositive={true}
          description="Efectivo + digital"
          icon={<Wallet className="w-4 h-4" />}
        />
        <MetricCard
          label="Efectivo Disponible"
          value={formatPEN(310.0)}
          trend="En gaveta"
          trendPositive={true}
          description="Ingresos - Egresos"
          icon={<Banknote className="w-4 h-4" />}
        />
        <MetricCard
          label="Billeteras (Yape / Plin)"
          value={formatPEN(47.5)}
          trend="Sin comisiones"
          trendPositive={true}
          description="Transferencias verificadas"
          icon={<Smartphone className="w-4 h-4" />}
        />
        <MetricCard
          label="Tarjetas y POS"
          value={formatPEN(64.0)}
          trend="Crédito / Débito"
          trendPositive={true}
          description="Voucher ilustrativo"
          icon={<CreditCard className="w-4 h-4" />}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Movimientos del turno actual</h2>
            <p className="text-xs text-slate-500">Historial cronológico de cobros y abonos demostrativos</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Turno de Mañana · Abierto 08:30 AM
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Comprobante / Ref</th>
                <th>Cliente / Beneficiario</th>
                <th>Concepto</th>
                <th>Método de Pago</th>
                <th className="text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {demoTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="font-mono text-xs text-slate-500">{tx.time}</td>
                  <td>
                    <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {tx.order}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-slate-900 text-xs">{tx.customer}</span>
                  </td>
                  <td className="text-xs text-slate-600">{tx.concept}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      {tx.method === "Efectivo" && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                      {tx.method.includes("Yape") || tx.method.includes("Plin") ? (
                        <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                      ) : null}
                      {tx.method.includes("POS") && <CreditCard className="w-3.5 h-3.5 text-sky-600" />}
                      <span>{tx.method}</span>
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-mono font-bold text-xs ${
                        tx.type === "in" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {tx.type === "in" ? "+" : "-"} {formatPEN(tx.amount)}
                    </span>
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
