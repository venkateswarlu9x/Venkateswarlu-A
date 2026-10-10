/**
 * Employee Routes - REST API endpoints for Employee resource
 */

import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
} from '../controllers/employeeController.js';

const router = Router();

// Department-specific employee retrieval
router.get('/department/:departmentId', getEmployeesByDepartment);

// Main CRUD endpoints
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
