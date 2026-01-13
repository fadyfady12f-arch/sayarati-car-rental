import { Response } from 'express';

interface SuccessResponse {
  message?: string;
  data?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ErrorResponse {
  message: string;
  errors?: any[];
  stack?: string;
}

export class ApiResponse {
  static success(res: Response, options: SuccessResponse, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      ...options,
    });
  }

  static error(res: Response, options: ErrorResponse, statusCode: number = 500) {
    const response: any = {
      success: false,
      message: options.message,
    };

    if (options.errors) {
      response.errors = options.errors;
    }

    if (process.env.NODE_ENV === 'development' && options.stack) {
      response.stack = options.stack;
    }

    return res.status(statusCode).json(response);
  }
}
