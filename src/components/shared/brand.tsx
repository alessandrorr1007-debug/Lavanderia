import Link from "next/link";
import { WashingMachine } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand${light ? " brand-light" : ""}`} aria-label="LavaGest, inicio">
    <span className="brand-symbol"><WashingMachine size={24} strokeWidth={1.8} aria-hidden="true" /></span>
    <span>Lava<span className="brand-accent">Gest</span><span className="brand-dot">.</span></span>
  </Link>;
}
