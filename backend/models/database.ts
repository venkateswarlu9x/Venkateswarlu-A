/**
 * Database Layer for Employee Management System
 * Implements relational constraints, foreign keys, auto-increment,
 * and data access operations matching the MySQL schema.
 */

import { Department, Employee, EmployeeQueryParams, DashboardStats } from '../types.js';

// Initial Seed Data matching /database/schema.sql
const INITIAL_DEPARTMENTS: Department[] = [
  {
    department_id: 1,
    department_name: 'Human Resources',
    description: 'Manages talent acquisition, onboarding, employee relations, and HR compliance.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    department_id: 2,
    department_name: 'IT',
    description: 'Responsible for software engineering, system administration, cloud infrastructure, and cybersecurity.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    department_id: 3,
    department_name: 'Finance',
    description: 'Oversees accounting, auditing, budget allocations, taxation, and financial planning.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    department_id: 4,
    department_name: 'Marketing',
    description: 'Executes brand strategy, lead generation, digital campaigns, and public relations.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    department_id: 5,
    department_name: 'Sales',
    description: 'Handles customer acquisitions, enterprise accounts, revenue growth, and client retention.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    department_id: 6,
    department_name: 'Operations',
    description: 'Coordinates logistics, facility management, quality assurance, and operational workflows.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    employee_id: 1,
    employee_code: 'EMP-1001',
    first_name: 'Aarav',
    last_name: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    gender: 'Male',
    date_of_birth: '1992-04-15',
    hire_date: '2021-03-10',
    job_title: 'Senior Full Stack Developer',
    salary: 85000,
    department_id: 2,
    address: 'Flat 402, Green Glen Heights',
    city: 'Bangalore',
    status: 'Active',
    created_at: '2021-03-10T10:00:00Z',
    updated_at: '2024-02-15T14:30:00Z',
  },
  {
    employee_id: 2,
    employee_code: 'EMP-1002',
    first_name: 'Priya',
    last_name: 'Nair',
    email: 'priya.nair@example.com',
    phone: '9845123456',
    gender: 'Female',
    date_of_birth: '1990-08-22',
    hire_date: '2019-07-01',
    job_title: 'HR Business Partner',
    salary: 72000,
    department_id: 1,
    address: 'B-12, Palm Meadows',
    city: 'Hyderabad',
    status: 'Active',
    created_at: '2019-07-01T10:00:00Z',
    updated_at: '2024-01-20T11:15:00Z',
  },
  {
    employee_id: 3,
    employee_code: 'EMP-1003',
    first_name: 'Rohan',
    last_name: 'Verma',
    email: 'rohan.verma@example.com',
    phone: '9711223344',
    gender: 'Male',
    date_of_birth: '1994-11-05',
    hire_date: '2022-01-15',
    job_title: 'DevOps & Cloud Engineer',
    salary: 78000,
    department_id: 2,
    address: 'House 44, Sector 21',
    city: 'Gurgaon',
    status: 'Active',
    created_at: '2022-01-15T09:30:00Z',
    updated_at: '2023-11-10T16:45:00Z',
  },
  {
    employee_id: 4,
    employee_code: 'EMP-1004',
    first_name: 'Sneha',
    last_name: 'Patel',
    email: 'sneha.patel@example.com',
    phone: '9900112233',
    gender: 'Female',
    date_of_birth: '1993-02-18',
    hire_date: '2020-09-01',
    job_title: 'Financial Analyst',
    salary: 68000,
    department_id: 3,
    address: '103 Shanti Enclave',
    city: 'Ahmedabad',
    status: 'Active',
    created_at: '2020-09-01T09:00:00Z',
    updated_at: '2023-10-05T12:00:00Z',
  },
  {
    employee_id: 5,
    employee_code: 'EMP-1005',
    first_name: 'Vikram',
    last_name: 'Rao',
    email: 'vikram.rao@example.com',
    phone: '9822334455',
    gender: 'Male',
    date_of_birth: '1988-12-30',
    hire_date: '2018-05-12',
    job_title: 'Enterprise Sales Director',
    salary: 95000,
    department_id: 5,
    address: 'Plot 89, Jubilee Hills',
    city: 'Hyderabad',
    status: 'Active',
    created_at: '2018-05-12T10:00:00Z',
    updated_at: '2024-03-01T15:20:00Z',
  },
  {
    employee_id: 6,
    employee_code: 'EMP-1006',
    first_name: 'Ananya',
    last_name: 'Deshmukh',
    email: 'ananya.deshmukh@example.com',
    phone: '9765432109',
    gender: 'Female',
    date_of_birth: '1995-06-14',
    hire_date: '2022-08-20',
    job_title: 'Digital Marketing Specialist',
    salary: 58000,
    department_id: 4,
    address: 'C-701, Pride World City',
    city: 'Pune',
    status: 'Active',
    created_at: '2022-08-20T10:30:00Z',
    updated_at: '2024-01-12T09:10:00Z',
  },
  {
    employee_id: 7,
    employee_code: 'EMP-1007',
    first_name: 'Karthik',
    last_name: 'Iyer',
    email: 'karthik.iyer@example.com',
    phone: '9840123987',
    gender: 'Male',
    date_of_birth: '1991-09-09',
    hire_date: '2020-02-17',
    job_title: 'Senior QA Automation Engineer',
    salary: 71000,
    department_id: 2,
    address: '14/B, Gandhi Nagar',
    city: 'Chennai',
    status: 'Inactive',
    created_at: '2020-02-17T09:00:00Z',
    updated_at: '2024-04-01T10:00:00Z',
  },
  {
    employee_id: 8,
    employee_code: 'EMP-1008',
    first_name: 'Meera',
    last_name: 'Kapoor',
    email: 'meera.kapoor@example.com',
    phone: '9810987654',
    gender: 'Female',
    date_of_birth: '1996-03-25',
    hire_date: '2023-04-10',
    job_title: 'Talent Acquisition Executive',
    salary: 48000,
    department_id: 1,
    address: 'D-45, Vasant Kunj',
    city: 'New Delhi',
    status: 'Active',
    created_at: '2023-04-10T11:00:00Z',
    updated_at: '2024-02-18T13:40:00Z',
  },
  {
    employee_id: 9,
    employee_code: 'EMP-1009',
    first_name: 'Arjun',
    last_name: 'Reddy',
    email: 'arjun.reddy@example.com',
    phone: '9988776655',
    gender: 'Male',
    date_of_birth: '1989-07-19',
    hire_date: '2019-11-25',
    job_title: 'Supply Chain & Operations Manager',
    salary: 76000,
    department_id: 6,
    address: 'Flat 12, Gachibowli View',
    city: 'Hyderabad',
    status: 'Active',
    created_at: '2019-11-25T09:30:00Z',
    updated_at: '2023-12-15T17:00:00Z',
  },
  {
    employee_id: 10,
    employee_code: 'EMP-1010',
    first_name: 'Divya',
    last_name: 'Menon',
    email: 'divya.menon@example.com',
    phone: '9744556677',
    gender: 'Female',
    date_of_birth: '1994-01-11',
    hire_date: '2021-10-05',
    job_title: 'Senior Accountant',
    salary: 64000,
    department_id: 3,
    address: '501 Horizon Towers',
    city: 'Kochi',
    status: 'Active',
    created_at: '2021-10-05T10:00:00Z',
    updated_at: '2024-01-08T11:45:00Z',
  },
  {
    employee_id: 11,
    employee_code: 'EMP-1011',
    first_name: 'Siddharth',
    last_name: 'Chopra',
    email: 'siddharth.chopra@example.com',
    phone: '9871122334',
    gender: 'Male',
    date_of_birth: '1993-10-03',
    hire_date: '2022-03-01',
    job_title: 'Content & SEO Strategist',
    salary: 55000,
    department_id: 4,
    address: 'Flat 304, Silver Crest',
    city: 'Mumbai',
    status: 'Inactive',
    created_at: '2022-03-01T09:15:00Z',
    updated_at: '2024-03-15T14:10:00Z',
  },
  {
    employee_id: 12,
    employee_code: 'EMP-1012',
    first_name: 'Tanvi',
    last_name: 'Joshi',
    email: 'tanvi.joshi@example.com',
    phone: '9833445566',
    gender: 'Female',
    date_of_birth: '1996-05-18',
    hire_date: '2023-06-15',
    job_title: 'Operations Executive',
    salary: 45000,
    department_id: 6,
    address: 'A-203, Lakeview Apartments',
    city: 'Bengaluru',
    status: 'Active',
    created_at: '2023-06-15T11:00:00Z',
    updated_at: '2024-02-28T16:00:00Z',
  },
];

