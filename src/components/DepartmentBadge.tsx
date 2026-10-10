import React from 'react';

interface DepartmentBadgeProps {
  name: string;
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ name }) => {
  return (
    <span className="text-xs font-medium text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/70 inline-flex items-center">
      {name}
    </span>
  );
};
