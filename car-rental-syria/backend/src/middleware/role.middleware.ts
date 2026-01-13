import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { AppError } from '../utils/appError.js';

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return next(new AppError('غير مصرح لك بالوصول لهذه الصفحة', 403));
  }
  next();
};

export const superAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return next(new AppError('صلاحيات المسؤول الأعلى مطلوبة', 403));
  }
  next();
};

export const employeeOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'].includes(req.user.role)) {
    return next(new AppError('غير مصرح لك بالوصول', 403));
  }
  next();
};
