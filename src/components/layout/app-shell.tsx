"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  WashingMachine,
  LayoutDashboard,
  ClipboardList,
  Users,
  Shirt,
  Wallet,
  ChartColumn,
  Settings,
  Store,
  CreditCard,
  Calendar,
  LifeBuoy,
  UserRoundCog,
  ArrowUpRight,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { LogoutForm } from "@/components/forms/logout-form";
import { ownerNav, superNav } from "@/lib/navigation";

const icons = {
  "layout-dashboard": LayoutDashboard,
  "clipboard-list": ClipboardList,
  users: Users,
  shirt: Shirt,
  "washing-machine": WashingMachine,
  wallet: Wallet,
  "chart-column": ChartColumn,
  settings: Settings,
  store: Store,
  "credit-card": CreditCard,
  calendar: Calendar,
  "life-buoy": LifeBuoy,
  "user-round-cog": UserRoundCog,
};

export function AppShell({
  children,
  superadmin = false,
  businessName = "Lavandería",
  canAccessPlatform = false,
  role = "owner",
}: {
  children: React.ReactNode;
  superadmin?: boolean;
  businessName?: string;
  canAccessPlatform?: boolean;
  role?: "owner" | "worker";
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = superadmin
    ? superNav
    : ownerNav.filter(
        item =>
          role === "owner" ||
          ["dashboard", "pedidos", "clientes", "servicios", "produccion"].includes(item.slug)
      );

  const roleLabel = superadmin ? "Superadmin" : role === "owner" ? "Propietario" : "Personal";
  const userInitials = (superadmin ? "SA" : businessName.slice(0, 2)).toUpperCase();

  // Navigation sidebar content
  const navContent = (
    <div className="flex flex-col h-full">
      {/* Brand area */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <WashingMachine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">Lava<span className="text-sky-400">Gest</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-0.5">
              {superadmin ? "Platform Admin" : "Gestión SaaS"}
            </span>
          </div>
        </Link>
        {mobileMenuOpen && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Tenant / Organization Chip */}
      <div className="mb-5 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center text-xs font-bold shrink-0">
          {userInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-slate-200 truncate">
            {superadmin ? "LavaGest Global" : businessName}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label={superadmin ? "Navegación de plataforma" : "Navegación de lavandería"} className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-3 py-1.5">
          {superadmin ? "Administración" : "Menú Principal"}
        </div>
        {navItems.map(item => {
          const Icon = icons[item.icon as keyof typeof icons] || LayoutDashboard;
          const url = "/" + item.slug;
          const isActive = pathname === url;

          return (
            <Link
              key={item.slug}
              href={url}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area: Demo Disclaimer, Switch panel & Logout */}
      <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Modo Demostración</span>
          </div>
          Sesión verificada. Datos operativos ficticios sin cobros.
        </div>

        {(superadmin || canAccessPlatform) && (
          <Link
            href={superadmin ? "/dashboard" : "/plataforma"}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-sky-400 hover:bg-slate-800/80 transition-colors"
          >
            <span>{superadmin ? "Ir a vista de lavandería" : "Panel de plataforma"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <div className="pt-1">
          <LogoutForm />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0c1a2e] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <WashingMachine className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">LavaGest</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
            DEMO
          </span>
          <div className="w-7 h-7 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-bold">
            {userInitials}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Accessible off-canvas) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-[#0c1a2e] p-5 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0c1a2e] border-r border-slate-800/80 p-5 shrink-0 min-h-screen sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Contextual Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              LavaGest <span className="text-slate-300">/</span> {superadmin ? "Plataforma" : businessName}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Quick search visual hint */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs border border-slate-200">
              <Search className="w-3.5 h-3.5" />
              <span>Buscar pedido o cliente</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono border border-slate-300 text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </div>

            {/* Demo pastille */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Datos Demostrativos</span>
            </span>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {superadmin ? "Admin" : businessName}
                </span>
                <span className="block text-[11px] text-slate-500 leading-tight">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
