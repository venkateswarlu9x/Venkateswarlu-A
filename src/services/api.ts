/**
 * API Client Service for communicating with Node.js/Express REST API
 */

import {
  Department,
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  DashboardStats,
  ApiResponse,
} from '../types/index.js';

const BASE_URL = '/api';

/**
 * Generic API request handler with error normalization
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.message || result.error || `HTTP ${res.status} Error`;
      throw new Error(errorMessage);
    }

    return result as T;
  } catch (error: any) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
}

export const apiService = {
  // --- Dashboard Stats ---
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await request<ApiResponse<DashboardStats>>('/stats');
    return response.data;
  },

  async resetData(): Promise<DashboardStats> {
    const response = await request<ApiResponse<DashboardStats>>('/stats/reset', {
      method: 'POST',
    });
    return response.data;
  },

  // --- Employees ---
  async getEmployees(filters: Partial<EmployeeFilters> = {}): Promise<{
    employees: Employee[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();

    if (filters.search) query.append('search', filters.search);
    if (filters.department_id && filters.department_id !== 'all') {
      query.append('department_id', filters.department_id);
    }
    if (filters.status && filters.status !== 'all') {
      query.append('status', filters.status);
    }
    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.sortOrder) query.append('sortOrder', filters.sortOrder);
    if (filters.page) query.append('page', String(filters.page));
    if (filters.limit) query.append('limit', String(filters.limit));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await request<ApiResponse<Employee[]>>(`/employees${queryString}`);

    return {
      employees: response.data || [],
      pagination: response.pagination || {
        total: response.data?.length || 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await request<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data;
  },

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    const payload = {
      ...data,
      salary: Number(data.salary),
      department_id: Number(data.department_id),
    };
    const response = await request<ApiResponse<Employee>>('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async updateEmployee(id: number, data: Partial<EmployeeFormData>): Promise<Employee> {
    const payload: any = { ...data };
    if (data.salary !== undefined && data.salary !== '') {
      payload.salary = Number(data.salary);
    }
    if (data.department_id !== undefined && data.department_id !== '') {
      payload.department_id = Number(data.department_id);
    }
    const response = await request<ApiResponse<Employee>>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async deleteEmployee(id: number): Promise<{ message: string; deletedEmployee: Employee }> {
    const response = await request<ApiResponse<Employee>>(`/employees/${id}`, {
      method: 'DELETE',
    });
    return {
      message: response.message,
      deletedEmployee: response.data,
    };
  },

  // --- Departments ---
  async getDepartments(): Promise<Department[]> {
    const response = await request<ApiResponse<Department[]>>('/departments');
    return response.data || [];
  },

  async getDepartmentById(id: number): Promise<Department> {
    const response = await request<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(data: { department_name: string; description?: string }): Promise<Department> {
    const response = await request<ApiResponse<Department>>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateDepartment(
    id: number,
    data: { department_name?: string; description?: string }
  ): Promise<Department> {
    const response = await request<ApiResponse<Department>>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteDepartment(id: number): Promise<{ message: string }> {
    const response = await request<ApiResponse<null>>(`/departments/${id}`, {
      method: 'DELETE',
    });
    return { message: response.message };
  },

  async getEmployeesByDepartment(departmentId: number): Promise<Employee[]> {
    const response = await request<ApiResponse<Employee[]>>(`/employees/department/${departmentId}`);
    return response.data || [];
  },
};
