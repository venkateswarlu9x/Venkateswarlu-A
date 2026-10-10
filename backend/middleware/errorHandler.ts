/**
 * Centralized Error Handling Middleware
 */

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[API Server Error]:', err);

  const statusCode = err.statusCode || (err.message?.includes('already exists') ? 409 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
