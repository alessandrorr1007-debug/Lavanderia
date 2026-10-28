import Link from "next/link";
import { Section } from "@/components/ui/section";
import { subscriptionStates } from "@/lib/billing";
export default function Page() {
  return <Section title="Suscripciones" description="Estados previstos para administrar las lavanderías. No hay negocios ni pagos reales conectados.">
    <div className="card tablewrap"><table>
      <caption>Reglas previstas de suscripción</caption>
      <thead><tr><th scope="col">Estado</th><th scope="col">Acceso previsto</th></tr></thead>
      <tbody>{Object.entries(subscriptionStates).map(([key, state]) => <tr key={key}><td><span className="pill">{state.label}</span></td><td>{state.access}</td></tr>)}</tbody>
    </table></div>
    <p className="muted">El panel real mostrará plan, fin de prueba, período pagado, renovación, cancelación y pagos confirmados por la pasarela.</p>
    <Link className="button" href="/suscripcion">Explorar suscripción de ejemplo</Link>
  </Section>;
}
