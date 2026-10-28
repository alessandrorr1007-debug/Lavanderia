"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <header className="site-header"><div className="site-header-inner">
    <Brand />
    <button ref={toggle} className="icon-button public-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="public-navigation" aria-label={open ? "Cerrar navegación" : "Abrir navegación"}>{open ? <X /> : <Menu />}</button>
    <nav id="public-navigation" className={`public-navigation${open ? " is-open" : ""}`} aria-label="Navegación principal">
      <Link href="/#funciones" onClick={() => setOpen(false)}>La experiencia</Link>
      <Link href="/#demo" onClick={() => setOpen(false)}>Vista interactiva</Link>
      <Link href="/#planes" onClick={() => setOpen(false)}>Planes</Link>
      <span className="nav-divider" />
      <Link href="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
      <Link className="button button-small" href="/registro" onClick={() => setOpen(false)}>Crear cuenta <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </nav>
  </div></header>;
}
