export const TRIAL_DAYS = 14;
export const plans = [
  {
    code: "basic", name: "Básico", price: 24.90, available: true,
    description: "La operación diaria de una lavandería en un solo lugar.",
    features: ["1 local", "Clientes y servicios", "Pedidos y seguimiento", "Producción", "Caja, abonos y saldos", "Reportes básicos", "Tickets de recepción y entrega"],
  },
  {
    code: "invoicing", name: "Con facturación", price: 44.90, available: false,
    description: "Una ampliación prevista para una etapa futura.",
    features: ["Todo el plan Básico", "Boletas electrónicas", "Facturas electrónicas"],
  },
] as const;
export function formatPEN(amount: number) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(amount);
}
export const subscriptionStates = {
  trialing: { label: "En prueba", description: "Puedes explorar la operación durante los 14 días gratuitos.", access: "Operación habilitada durante la prueba." },
  active: { label: "Activa", description: "La mensualidad del negocio está vigente.", access: "Operación habilitada durante el período pagado." },
  expired: { label: "Vencida", description: "La prueba o el período pagado terminó sin una renovación confirmada.", access: "Operaciones restringidas; datos conservados. Acceso a renovación y exportación autorizada." },
  cancelled: { label: "Cancelada", description: "La renovación automática está desactivada.", access: "Conserva acceso hasta terminar la prueba o el período pagado. Después se restringen las operaciones." },
} as const;
export type SubscriptionState = keyof typeof subscriptionStates;
