import Link from "next/link";
import { ArrowLeft, Check, Sparkles, WashingMachine, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-layout min-h-screen">
      {/* Brand Storytelling Lateral Rail */}
      <aside className="auth-story hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1a2e] text-white border-r border-slate-800">
        <div>
          <Brand light />

          <div className="auth-story-copy mt-16 max-w-sm">
            <span className="eyebrow bg-sky-950 text-sky-300 border border-sky-800 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <Sparkles size={14} aria-hidden="true" />
              <span>DISEÑADO PARA TU LAVANDERÍA</span>
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-2">
              Más orden.
              <br />
              Mejor atención.
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Tu próximo paso hacia una experiencia de trabajo centralizada, organizada y moderna.
            </p>

            <ul className="mt-8 space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0">
                  <Check size={13} aria-hidden="true" />
                </div>
                <span>Un espacio de control para tu negocio</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0">
                  <Check size={13} aria-hidden="true" />
                </div>
                <span>Acceso seguro por credenciales y roles</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0">
                  <Check size={13} aria-hidden="true" />
                </div>
                <span>Interfaz optimizada para celular o PC</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Art graphic */}
        <div className="auth-art my-8 text-center flex flex-col items-center" aria-hidden="true">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600/20 to-sky-400/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-xl shadow-sky-500/10 mb-3">
            <WashingMachine size={44} strokeWidth={1.2} />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
            Cada cosa, en su lugar.
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
          <span>LavaGest SaaS · Datos operativos demostrativos</span>
        </div>
      </aside>

      {/* Main Form Area */}
      <div className="auth-main flex flex-col justify-between p-6 sm:p-12 bg-slate-50 flex-1">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors mb-6"
            href="/"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Volver a la página principal</span>
          </Link>

          <div className="auth-page max-w-md mx-auto">
            <div className="lg:hidden mb-6">
              <Brand />
            </div>

            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Autenticación Segura
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
                {title}
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {description}
              </p>

              {children}

              <nav
                className="flex items-center justify-between gap-2 pt-5 mt-6 border-t border-slate-100 text-xs font-semibold text-sky-600 flex-wrap"
                aria-label="Opciones de acceso"
              >
                <Link href="/login" className="hover:underline">
                  Iniciar sesión
                </Link>
                <Link href="/registro" className="hover:underline">
                  Crear cuenta
                </Link>
                <Link href="/recuperar-contrasena" className="hover:underline">
                  Recuperar clave
                </Link>
              </nav>

              <p className="text-[11px] text-slate-400 text-center mt-4">
                El registro de cuenta no activa pagos ni una prueba de cobro.
              </p>
            </section>
          </div>
        </div>

        <span className="text-xs text-slate-400 text-center block mt-8">
          © 2026 LavaGest SaaS · Plataforma de gestión para lavanderías
        </span>
      </div>
    </main>
  );
}
