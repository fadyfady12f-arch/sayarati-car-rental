import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return ApiResponse.error(
      res,
      {
        message: 'خطأ في البيانات المدخلة',
        errors,
      },
      400
    );
  }

  // Custom AppError
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      {
        message: err.message,
        stack: err.stack,
      },
      err.statusCode
    );
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return ApiResponse.error(
      res,
      {
        message: 'خطأ في قاعدة البيانات',
      },
      400
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(
      res,
      {
        message: 'توكن غير صالح',
      },
      401
    );
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(
      res,
      {
        message: 'انتهت صلاحية الجلسة',
      },
      401
    );
  }

  // Default error
  return ApiResponse.error(
    res,
    {
      message: process.env.NODE_ENV === 'production'
        ? 'حدث خطأ في الخادم'
        : err.message,
      stack: err.stack,
    },
    500
  );
};
