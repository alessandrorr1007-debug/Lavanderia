import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "emerald"
  | "amber"
  | "slate"
  | "purple"
  | "rose"
  | "received"
  | "washing"
  | "drying"
  | "ready"
  | "delivered";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant = "default", children, icon, className = "" }: BadgeProps) {
  let styleClasses = "bg-slate-100 text-slate-700 border-slate-200";

  switch (variant) {
    case "primary":
    case "washing":
      styleClasses = "bg-sky-50 text-sky-700 border-sky-200";
      break;
    case "emerald":
    case "ready":
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "amber":
    case "drying":
      styleClasses = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "purple":
      styleClasses = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case "rose":
      styleClasses = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "received":
      styleClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    case "delivered":
    case "slate":
      styleClasses = "bg-slate-100 text-slate-600 border-slate-200";
      break;
    case "default":
    default:
      styleClasses = "bg-sky-50 text-sky-700 border-sky-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
