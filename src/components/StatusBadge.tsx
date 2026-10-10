import React from 'react';

interface StatusBadgeProps {
  status: 'Active' | 'Inactive' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'Active';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isActive ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-400 ring-2 ring-slate-100'
        }`}
      />
      <span className={isActive ? 'text-emerald-800' : 'text-slate-600'}>
        {status}
      </span>
    </span>
  );
};
