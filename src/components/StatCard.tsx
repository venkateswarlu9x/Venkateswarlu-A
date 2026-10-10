import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
