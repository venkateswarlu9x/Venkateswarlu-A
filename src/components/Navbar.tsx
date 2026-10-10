import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Plus, RefreshCw, Users, Database } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onResetData: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onResetData,
  isResetting = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Project Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                EMS Portal
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500">
                · B.Tech Final Year Project
              </span>
            </div>
          </NavLink>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Database & Reset Demo Data */}
          <button
            type="button"
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to initial 12 sample records"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors border border-slate-200/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Data</span>
          </button>

          {/* Database indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>MySQL Schema Active</span>
          </div>

          {/* Quick Add Employee CTA */}
          <NavLink
            to="/employees/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
