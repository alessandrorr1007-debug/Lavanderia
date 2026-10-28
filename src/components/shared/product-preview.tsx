"use client";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, ClipboardList, LayoutDashboard, Search, Shirt, Users, WashingMachine } from "lucide-react";
import { orders } from "@/lib/demo";
import { formatPEN } from "@/lib/billing";

const filters = ["Todos", "En proceso", "Listos"] as const;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function ProductPreview() {
  const [view, setView] = useState<"orders" | "production">("orders");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [search, setSearch] = useState("");
  const selected = orders.filter(order => (filter === "Todos" || (filter === "Listos" ? order.status === "Listo" : !["Listo", "Entregado"].includes(order.status))) && normalize(order.customer + " " + order.id).includes(normalize(search)));
  const pending = orders.filter(order => order.status !== "Entregado").length;
  return <div className="preview-window" id="demo" aria-label="Vista interactiva con datos ficticios">
    <div className="preview-topbar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>Tu espacio de trabajo</span><span className="preview-demo">DEMO</span></div>
    <div className="preview-body"><aside className="preview-rail" aria-hidden="true"><span className="preview-rail-logo"><WashingMachine size={20} /></span><LayoutDashboard size={18} /><span className="rail-active"><ClipboardList size={18} /></span><Users size={18} /><Shirt size={18} /><span className="rail-avatar">LG</span></aside>
    <div className="preview-workspace"><div className="preview-greeting"><div><span className="preview-eyebrow">LAVANDERÍA DE EJEMPLO</span><h2>Todo en su lugar.</h2></div><span className="preview-today">Vista de ejemplo <ArrowUpRight size={13} aria-hidden="true" /></span></div>
      <div className="preview-stats"><div><span>Pedidos de ejemplo</span><strong>{String(orders.length).padStart(2, "0")}</strong><small><ArrowDownLeft size={12} aria-hidden="true" /> Recepción organizada</small></div><div><span>Por entregar</span><strong>{String(pending).padStart(2, "0")}</strong><small><span className="small-dot" /> Seguimiento visible</small></div><div><span>Importe ilustrativo</span><strong>{formatPEN(orders.reduce((sum, order) => sum + order.amount, 0))}</strong><small>No representa cobros</small></div></div>
      <div className="preview-view-switch" aria-label="Vistas de demostración"><button type="button" aria-pressed={view === "orders"} onClick={() => setView("orders")}><ClipboardList size={15} aria-hidden="true" />Pedidos</button><button type="button" aria-pressed={view === "production"} onClick={() => setView("production")}><WashingMachine size={15} aria-hidden="true" />Producción</button></div>
      {view === "orders" ? <div className="preview-panel"><div className="preview-toolbar"><div className="preview-filters" aria-label="Filtrar pedidos ficticios">{filters.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div><label className="preview-search"><Search size={14} aria-hidden="true" /><input aria-label="Buscar en los pedidos de ejemplo" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar cliente o código" /></label></div>
        <div className="preview-table-wrap"><table className="preview-table"><caption className="sr-only">Pedidos ficticios de la vista interactiva</caption><thead><tr><th scope="col">Pedido / Cliente</th><th scope="col">Servicio</th><th scope="col">Estado</th><th scope="col">Total</th></tr></thead><tbody>{selected.map(order => <tr key={order.id}><td><strong>{order.id}</strong><span>{order.customer}</span></td><td>{order.service}<small>{order.items}</small></td><td><span className={`order-status status-${order.status === "Listo" ? "ready" : order.status === "Entregado" ? "done" : "progress"}`}>{order.status === "Listo" && <Check size={11} aria-hidden="true" />}{order.status}</span></td><td>{formatPEN(order.amount)}</td></tr>)}</tbody></table></div><p className="preview-count" role="status">{selected.length ? `${selected.length} pedidos de ejemplo` : "Sin coincidencias. Prueba otro cliente o código."}{(search || filter !== "Todos") && <button type="button" onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpiar filtros</button>}</p>
      </div> : <div className="preview-production" aria-label="Estados de producción ilustrativos">{["Recibido", "En lavado", "Listo", "Entregado"].map((status, index) => <section key={status}><h3><span className={`stage-dot stage-${index}`} />{status}<span>{orders.filter(order => order.status === status).length}</span></h3>{orders.filter(order => order.status === status).map(order => <div className="production-ticket" key={order.id}><strong>{order.id}</strong><p>{order.customer}</p><small>{order.service}</small><span>{order.items}</span></div>)}</section>)}</div>}
      <p className="preview-disclaimer"><span className="small-dot" /> Datos ficticios. Los controles solo cambian esta vista.</p>
    </div></div>
  </div>;
}
