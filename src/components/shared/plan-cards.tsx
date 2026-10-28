import Link from "next/link";
import { ArrowUpRight, Check, FileText, Layers3 } from "lucide-react";
import { formatPEN, plans, TRIAL_DAYS } from "@/lib/billing";

export function PlanCards() {
  return <div className="plans-grid">{plans.map(plan => <article className={`card plan-card ${plan.available ? "plan-basic" : "plan-future"}`} key={plan.code}>
    <div className="plan-topline"><span className="plan-icon">{plan.available ? <Layers3 size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}</span><span className="pill">{plan.available ? "Previsto para el lanzamiento" : "Próximamente"}</span></div>
    <h2>{plan.name}</h2><p className="muted">{plan.description}</p><p className="plan-price">{formatPEN(plan.price)}<span> / mes</span></p>
    <p className="plan-caption">{plan.available ? `Prueba prevista de ${TRIAL_DAYS} días al habilitar el servicio real.` : "Plan futuro. No disponible para contratar."}</p>
    <ul className="feature-list">{plan.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
    {plan.available ? <Link className="button" href="/planes#condiciones">Conocer las condiciones <ArrowUpRight size={17} aria-hidden="true" /></Link> : <span className="plan-unavailable">Disponible en una etapa posterior</span>}
  </article>)}</div>;
}