class DatabaseRepository {
  private departments: Department[];
  private employees: Employee[];
  private nextDeptId: number;
  private nextEmpId: number;

  constructor() {
    this.departments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
    this.employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    this.nextDeptId = 7;
    this.nextEmpId = 13;
  }

  public resetToSeed(): void {
    this.departments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
    this.employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    this.nextDeptId = 7;
    this.nextEmpId = 13;
  }

  // --- Department Operations ---

  public getAllDepartments(): Department[] {
    return this.departments.map((dept) => {
      const count = this.employees.filter((e) => e.department_id === dept.department_id).length;
      return {
        ...dept,
        employee_count: count,
      };
    });
  }

  public getDepartmentById(id: number): Department | null {
    const dept = this.departments.find((d) => d.department_id === id);
    if (!dept) return null;
    const count = this.employees.filter((e) => e.department_id === dept.department_id).length;
    return {
      ...dept,
      employee_count: count,
    };
  }

  public createDepartment(data: { department_name: string; description?: string }): Department {
    const trimmedName = data.department_name.trim();
    const existing = this.departments.find(
      (d) => d.department_name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      throw new Error(`Department '${trimmedName}' already exists.`);
    }

    const newDept: Department = {
      department_id: this.nextDeptId++,
      department_name: trimmedName,
      description: data.description?.trim() || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.departments.push(newDept);
    return { ...newDept, employee_count: 0 };
  }

  public updateDepartment(id: number, data: { department_name?: string; description?: string }): Department {
    const deptIndex = this.departments.findIndex((d) => d.department_id === id);
    if (deptIndex === -1) {
      throw new Error(`Department with ID ${id} not found.`);
    }

    if (data.department_name) {
      const trimmedName = data.department_name.trim();
      const duplicate = this.departments.find(
        (d) => d.department_id !== id && d.department_name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Department '${trimmedName}' already exists.`);
      }
      this.departments[deptIndex].department_name = trimmedName;
    }

    if (data.description !== undefined) {
      this.departments[deptIndex].description = data.description.trim();
    }

    this.departments[deptIndex].updated_at = new Date().toISOString();
    const count = this.employees.filter((e) => e.department_id === id).length;
    return { ...this.departments[deptIndex], employee_count: count };
  }

  public deleteDepartment(id: number): { success: boolean; message: string } {
    const deptIndex = this.departments.findIndex((d) => d.department_id === id);
    if (deptIndex === -1) {
      throw new Error(`Department with ID ${id} not found.`);
    }

    // Foreign Key constraint check: prevent deleting if employees exist in this department
    const employeeCount = this.employees.filter((e) => e.department_id === id).length;
    if (employeeCount > 0) {
      throw new Error(
        `Cannot delete department: Foreign Key constraint violation. There are ${employeeCount} employee(s) assigned to this department. Please reassign or delete them first.`
      );
    }

    this.departments.splice(deptIndex, 1);
    return { success: true, message: 'Department successfully deleted.' };
  }

  // --- Employee Operations ---

  private enrichEmployeeWithDeptName(emp: Employee): Employee {
    const dept = this.departments.find((d) => d.department_id === emp.department_id);
    return {
      ...emp,
      department_name: dept ? dept.department_name : 'Unknown Department',
    };
  }

  public getAllEmployees(params: EmployeeQueryParams): {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let result = [...this.employees];

    // Filter by Search (name, employee_code, email, job_title)
    if (params.search && params.search.trim() !== '') {
      const q = params.search.trim().toLowerCase();
      result = result.filter((emp) => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        return (
          fullName.includes(q) ||
          emp.employee_code.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.job_title.toLowerCase().includes(q) ||
          emp.city.toLowerCase().includes(q)
        );
      });
    }

    // Filter by Department ID
    if (params.department_id && params.department_id !== 'all' && params.department_id !== '') {
      const deptId = Number(params.department_id);
      if (!isNaN(deptId) && deptId > 0) {
        result = result.filter((emp) => emp.department_id === deptId);
      }
    }

    // Filter by Status
    if (params.status && params.status !== 'all' && params.status !== '') {
      result = result.filter(
        (emp) => emp.status.toLowerCase() === (params.status as string).toLowerCase()
      );
    }

    // Sorting
    const sortBy = params.sortBy || 'employee_id';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB) * sortOrder;
      }
      if (sortBy === 'employee_code') {
        return a.employee_code.localeCompare(b.employee_code) * sortOrder;
      }
      if (sortBy === 'salary') {
        return (a.salary - b.salary) * sortOrder;
      }
      if (sortBy === 'hire_date') {
        return (new Date(a.hire_date).getTime() - new Date(b.hire_date).getTime()) * sortOrder;
      }
      if (sortBy === 'department_id') {
        return (a.department_id - b.department_id) * sortOrder;
      }
      // default: employee_id
      return (a.employee_id - b.employee_id) * sortOrder;
    });

    const total = result.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 10);
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      employees: paginated.map((e) => this.enrichEmployeeWithDeptName(e)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public getEmployeeById(id: number): Employee | null {
    const emp = this.employees.find((e) => e.employee_id === id);
    if (!emp) return null;
    return this.enrichEmployeeWithDeptName(emp);
  }

  public getEmployeesByDepartment(deptId: number): Employee[] {
    return this.employees
      .filter((e) => e.department_id === deptId)
      .map((e) => this.enrichEmployeeWithDeptName(e));
  }

  public createEmployee(data: Omit<Employee, 'employee_id' | 'created_at' | 'updated_at'>): Employee {
    // Validate uniqueness of employee_code
    const existingCode = this.employees.find(
      (e) => e.employee_code.toLowerCase() === data.employee_code.trim().toLowerCase()
    );
    if (existingCode) {
      throw new Error(`Employee Code '${data.employee_code}' already exists in database.`);
    }

    // Validate uniqueness of email
    const existingEmail = this.employees.find(
      (e) => e.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existingEmail) {
      throw new Error(`Employee with email '${data.email}' already exists.`);
    }

    // Validate department exists (Foreign Key constraint)
    const dept = this.departments.find((d) => d.department_id === Number(data.department_id));
    if (!dept) {
      throw new Error(`Invalid department ID ${data.department_id}. Foreign key constraint failed.`);
    }

    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...data,
      employee_id: this.nextEmpId++,
      department_id: Number(data.department_id),
      salary: Number(data.salary),
      created_at: now,
      updated_at: now,
    };

    this.employees.unshift(newEmployee);
    return this.enrichEmployeeWithDeptName(newEmployee);
  }

  public updateEmployee(id: number, data: Partial<Omit<Employee, 'employee_id' | 'created_at'>>): Employee {
    const empIndex = this.employees.findIndex((e) => e.employee_id === id);
    if (empIndex === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    // If updating employee_code, check unique
    if (data.employee_code) {
      const duplicateCode = this.employees.find(
        (e) => e.employee_id !== id && e.employee_code.toLowerCase() === data.employee_code!.trim().toLowerCase()
      );
      if (duplicateCode) {
        throw new Error(`Employee Code '${data.employee_code}' is already used by another record.`);
      }
    }

    // If updating email, check unique
    if (data.email) {
      const duplicateEmail = this.employees.find(
        (e) => e.employee_id !== id && e.email.toLowerCase() === data.email!.trim().toLowerCase()
      );
      if (duplicateEmail) {
        throw new Error(`Email '${data.email}' is already registered with another employee.`);
      }
    }

    // If updating department_id, check foreign key
    if (data.department_id) {
      const dept = this.departments.find((d) => d.department_id === Number(data.department_id));
      if (!dept) {
        throw new Error(`Invalid department ID ${data.department_id}. Foreign key constraint failed.`);
      }
    }

    const existing = this.employees[empIndex];
    const updatedEmployee: Employee = {
      ...existing,
      ...data,
      employee_id: id,
      department_id: data.department_id !== undefined ? Number(data.department_id) : existing.department_id,
      salary: data.salary !== undefined ? Number(data.salary) : existing.salary,
      updated_at: new Date().toISOString(),
    };

    this.employees[empIndex] = updatedEmployee;
    return this.enrichEmployeeWithDeptName(updatedEmployee);
  }

  public deleteEmployee(id: number): { success: boolean; message: string; deletedEmployee: Employee } {
    const empIndex = this.employees.findIndex((e) => e.employee_id === id);
    if (empIndex === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    const deleted = this.employees[empIndex];
    this.employees.splice(empIndex, 1);
    return {
      success: true,
      message: `Employee ${deleted.first_name} ${deleted.last_name} (${deleted.employee_code}) was successfully deleted.`,
      deletedEmployee: this.enrichEmployeeWithDeptName(deleted),
    };
  }

  // --- Dashboard Statistics ---

  public getDashboardStats(): DashboardStats {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter((e) => e.status === 'Active').length;
    const inactiveEmployees = this.employees.filter((e) => e.status === 'Inactive').length;
    const totalDepartments = this.departments.length;

    const totalSalary = this.employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
    const averageSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;

    const departmentDistribution = this.departments.map((dept) => {
      const count = this.employees.filter((e) => e.department_id === dept.department_id).length;
      const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
      return {
        department_id: dept.department_id,
        department_name: dept.department_name,
        employee_count: count,
        percentage,
      };
    });

    const activePercentage = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

    // Recently added employees (sorted by created_at or employee_id descending, max 5)
    const recentEmployees = [...this.employees]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((e) => this.enrichEmployeeWithDeptName(e));

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      averageSalary,
      departmentDistribution,
      statusDistribution: {
        active: activeEmployees,
        inactive: inactiveEmployees,
        activePercentage,
      },
      recentEmployees,
    };
  }
}

// Singleton Database Repository Instance
export const db = new DatabaseRepository();
