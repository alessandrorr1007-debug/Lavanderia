import { ArrowLeft, CreditCard, CalendarDays, CircleCheck } from "lucide-react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { PlanCards } from "@/components/shared/plan-cards";
import { TRIAL_DAYS } from "@/lib/billing";

export default function PlansPage() {
  return (
    <div className="marketing-page min-h-screen flex flex-col justify-between">
      <PublicHeader />

      <main className="page-container plans-page flex-1">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a LavaGest
        </Link>

        <div className="section-heading centered">
          <span className="eyebrow">PROPUESTA COMERCIAL</span>
          <h1>Planes para tu lavandería.</h1>
          <p>
            Lo esencial para empezar. Espacio para crecer.
            <br />
            Precios previstos en Soles (PEN), sin contratación ni cobros activos.
          </p>
        </div>

        <PlanCards />

        <p className="pricing-note">
          Tratamiento del IGV y límites comerciales pendientes de definición antes del lanzamiento.
        </p>

        <section className="plan-conditions card" id="condiciones">
          <span className="eyebrow">ANTES DE LA ACTIVACIÓN</span>
          <h2>Una prueba con las condiciones claras.</h2>

          <div className="conditions-grid">
            <div>
              <CalendarDays aria-hidden="true" size={24} />
              <h3>{TRIAL_DAYS} días previstos</h3>
              <p>
                La prueba real requerirá tarjeta válida y no cobrará la mensualidad al comenzar. Una sola prueba por tarjeta en toda la plataforma.
              </p>
            </div>

            <div>
              <CreditCard aria-hidden="true" size={24} />
              <h3>Sin sorpresas</h3>
              <p>
                Antes de activar se mostrarán el importe exacto, la fecha del primer cobro, los términos de renovación automática y las opciones de cancelación.
              </p>
            </div>

            <div>
              <CircleCheck aria-hidden="true" size={24} />
              <h3>Decisión informada</h3>
              <p>
                Actualmente no puedes contratar ni registrar tarjetas bancarias aquí. Crear una cuenta en esta fase no activa cobros ni una suscripción.
              </p>
            </div>
          </div>

          <p className="muted text-xs">
            Los tickets de recepción identifican el pedido. Las boletas y facturas electrónicas corresponden a la ampliación del plan futuro con facturación.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
