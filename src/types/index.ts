/**
 * Frontend Type Definitions for Employee Management System
 */

export interface Department {
  department_id: number;
  department_name: string;
  description: string;
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  employee_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  hire_date: string;
  job_title: string;
  salary: number;
  department_id: number;
  department_name?: string;
  address: string;
  city: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  hire_date: string;
  job_title: string;
  salary: string | number;
  department_id: string | number;
  address: string;
  city: string;
  status: 'Active' | 'Inactive';
}

export interface EmployeeFilters {
  search: string;
  department_id: string;
  status: string;
  sortBy: 'name' | 'employee_code' | 'salary' | 'hire_date' | 'department_id' | 'employee_id';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface DepartmentDistribution {
  department_id: number;
  department_name: string;
  employee_count: number;
  percentage: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departmentDistribution: DepartmentDistribution[];
  statusDistribution: {
    active: number;
    inactive: number;
    activePercentage: number;
  };
  recentEmployees: Employee[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}
