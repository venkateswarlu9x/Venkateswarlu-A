import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Building2,
  User,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { Department, EmployeeFormData } from '../types/index.js';

interface EmployeeFormPageProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

const INITIAL_FORM: EmployeeFormData = {
  employee_code: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: 'Male',
  date_of_birth: '1995-01-01',
  hire_date: new Date().toISOString().slice(0, 10),
  job_title: '',
  salary: '',
  department_id: '',
  address: '',
  city: '',
  status: 'Active',
};

export const EmployeeFormPage: React.FC<EmployeeFormPageProps> = ({ onNotify }) => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_FORM);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState<boolean>(isEditing);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Load Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await apiService.getDepartments();
        setDepartments(data);
        if (!isEditing && data.length > 0 && !formData.department_id) {
          setFormData((prev) => ({ ...prev, department_id: data[0].department_id }));
        }
      } catch (err: any) {
        onNotify('error', 'Failed to fetch departments list');
      }
    };
    fetchDepartments();
  }, [isEditing]);

  // If Editing, load existing Employee data
  useEffect(() => {
    if (!isEditing || !id) return;

    const loadEmployee = async () => {
      setIsFetchingEmployee(true);
      try {
        const emp = await apiService.getEmployeeById(Number(id));
        setFormData({
          employee_code: emp.employee_code,
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          phone: emp.phone,
          gender: emp.gender,
          date_of_birth: emp.date_of_birth.slice(0, 10),
          hire_date: emp.hire_date.slice(0, 10),
          job_title: emp.job_title,
          salary: emp.salary,
          department_id: emp.department_id,
          address: emp.address,
          city: emp.city,
          status: emp.status,
        });
      } catch (err: any) {
        onNotify('error', err.message || 'Failed to load employee details for editing');
        navigate('/employees');
      } finally {
        setIsFetchingEmployee(false);
      }
    };

    loadEmployee();
  }, [id, isEditing, navigate]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Quick Employee Code Generator
  const handleGenerateCode = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, employee_code: `EMP-${randomSuffix}` }));
  };

  // Client-Side Validations
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.employee_code.trim()) errors.employee_code = 'Employee Code is required';
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';

    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format (e.g. user@domain.com)';
    }

    // Phone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.trim().replace(/[\s\-()]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^\+?\d+$/.test(cleanPhone)) {
        errors.phone = 'Phone number must contain between 7 and 15 digits';
      }
    }

    // Dates
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.hire_date) errors.hire_date = 'Hire date is required';
    if (formData.date_of_birth && formData.hire_date) {
      if (new Date(formData.date_of_birth) >= new Date(formData.hire_date)) {
        errors.date_of_birth = 'Date of birth must be earlier than hire date';
      }
    }

    // Job Title & Salary
    if (!formData.job_title.trim()) errors.job_title = 'Job title is required';
    if (formData.salary === '' || formData.salary === undefined) {
      errors.salary = 'Salary is required';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) < 0) {
      errors.salary = 'Salary must be a non-negative number';
    }

    // Department
    if (!formData.department_id) errors.department_id = 'Please assign a department';

    // Location
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      onNotify('error', 'Please resolve the highlighted validation errors');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && id) {
        await apiService.updateEmployee(Number(id), formData);
        onNotify(
          'success',
          `Employee ${formData.first_name} ${formData.last_name} was updated successfully!`
        );
      } else {
        await apiService.createEmployee(formData);
        onNotify(
          'success',
          `New employee ${formData.first_name} ${formData.last_name} created successfully!`
        );
      }
      navigate('/employees');
    } catch (err: any) {
      setServerError(err.message || 'Operation failed. Please try again.');
      onNotify('error', err.message || 'Error saving employee to database');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingEmployee) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Employees list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditing ? 'Edit Employee Information' : 'Add New Employee'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? `Update database records for ${formData.employee_code}`
                : 'Register and persist a new staff member to the MySQL database'}
            </p>
          </div>
        </div>

        <Link
          to="/employees"
          className="text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-semibold">Database Error</p>
            <p className="mt-0.5 text-xs text-red-700 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Identification & Personal Info */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {/* Employee Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="employee_code"
                    value={formData.employee_code}
                    onChange={handleChange}
                    placeholder="e.g. EMP-1015"
                    className={`flex-1 px-3 py-2 text-sm bg-slate-50/70 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      validationErrors.employee_code ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    }`}
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="px-2.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                      title="Auto-generate code"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto</span>
                    </button>
                  )}
                </div>
                {validationErrors.employee_code && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.employee_code}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.first_name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.first_name && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.last_name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.last_name && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.last_name}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.date_of_birth ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.date_of_birth && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.date_of_birth}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-sm">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Contact & Communication</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul.sharma@example.com"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Job Role & Department (Foreign Key relation) */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-sm">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Job Role & Organizational Department</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Department (Foreign Key) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-red-500">*</span> (Foreign Key)
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                    validationErrors.department_id ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name} ({dept.description || 'Active'})
                    </option>
                  ))}
                </select>
                {validationErrors.department_id && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.department_id}</p>
                )}
              </div>

              {/* Job Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.job_title ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.job_title && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.job_title}</p>
                )}
              </div>

              {/* Hire Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hire Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.hire_date ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.hire_date && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.hire_date}</p>
                )}
              </div>

              {/* Salary */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Salary (INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="75000"
                    min="0"
                    step="500"
                    className={`w-full pl-8 pr-3 py-2 text-sm bg-slate-50/70 border rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      validationErrors.salary ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    }`}
                  />
                </div>
                {validationErrors.salary && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.salary}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Address Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Location & Residential Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Flat 304, Green Heights, Outer Ring Road"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className={`w-full px-3 py-2 text-sm bg-slate-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    validationErrors.city ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {validationErrors.city && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset this form back to initial state?')) {
                setFormData(INITIAL_FORM);
                setValidationErrors({});
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Inputs</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/employees"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Submit & Save Record'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
