import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  Layers3,
  ListChecks,
  LockKeyhole,
  MonitorSmartphone,
  MoveRight,
  Shirt,
  Sparkles,
  Store,
  WashingMachine,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { PlanCards } from "@/components/shared/plan-cards";
import { ProductPreview } from "@/components/shared/product-preview";

const questions = [
  [
    "¿Puedo usar LavaGest con información real?",
    "Todavía no. Los módulos operativos muestran datos ficticios. La configuración y verificación de seguridad del entorno real deben completarse antes de operar una lavandería.",
  ],
  [
    "¿Necesito una cuenta para explorar la vista interactiva?",
    "No. Puedes probar los filtros, buscar entre los pedidos de ejemplo y cambiar la vista de producción desde esta página. Estas interacciones no guardan ni modifican pedidos reales.",
  ],
  [
    "¿Crear una cuenta activa una prueba o un cobro?",
    "No. Crear una cuenta no activa ninguna suscripción, prueba gratuita ni pago. La prueba prevista de 14 días estará disponible cuando se integre y valide el servicio real.",
  ],
  [
    "¿Qué diferencia hay entre los dos planes?",
    "Básico contempla la gestión diaria de un local. El plan futuro con facturación añadiría boletas y facturas electrónicas. Ninguno puede contratarse todavía desde esta web.",
  ],
  [
    "¿La interfaz se adapta al celular?",
    "Sí. La presentación y los formularios se adaptan a computadoras, tablets y celulares. Puedes explorar esta demostración desde cualquiera de esos dispositivos.",
  ],
];

