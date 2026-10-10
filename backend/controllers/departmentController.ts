/**
 * Department Controller - Handles Department CRUD operations and foreign key relations
 */

import { Request, Response } from 'express';
import { db } from '../models/database.js';

export const getDepartments = (_req: Request, res: Response): void => {
  try {
    const departments = db.getAllDepartments();
    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: departments,
      count: departments.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve departments',
      error: error.message,
    });
  }
};

export const getDepartmentById = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid department ID' });
      return;
    }

    const dept = db.getDepartmentById(id);
    if (!dept) {
      res.status(404).json({
        success: false,
        message: `Department with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: dept,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message,
    });
  }
};

export const createDepartment = (req: Request, res: Response): void => {
  try {
    const { department_name, description } = req.body;
    if (!department_name || !department_name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Department name is required',
      });
      return;
    }

    const created = db.createDepartment({
      department_name: department_name.trim(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: `Department '${created.department_name}' created successfully`,
      data: created,
    });
  } catch (error: any) {
    const isConflict = error.message.includes('already exists');
    res.status(isConflict ? 409 : 400).json({
      success: false,
      message: error.message || 'Failed to create department',
    });
  }
};

export const updateDepartment = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid department ID' });
      return;
    }

    const { department_name, description } = req.body;
    if (department_name !== undefined && !department_name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Department name cannot be empty',
      });
      return;
    }

    const updated = db.updateDepartment(id, {
      department_name,
      description,
    });

    res.status(200).json({
      success: true,
      message: `Department '${updated.department_name}' updated successfully`,
      data: updated,
    });
  } catch (error: any) {
    const isConflict = error.message.includes('already exists');
    res.status(isConflict ? 409 : 400).json({
      success: false,
      message: error.message || 'Failed to update department',
    });
  }
};

export const deleteDepartment = (req: Request, res: Response): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid department ID' });
      return;
    }

    const result = db.deleteDepartment(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    const isFkConstraint = error.message.includes('Foreign Key constraint');
    res.status(isFkConstraint ? 400 : 404).json({
      success: false,
      message: error.message || 'Failed to delete department',
    });
  }
};
