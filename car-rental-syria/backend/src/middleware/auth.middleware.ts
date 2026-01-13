import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { AppError } from '../utils/appError.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('غير مصرح. يرجى تسجيل الدخول', 401);
    }

    // Check blacklist
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('جلسة غير صالحة. يرجى تسجيل الدخول مجدداً', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('المستخدم غير موجود أو معطل', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('توكن غير صالح', 401));
    }
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: string;
      };
      req.user = decoded;
    }
    next();
  } catch {
    next();
  }
};
