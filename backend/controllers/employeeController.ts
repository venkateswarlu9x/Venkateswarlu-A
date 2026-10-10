/**
 * Employee Controller - Handles HR CRUD operations and business logic
 */

import { Request, Response } from 'express';
import { db } from '../models/database.js';

export const getEmployees = (req: Request, res: Response): void => {
  try {
    const { search, department_id, status, sortBy, sortOrder, page, limit } = req.query;

    const result = db.getAllEmployees({
      search: typeof search === 'string' ? search : undefined,
      department_id: typeof department_id === 'string' ? department_id : undefined,
      status: typeof status === 'string' ? status : undefined,
      sortBy: typeof sortBy === 'string' ? (sortBy as any) : undefined,
      sortOrder: typeof sortOrder === 'string' ? (sortOrder as any) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: result.employees,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employees',
      error: error.message,
    });
  }
};

export const getEmployeeById = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid employee ID format' });
      return;
    }

    const employee = db.getEmployeeById(id);
    if (!employee) {
      res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee details',
      error: error.message,
    });
  }
};

export const getEmployeesByDepartment = (req: Request, res: Response): void => {
  try {
    const departmentId = Number(req.params.departmentId);
    if (isNaN(departmentId)) {
      res.status(400).json({ success: false, message: 'Invalid department ID format' });
      return;
    }

    const employees = db.getEmployeesByDepartment(departmentId);
    res.status(200).json({
      success: true,
      message: `Retrieved employees for department ${departmentId}`,
      data: employees,
      count: employees.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees by department',
      error: error.message,
    });
  }
};

export const createEmployee = (req: Request, res: Response): void => {
  try {
    const {
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      hire_date,
      job_title,
      salary,
      department_id,
      address,
      city,
      status,
    } = req.body;

    // Validation 1: Required fields
    if (
      !employee_code?.trim() ||
      !first_name?.trim() ||
      !last_name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !gender ||
      !date_of_birth ||
      !hire_date ||
      !job_title?.trim() ||
      salary === undefined ||
      salary === null ||
      salary === '' ||
      !department_id ||
      !address?.trim() ||
      !city?.trim()
    ) {
      res.status(400).json({
        success: false,
        message: 'All fields are required. Please check missing inputs.',
      });
      return;
    }

    // Validation 2: Email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Invalid email address format (example: name@company.com)',
      });
      return;
    }

    // Validation 3: Phone format (at least 7 to 15 digits/characters)
    const phoneClean = phone.trim().replace(/[\s\-()]/g, '');
    if (phoneClean.length < 7 || phoneClean.length > 15 || !/^\+?\d+$/.test(phoneClean)) {
      res.status(400).json({
        success: false,
        message: 'Phone number must contain between 7 and 15 digits',
      });
      return;
    }

    // Validation 4: Numeric salary and >= 0
    const numSalary = Number(salary);
    if (isNaN(numSalary) || numSalary < 0) {
      res.status(400).json({
        success: false,
        message: 'Salary must be a valid non-negative number',
      });
      return;
    }

    // Validation 5: Date validations
    const dobDate = new Date(date_of_birth);
    const hireDateObj = new Date(hire_date);
    if (isNaN(dobDate.getTime()) || isNaN(hireDateObj.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid date format provided for Date of Birth or Hire Date',
      });
      return;
    }

    if (dobDate >= hireDateObj) {
      res.status(400).json({
        success: false,
        message: 'Date of birth must be prior to the hire date',
      });
      return;
    }

    const newEmp = db.createEmployee({
      employee_code: employee_code.trim().toUpperCase(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      date_of_birth,
      hire_date,
      job_title: job_title.trim(),
      salary: numSalary,
      department_id: Number(department_id),
      address: address.trim(),
      city: city.trim(),
      status: status === 'Inactive' ? 'Inactive' : 'Active',
    });

    res.status(201).json({
      success: true,
      message: `Employee ${newEmp.first_name} ${newEmp.last_name} created successfully!`,
      data: newEmp,
    });
  } catch (error: any) {
    const isConflict = error.message.includes('already exists');
    res.status(isConflict ? 409 : 400).json({
      success: false,
      message: error.message || 'Failed to create employee',
    });
  }
};

export const updateEmployee = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid employee ID format' });
      return;
    }

    const {
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      hire_date,
      job_title,
      salary,
      department_id,
      address,
      city,
      status,
    } = req.body;

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        res.status(400).json({
          success: false,
          message: 'Invalid email address format',
        });
        return;
      }
    }

    // Phone validation if provided
    if (phone) {
      const phoneClean = phone.trim().replace(/[\s\-()]/g, '');
      if (phoneClean.length < 7 || phoneClean.length > 15 || !/^\+?\d+$/.test(phoneClean)) {
        res.status(400).json({
          success: false,
          message: 'Phone number must contain between 7 and 15 digits',
        });
        return;
      }
    }

    // Salary validation if provided
    if (salary !== undefined && salary !== null && salary !== '') {
      const numSalary = Number(salary);
      if (isNaN(numSalary) || numSalary < 0) {
        res.status(400).json({
          success: false,
          message: 'Salary must be a valid non-negative number',
        });
        return;
      }
    }

    const updated = db.updateEmployee(id, {
      ...(employee_code && { employee_code: employee_code.trim().toUpperCase() }),
      ...(first_name && { first_name: first_name.trim() }),
      ...(last_name && { last_name: last_name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(phone && { phone: phone.trim() }),
      ...(gender && { gender }),
      ...(date_of_birth && { date_of_birth }),
      ...(hire_date && { hire_date }),
      ...(job_title && { job_title: job_title.trim() }),
      ...(salary !== undefined && { salary: Number(salary) }),
      ...(department_id && { department_id: Number(department_id) }),
      ...(address && { address: address.trim() }),
      ...(city && { city: city.trim() }),
      ...(status && { status }),
    });

    res.status(200).json({
      success: true,
      message: `Employee ${updated.first_name} ${updated.last_name} updated successfully!`,
      data: updated,
    });
  } catch (error: any) {
    const isConflict = error.message.includes('already exists') || error.message.includes('already registered');
    res.status(isConflict ? 409 : 400).json({
      success: false,
      message: error.message || 'Failed to update employee',
    });
  }
};

export const deleteEmployee = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid employee ID format' });
      return;
    }

    const result = db.deleteEmployee(id);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedEmployee,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to delete employee',
    });
  }
};
