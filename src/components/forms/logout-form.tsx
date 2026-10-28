"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{pending ? "Cerrando sesión…" : "Cerrar sesión"}</span>
    </button>
  );
}

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <Submit />
    </form>
  );
}
