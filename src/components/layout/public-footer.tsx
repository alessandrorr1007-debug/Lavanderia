import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/shared/brand";
export function PublicFooter() {
  return <footer className="site-footer"><div className="footer-main"><div><Brand /><p>Un mejor día para tu lavandería.</p></div>
    <nav aria-label="Navegación del pie"><Link href="/#demo">Explorar la vista</Link><Link href="/planes">Planes previstos</Link><Link href="/login">Acceder <ArrowUpRight size={14} aria-hidden="true" /></Link></nav>
  </div><div className="footer-bottom"><span>© 2026 LavaGest</span><span>En desarrollo · Sin contratación ni cobros activos</span><Link href="/#inicio">Volver arriba ↑</Link></div></footer>;
}
