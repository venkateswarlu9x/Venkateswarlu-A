import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  UserCheck,
  Building2,
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { Employee, Department } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DepartmentBadge } from '../components/DepartmentBadge.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

interface EmployeesPageProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onNotify }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state from URL or defaults
  const search = searchParams.get('search') || '';
  const departmentId = searchParams.get('department_id') || 'all';
  const status = searchParams.get('status') || 'all';
  const sortBy = (searchParams.get('sortBy') as any) || 'employee_id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  // State for delete modal
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load Departments once
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await apiService.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    loadDepartments();
  }, []);

  // Fetch Employees whenever filter state changes
  const fetchEmployeeData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getEmployees({
        search,
        department_id: departmentId,
        status,
        sortBy,
        sortOrder,
        page: currentPage,
        limit,
      });

      setEmployees(response.employees);
      setTotalCount(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      onNotify('error', err.message || 'Error loading employee records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [search, departmentId, status, sortBy, sortOrder, currentPage, limit]);

  // Helper to update search params
  const updateFilters = (newParams: Record<string, string | number>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '' || val === 'all' || val === undefined) {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });
    // Reset to page 1 on filter changes if page wasn't explicitly changed
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleSortToggle = (field: 'name' | 'employee_code' | 'salary' | 'hire_date' | 'department_id' | 'employee_id') => {
    if (sortBy === field) {
      updateFilters({
        sortBy: field,
        sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      updateFilters({
        sortBy: field,
        sortOrder: 'asc',
      });
    }
  };

  // Delete Action Handlers
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiService.deleteEmployee(deleteTarget.employee_id);
      onNotify(
        'success',
        `Employee ${deleteTarget.first_name} ${deleteTarget.last_name} (${deleteTarget.employee_code}) was successfully deleted.`
      );
      setDeleteTarget(null);
      fetchEmployeeData();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to delete employee record');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (employees.length === 0) {
      onNotify('info', 'No employee records to export');
      return;
    }

    const headers = [
      'Employee Code',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Job Title',
      'Salary (INR)',
      'Hire Date',
      'Status',
      'City',
    ];

    const rows = employees.map((e) => [
      e.employee_code,
      `"${e.first_name}"`,
      `"${e.last_name}"`,
      e.email,
      e.phone,
      `"${e.department_name || ''}"`,
      `"${e.job_title}"`,
      e.salary,
      e.hire_date,
      e.status,
      `"${e.city}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onNotify('success', 'CSV export file downloaded successfully');
  };

  const hasActiveFilters = search !== '' || departmentId !== 'all' || status !== 'all';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage HR records with department filters, instant search, and complete CRUD operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Live Search input */}
          <div className="relative lg:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search by name, employee code, email, title..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Department Filter Dropdown (Crucial requirement) */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={departmentId}
                onChange={(e) => updateFilters({ department_id: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 cursor-pointer"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name} ({dept.employee_count ?? 0})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active only</option>
              <option value="Inactive">Inactive only</option>
            </select>
          </div>

          {/* Reset Filters & Count */}
          <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                title="Reset all search queries and filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Total: {totalCount}
            </span>
          </div>
        </div>

        {/* Applied filter hints indicator */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Active Criteria:</span>
            {search && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                Search: "{search}"
              </span>
            )}
            {departmentId !== 'all' && (
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                Dept:{' '}
                {departments.find((d) => String(d.department_id) === String(departmentId))
                  ?.department_name || departmentId}
              </span>
            )}
            {status !== 'all' && (
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                Status: {status}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No employees found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {hasActiveFilters
                ? 'No records match your selected department or search criteria. Try adjusting or clearing filters.'
                : 'There are currently no employee records in the system.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            ) : (
              <Link
                to="/employees/add"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add first employee</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 border-b border-slate-200/70">
                <tr>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSortToggle('employee_code')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Code</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSortToggle('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Employee Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Job Title</th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSortToggle('department_id')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Department</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSortToggle('salary')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Salary</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSortToggle('hire_date')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Hire Date</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {employees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Employee Code */}
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">
                      {emp.employee_code}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <Link
                        to={`/employees/${emp.employee_id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {emp.first_name} {emp.last_name}
                      </Link>
                      <div className="text-xs text-slate-400">
                        {emp.gender} · {emp.city}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div className="font-mono text-slate-700">{emp.email}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{emp.phone}</div>
                    </td>

                    {/* Job Title */}
                    <td className="px-5 py-3.5 text-slate-800 font-medium text-xs">
                      {emp.job_title}
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5">
                      <DepartmentBadge name={emp.department_name || 'General'} />
                    </td>

                    {/* Salary */}
                    <td className="px-5 py-3.5 font-mono text-xs tabular-nums text-slate-700 font-medium">
                      ₹{emp.salary.toLocaleString('en-IN')}
                    </td>

                    {/* Hire Date */}
                    <td className="px-5 py-3.5 font-mono text-xs tabular-nums text-slate-600">
                      {new Date(emp.hire_date).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={emp.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/employees/${emp.employee_id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Employee Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/employees/edit/${emp.employee_id}`}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Employee Information"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-slate-700 font-mono tabular-nums">
              {employees.length === 0 ? 0 : (currentPage - 1) * limit + 1} -{' '}
              {Math.min(currentPage * limit, totalCount)}
            </span>
            <span>of</span>
            <span className="font-semibold text-slate-700 font-mono tabular-nums">{totalCount}</span>
            <span>employees</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Limit selector */}
            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={limit}
                onChange={(e) => updateFilters({ limit: Number(e.target.value), page: 1 })}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateFilters({ page: currentPage - 1 })}
                disabled={currentPage <= 1}
                className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-slate-700 font-medium tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => updateFilters({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Employee Record"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.first_name} ${deleteTarget.last_name} (${deleteTarget.employee_code})?\n\nThis will permanently delete this record from the database.`
            : ''
        }
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
