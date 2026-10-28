import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  trend,
  trendPositive = true,
  description,
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
          {value}
        </span>
      </div>
      {(trend || description) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-semibold ${
                trendPositive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {trend}
            </span>
          )}
          {description && <span className="text-slate-400 truncate">{description}</span>}
        </div>
      )}
    </div>
  );
}
