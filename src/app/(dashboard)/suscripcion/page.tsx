"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { formatPEN, plans, subscriptionStates, TRIAL_DAYS, type SubscriptionState } from "@/lib/billing";

export default function SubscriptionPage() {
  const [state, setState] = useState<SubscriptionState>("trialing");
  const info = subscriptionStates[state];
  return <Section title="Mi suscripción" description="Demostración del plan y de los estados de acceso. No existe una suscripción real.">
    <div className="notice"><strong>Demo sin cobros.</strong> No ingreses tarjetas ni datos bancarios. La pasarela de pagos se integrará en una fase posterior.</div>
    <div className="plans-grid">
      <section className="card">
        <span className="pill">Plan {plans[0].name}</span>
        <h2>{formatPEN(plans[0].price)} / mes</h2>
        <p>{TRIAL_DAYS} días gratuitos. Tarjeta válida obligatoria al activar la prueba real.</p>
        <dl className="detail-list">
          <div><dt>Ejemplo de inicio</dt><dd>28 de octubre de 2026</dd></div>
          <div><dt>Ejemplo de fin de prueba</dt><dd>11 de noviembre de 2026</dd></div>
          <div><dt>Primer cobro previsto en este ejemplo</dt><dd>11 de noviembre de 2026 · {formatPEN(plans[0].price)}</dd></div>
        </dl>
        <p className="muted">Fechas ilustrativas. En el sistema real se calcularán al confirmar la activación desde el servidor.</p>
        <Link href="/planes" className="button">Comparar planes</Link>
      </section>
      <section className="card">
        <h2>Explorar estados</h2>
        <label htmlFor="subscription-state">Estado de ejemplo</label>
        <select id="subscription-state" value={state} onChange={event => setState(event.target.value as SubscriptionState)}>
          {Object.entries(subscriptionStates).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
        </select>
        <div aria-live="polite" className="status-preview">
          <span className="pill">{info.label}</span>
          <p>{info.description}</p><p><strong>{info.access}</strong></p>
          {state === "trialing" && <p>Ejemplo al comenzar: {TRIAL_DAYS} días restantes.</p>}
        </div>
        <p className="muted">Este selector solo cambia la vista de ejemplo. No controla permisos ni modifica datos.</p>
      </section>
    </div>
    <section className="card" style={{ marginTop: 22 }}>
      <h2>Condiciones previstas para la activación</h2>
      <ul className="feature-list">
        <li>No se cobra la mensualidad al iniciar los 14 días gratuitos.</li>
        <li>Una sola prueba por tarjeta en toda la plataforma, incluso con otra cuenta.</li>
        <li>Al terminar, se cobrará el plan mensual elegido si aceptaste la renovación automática y no cancelaste antes.</li>
        <li>Podrás cancelar la renovación desde esta sección. Sin renovación, se conservan tus datos y se restringen las operaciones al vencer el acceso.</li>
        <li>La validación bancaria podría mostrar una autorización temporal; debe informarse según la pasarela elegida.</li>
      </ul>
      <div className="action-row"><button className="button" type="button" disabled>Registrar tarjeta · Próximamente</button><button className="button" type="button" disabled>Cancelar renovación · Próximamente</button></div>
      <p className="muted">La activación, renovación y cancelación reales estarán disponibles después de integrar y probar los pagos.</p>
    </section>
  </Section>;
}
