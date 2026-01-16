import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Don't log expected errors in test environment
  if (process.env.NODE_ENV !== 'test' || !(err instanceof AppError)) {
    console.error('Unexpected Error: ', err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const firstError = err.errors[0];
    return res.status(400).json({
      error: `${firstError.path.join('.')}: ${firstError.message}`,
    });
  }

  // Unexpected errors
  return res.status(500).json({
    error: 'Internal server error',
  });
};
