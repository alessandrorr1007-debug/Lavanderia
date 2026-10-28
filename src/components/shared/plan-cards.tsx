import Link from "next/link";
import { formatPEN, plans, TRIAL_DAYS } from "@/lib/billing";

export function PlanCards() {
  return <div className="plans-grid">
    {plans.map(plan => <article className="card plan-card" key={plan.code}>
      <span className="pill">{plan.available ? "Previsto para el lanzamiento" : "Futuro · No disponible"}</span>
      <h2>{plan.name}</h2>
      <p className="muted">{plan.description}</p>
      <p className="plan-price">{formatPEN(plan.price)} <span>/ mes</span></p>
      <ul className="feature-list">{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      {plan.available
        ? <Link className="button" href="/suscripcion">Ver prueba de {TRIAL_DAYS} días (demo)</Link>
        : <p className="muted">Precio previsto. Aún no se puede contratar.</p>}
    </article>)}
  </div>;
}
