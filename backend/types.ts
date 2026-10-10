/**
 * TypeScript Type Definitions for Employee Management System Backend
 */

export interface Department {
  department_id: number;
  department_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  employee_count?: number;
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

export interface EmployeeQueryParams {
  search?: string;
  department_id?: string | number;
  status?: string;
  sortBy?: 'name' | 'employee_code' | 'salary' | 'hire_date' | 'department_id' | 'employee_id';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departmentDistribution: {
    department_id: number;
    department_name: string;
    employee_count: number;
    percentage: number;
  }[];
  statusDistribution: {
    active: number;
    inactive: number;
    activePercentage: number;
  };
  recentEmployees: Employee[];
}
