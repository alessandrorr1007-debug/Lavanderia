import { Section } from "@/components/ui/section";
import { PlanCards } from "@/components/shared/plan-cards";
export default function Page() {
  return <Section title="Planes de LavaGest" description="Catálogo comercial de demostración. Los precios no activan cobros ni permiten contratar.">
    <PlanCards />
    <p className="muted">Los cambios de precio y su aplicación a suscripciones existentes requerirán autorización y registro en servidor.</p>
  </Section>;
}
