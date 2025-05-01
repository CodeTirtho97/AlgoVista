import { Request, Response, NextFunction } from 'express';
import config from '../config';

// Use a different name for the interface to avoid the merge conflict
interface IAppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Error handling middleware
export const errorHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;
  
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    isOperational,
    path: req.originalUrl
  });
  
  // Determine error response
  const errorResponse = {
    status: 'error',
    message: err.message || 'Something went wrong',
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      isOperational
    })
  };
  
  // Send response
  res.status(statusCode).json(errorResponse);
};

// Create custom application error with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle unhandled route
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  throw new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
};