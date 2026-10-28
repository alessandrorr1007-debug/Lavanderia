import React from "react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  badge = "Modo demostración",
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 ring-8 ring-sky-50/50">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          {badge}
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{description}</p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
