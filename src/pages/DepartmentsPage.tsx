import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { Department } from '../types/index.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

interface DepartmentsPageProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onNotify }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal for Add / Edit
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptName, setDeptName] = useState<string>('');
  const [deptDesc, setDeptDesc] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal for Delete
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDept(null);
    setDeptName('');
    setDeptDesc('');
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setDeptName(dept.department_name);
    setDeptDesc(dept.description || '');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!deptName.trim()) {
      setFormError('Department name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingDept) {
        await apiService.updateDepartment(editingDept.department_id, {
          department_name: deptName.trim(),
          description: deptDesc.trim(),
        });
        onNotify('success', `Department '${deptName}' updated successfully`);
      } else {
        await apiService.createDepartment({
          department_name: deptName.trim(),
          description: deptDesc.trim(),
        });
        onNotify('success', `New Department '${deptName}' created successfully`);
      }
      setIsFormOpen(false);
      loadDepartments();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiService.deleteDepartment(deleteTarget.department_id);
      onNotify('success', `Department '${deleteTarget.department_name}' was removed.`);
      setDeleteTarget(null);
      loadDepartments();
    } catch (err: any) {
      onNotify('error', err.message || 'Could not delete department');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Department Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure organizational departments and view employee headcounts per unit.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Relational Foreign Key Note Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Relational Database Constraint:</strong> In MySQL, the{' '}
          <code className="text-blue-700 font-mono">department_id</code> column in the employees table enforces a{' '}
          <code className="text-blue-700 font-mono">FOREIGN KEY</code> referencing this table. A department with existing active employees cannot be deleted until its members are reassigned or removed.
        </p>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No departments found. Click "Add Department" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 border-b border-slate-200/70">
                <tr>
                  <th className="px-5 py-3.5 w-16">ID</th>
                  <th className="px-5 py-3.5">Department Name</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-center">Headcount</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {departments.map((dept) => (
                  <tr key={dept.department_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-500">
                      #{dept.department_id}
                    </td>

                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{dept.department_name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-md">
                      {dept.description || <span className="text-slate-400 italic">No description provided</span>}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/employees?department_id=${dept.department_id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="View employees in this department"
                      >
                        <Users className="w-3 h-3" />
                        <span>{dept.employee_count ?? 0}</span>
                      </Link>
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/employees?department_id=${dept.department_id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Filter employees"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(dept)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit department"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(dept)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete department"
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
      </div>

      {/* Add / Edit Department Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Quality Assurance"
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="Responsibilities, scope, and objectives of this department..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  <span>{editingDept ? 'Update Department' : 'Create Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Department Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Department"
        message={
          deleteTarget
            ? deleteTarget.employee_count && deleteTarget.employee_count > 0
              ? `Warning: '${deleteTarget.department_name}' currently has ${deleteTarget.employee_count} employee(s) assigned to it.\n\nDatabase Foreign Key constraint will block this deletion until all employees are reassigned.`
              : `Are you sure you want to delete department '${deleteTarget.department_name}'?`
            : ''
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
