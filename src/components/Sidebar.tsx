import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserPlus,
  Info,
  X,
  Database,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  onResetData,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Add Employee', path: '/employees/add', icon: UserPlus },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64">
      {/* Top Brand in mobile or drawer header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            EM
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Employee Portal
            </h1>
            <p className="text-[11px] text-slate-500">HR CRUD & Filters</p>
          </div>
        </div>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Academic Project
        </div>
        <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Tech Stack</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            React 19 · Node.js · Express REST · MySQL Relational
          </p>
        </div>
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>REST API Active</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
        </div>
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onResetData();
          }}
          className="w-full py-1.5 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
        >
          Reset Demo Records
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
        {content}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex-1 max-w-xs w-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
