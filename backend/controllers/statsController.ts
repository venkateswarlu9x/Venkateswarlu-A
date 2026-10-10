/**
 * Stats Controller - Computes dashboard metrics and handles demo data resets
 */

import { Request, Response } from 'express';
import { db } from '../models/database.js';

export const getDashboardStats = (_req: Request, res: Response): void => {
  try {
    const stats = db.getDashboardStats();
    res.status(200).json({
      success: true,
      message: 'Dashboard statistics computed successfully',
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard statistics',
      error: error.message,
    });
  }
};

export const resetSampleData = (_req: Request, res: Response): void => {
  try {
    db.resetToSeed();
    const stats = db.getDashboardStats();
    res.status(200).json({
      success: true,
      message: 'Database sample records successfully re-seeded to initial B.Tech project state.',
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset sample data',
      error: error.message,
    });
  }
};
