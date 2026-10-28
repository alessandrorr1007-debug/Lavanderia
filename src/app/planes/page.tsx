import Link from "next/link";
import { PlanCards } from "@/components/shared/plan-cards";
import { TRIAL_DAYS } from "@/lib/billing";

export default function PlansPage() {
  return <main className="public-page">
    <Link href="/" className="back-link">← Volver a LavaGest</Link>
    <h1>Planes para tu lavandería</h1>
    <p className="muted">Empieza con lo esencial y amplía las funciones cuando estén disponibles.</p>
    <div className="notice">Propuesta comercial en modo demostración. No se puede contratar ni realizar pagos todavía.</div>
    <PlanCards />
    <section className="card" style={{ marginTop: 22 }}>
      <h2>{TRIAL_DAYS} días para conocer LavaGest</h2>
      <p>La prueba real requerirá tarjeta válida. No cobraremos la mensualidad al comenzar. Solo se permite una prueba por tarjeta.</p>
      <p>Antes de activar se mostrarán el importe mensual, la fecha del primer cobro y las condiciones de renovación y cancelación.</p>
      <p className="muted">El ticket de recepción identifica el pedido. Las boletas y facturas electrónicas corresponden al plan futuro con facturación.</p>
    </section>
  </main>;
}
