import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  User,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { Employee } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { DepartmentBadge } from '../components/DepartmentBadge.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

interface EmployeeDetailPageProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ onNotify }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const loadEmployee = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getEmployeeById(Number(id));
        setEmployee(data);
      } catch (err: any) {
        onNotify('error', err.message || 'Failed to fetch employee details');
        navigate('/employees');
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployee();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!employee) return;
    setIsDeleting(true);
    try {
      await apiService.deleteEmployee(employee.employee_id);
      onNotify(
        'success',
        `Employee ${employee.first_name} ${employee.last_name} was removed from the database.`
      );
      navigate('/employees');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Record Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested employee record does not exist or was deleted.
        </p>
        <Link
          to="/employees"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {employee.first_name} {employee.last_name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-mono font-semibold text-slate-700">{employee.employee_code}</span>
              <span>·</span>
              <span>{employee.job_title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/employees/edit/${employee.employee_id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold font-mono tracking-tight shrink-0 shadow-2xs">
            {employee.first_name[0]}
            {employee.last_name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">
                {employee.first_name} {employee.last_name}
              </h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{employee.job_title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <DepartmentBadge name={employee.department_name || 'General'} />
              <span className="text-xs text-slate-500 font-mono">
                ID #{employee.employee_id}
              </span>
            </div>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Compensation
          </p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ₹{employee.salary.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">INR / month</p>
        </div>
      </div>

      {/* Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-semibold text-sm text-slate-900">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Contact Information</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Corporate Email</span>
              <a
                href={`mailto:${employee.email}`}
                className="font-mono text-blue-600 hover:underline break-all"
              >
                {employee.email}
              </a>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Phone Number</span>
              <a href={`tel:${employee.phone}`} className="font-mono text-slate-800 hover:text-blue-600">
                {employee.phone}
              </a>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Residential City</span>
              <span className="text-slate-800">{employee.city}</span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Street Address</span>
              <span className="text-slate-700 leading-relaxed">{employee.address}</span>
            </div>
          </div>
        </div>

        {/* Employment & Biographical */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-semibold text-sm text-slate-900">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Employment & Profile Data</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Gender</span>
                <span className="text-slate-800">{employee.gender}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block">Date of Birth</span>
                <span className="font-mono tabular-nums text-slate-700">
                  {new Date(employee.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Hire / Joining Date</span>
                <span className="font-mono tabular-nums text-slate-700 font-medium">
                  {new Date(employee.hire_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block">Department Unit</span>
                <span className="text-slate-800 font-medium">
                  {employee.department_name}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500 font-mono">
              <div>
                <span className="text-[11px] text-slate-400 block font-sans">Created In Database</span>
                <span>{new Date(employee.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-sans">Last Updated</span>
                <span>{new Date(employee.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Employee Record"
        message={`Are you sure you want to permanently delete ${employee.first_name} ${employee.last_name} (${employee.employee_code})?\n\nThis action cannot be undone.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Keep Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
