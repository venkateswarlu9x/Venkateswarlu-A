import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  DollarSign,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  TrendingUp,
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { DashboardStats, Employee } from '../types/index.js';
import { StatCard } from '../components/StatCard.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DepartmentBadge } from '../components/DepartmentBadge.js';

interface DashboardPageProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNotify }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics');
      onNotify('error', 'Error loading dashboard statistics from API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-72 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center bg-white rounded-xl border border-red-200 shadow-xs my-8">
        <h2 className="text-lg font-bold text-red-700">Unable to Load Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">{error || 'Server error occurred'}</p>
        <button
          onClick={loadDashboard}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            HR Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time employee metrics, department distribution, and HR records overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            Manage Records
          </Link>
          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle="Registered staff members"
          icon={<Users className="w-6 h-6" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          subtitle={`${stats.statusDistribution.activePercentage}% workforce active`}
          icon={<UserCheck className="w-6 h-6" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Inactive Employees"
          value={stats.inactiveEmployees}
          subtitle="On leave or offboarded"
          icon={<UserX className="w-6 h-6" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Total Departments"
          value={stats.totalDepartments}
          subtitle="Functional divisions"
          icon={<Building2 className="w-6 h-6" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees by Department Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Employees by Department
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff distribution across organizational units
              </p>
            </div>
            <Link
              to="/departments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Manage Units</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {stats.departmentDistribution.map((dept) => (
              <div key={dept.department_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Link
                    to={`/employees?department_id=${dept.department_id}`}
                    className="font-medium text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>{dept.department_name}</span>
                    <span className="text-slate-400 text-[11px]">→ view</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 tabular-nums">
                      {dept.percentage}%
                    </span>
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      {dept.employee_count} {dept.employee_count === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, dept.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution & Average Salary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Workforce Status
            </h2>
            <p className="text-xs text-slate-500">
              Operational availability of recorded staff
            </p>

            <div className="pt-2 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active Percentage Circle */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${stats.statusDistribution.activePercentage}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {stats.statusDistribution.activePercentage}%
                  </span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Active Members</span>
                <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                  {stats.activeEmployees}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Inactive Members</span>
                <span className="text-base font-bold text-slate-600 font-mono tabular-nums">
                  {stats.inactiveEmployees}
                </span>
              </div>
            </div>
          </div>

          {/* Average Salary Box */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Average Compensation
              </span>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{stats.averageSalary.toLocaleString('en-IN')} / mo
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Calculated across all registered departments
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recently Added Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Recently Added Employees
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest HR onboarding and staff registration entries
            </p>
          </div>
          <Link
            to="/employees"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View All Employees ({stats.totalEmployees})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentEmployees.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No employee records currently available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/60">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Employee Name</th>
                  <th className="px-5 py-3.5">Job Title</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Hire Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {stats.recentEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-700">
                      {emp.employee_code}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <Link
                        to={`/employees/${emp.employee_id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {emp.first_name} {emp.last_name}
                      </Link>
                      <div className="text-xs text-slate-400 font-mono">{emp.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{emp.job_title}</td>
                    <td className="px-5 py-3.5">
                      <DepartmentBadge name={emp.department_name || 'General'} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs tabular-nums text-slate-600">
                      {new Date(emp.hire_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/employees/${emp.employee_id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/employees/edit/${emp.employee_id}`}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