export default function Home() {
  return (
    <div className="marketing-page" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <PublicHeader />

      <main id="contenido">
        {/* Hero Section */}
        <section className="landing-hero page-container">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="small-dot" /> SOFTWARE DE GESTIÓN PARA LAVANDERÍAS
            </span>
            <h1>
              Tu lavandería,
              <br />
              <span>bajo control.</span>
            </h1>
            <p>
              Menos pendientes en tu cabeza.
              <br className="hidden md:inline" /> Más claridad en cada pedido.
            </p>
            <p className="hero-description">
              Conoce una forma más organizada de visualizar tus clientes, pedidos y el trabajo diario de tu lavandería en una plataforma SaaS intuitiva.
            </p>
            <div className="hero-actions">
              <a href="#demo" className="button">
                Explorar la vista interactiva <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link className="text-link" href="/planes">
                Conocer los planes <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-note">
              <span className="development-dot" /> En desarrollo · Datos de demostración · Sin cobros
            </div>
          </div>

          <div className="hero-product">
            <div className="product-caption">
              <span>UNA VISTA CLARA DE TU DÍA</span>
              <span>↓ Pruébala aquí</span>
            </div>
            <ProductPreview />
            <div className="product-under">
              <span>
                <Check size={14} aria-hidden="true" /> Sin registro para explorar
              </span>
              <span>Diseñado para lavanderías</span>
            </div>
          </div>
        </section>

        {/* Principles Strip */}
        <div className="principles-strip">
          <div className="page-container principles-inner">
            <span>
              <Store size={18} aria-hidden="true" /> Pensado para tu local
            </span>
            <span>
              <Layers3 size={18} aria-hidden="true" /> Cada área en su lugar
            </span>
            <span>
              <MonitorSmartphone size={18} aria-hidden="true" /> De escritorio a celular
            </span>
            <span>
              <LockKeyhole size={18} aria-hidden="true" /> Acceso por cuenta y rol
            </span>
          </div>
        </div>

        {/* Features Bento-Grid */}
        <section className="section-space page-container" id="funciones">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LA EXPERIENCIA QUE ESTAMOS CONSTRUYENDO</span>
              <h2>
                Del primer pedido
                <br />a la última entrega.
              </h2>
            </div>
            <p>Una interfaz pensada alrededor de tu trabajo, con la información importante siempre a mano.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-block">
              <span className="feature-number">01 / RECEPCIÓN</span>
              <div className="feature-illustration illustration-orders" aria-hidden="true">
                <div>
                  <ClipboardList size={22} className="text-sky-600" />
                  <span>Pedido recibido</span>
                  <Check size={16} className="text-emerald-600" />
                </div>
                <div>
                  <Shirt size={20} className="text-sky-600" />
                  <span>Servicio y cantidad</span>
                  <span className="font-mono text-slate-800">5 kg</span>
                </div>
              </div>
              <h3>Cada detalle cuenta.</h3>
              <p>Clientes, servicios y pedidos reunidos en una experiencia clara. Explora cómo se vería una recepción organizada sin confusiones.</p>
            </article>

            <article className="feature-block">
              <span className="feature-number">02 / SEGUIMIENTO</span>
              <div className="feature-illustration illustration-process" aria-hidden="true">
                <span>
                  <ClipboardList size={21} />
                  <small>Recibido</small>
                </span>
                <MoveRight size={18} className="text-slate-300" />
                <span className="process-current">
                  <WashingMachine size={24} className="text-sky-600" />
                  <small>En lavado</small>
                </span>
                <MoveRight size={18} className="text-slate-300" />
                <span>
                  <Check size={21} className="text-emerald-600" />
                  <small>Listo</small>
                </span>
              </div>
              <h3>El siguiente paso, siempre visible.</h3>
              <p>Una vista organizada de los estados te ayuda a saber qué se recibió, qué está en máquina y qué está listo para entregar.</p>
            </article>

            <article className="feature-block">
              <span className="feature-number">03 / ORGANIZACIÓN</span>
              <div className="feature-illustration illustration-list" aria-hidden="true">
                <span className="flex items-center gap-2">
                  <ListChecks size={20} className="text-sky-600" /> Una operación más clara
                </span>
                <div>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <h3>Más perspectiva de negocio.</h3>
              <p>Una base visual sólida para reunir las áreas clave de tu empresa. Caja y reportes se incorporarán en sus fases de desarrollo.</p>
            </article>
          </div>

          <p className="section-footnote">
            <Sparkles size={15} aria-hidden="true" className="text-sky-500" /> Vistas ilustrativas. Las operaciones comerciales reales continúan en desarrollo.
          </p>
        </section>

        {/* Workflow Band */}
        <section className="workflow-band">
          <div className="page-container workflow-inner">
            <div>
              <span className="eyebrow bg-sky-950 text-sky-300 border border-sky-800">SENCILLO DESDE EL PRINCIPIO</span>
              <h2>
                Todo empieza
                <br />
                con un poco de orden.
              </h2>
              <p>
                Explora primero. Conoce la experiencia.
                <br />
                Avanza cuando el servicio esté listo.
              </p>
            </div>

            <ol className="workflow-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Conoce la plataforma</h3>
                  <p>Prueba la vista interactiva con información de ejemplo, sin necesidad de registro ni tarjeta.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Crea tu cuenta</h3>
                  <p>El acceso utiliza correo y contraseña con autenticación segura. El registro no activa cobros ni planes.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Prepara tu espacio</h3>
                  <p>El alta de la lavandería se realiza una vez completadas las verificaciones técnicas del servicio.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-space page-container pricing-section" id="planes">
          <div className="section-heading centered">
            <span className="eyebrow">CLARO DESDE EL COMIENZO</span>
            <h2>Un plan para cada etapa.</h2>
            <p>
              Propuesta comercial para una lavandería y un local.
              <br />
              Los planes todavía no están disponibles para contratar.
            </p>
          </div>

          <PlanCards />

          <p className="pricing-note">
            Precios previstos en Soles (PEN). Tratamiento del IGV y límites comerciales pendientes de definición. No se realizan cobros desde esta página.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="section-space faq-section page-container" id="preguntas">
          <div>
            <span className="eyebrow">ANTES DE EMPEZAR</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-4">Las cosas claras.</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Lo que necesitas saber sobre esta versión y el proceso de desarrollo de LavaGest.
            </p>
            <Link className="text-link" href="/planes">
              Ver la propuesta completa de planes <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="faq-list">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="faq-plus" aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="closing-section page-container pb-16">
          <div className="closing-banner">
            <div className="flex items-center gap-6">
              <span className="closing-symbol shrink-0" aria-hidden="true">
                <WashingMachine size={40} strokeWidth={1.5} />
              </span>
              <div>
                <span className="eyebrow bg-sky-950/80 text-sky-200">TU NEGOCIO, CON MÁS CLARIDAD</span>
                <h2>
                  Una mejor forma de
                  <br />
                  ver tu lavandería.
                </h2>
                <p>Empieza por conocer la experiencia que estamos construyendo.</p>
              </div>
            </div>

            <a className="button button-white shrink-0" href="#demo">
              Explorar LavaGest <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
