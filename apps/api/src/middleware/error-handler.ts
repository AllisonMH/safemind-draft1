/**
 * Error Handling Middleware
 * Centralized error handling
 */

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(isDevelopment && { details: err.message, stack: err.stack }),
  });
};
