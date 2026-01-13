import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../config/database.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, password, firstName, lastName, governorate } = req.body;

      const user = await authService.register({
        email,
        phone,
        password,
        firstName,
        lastName,
        governorate,
      });

      ApiResponse.success(res, {
        message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني',
        data: {
          id: user.id,
          email: user.email,
        },
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { emailOrPhone, password, rememberMe } = req.body;

      const result = await authService.login(emailOrPhone, password, rememberMe || false);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.success(res, {
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.id);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      ApiResponse.success(res, {
        message: 'تم تسجيل الخروج بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return ApiResponse.error(res, { message: 'توكن التحديث مطلوب' }, 400);
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.success(res, {
        data: { accessToken: result.accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.sendPasswordResetEmail(email);

      ApiResponse.success(res, {
        message: 'إذا كان البريد مسجلاً، سيتم إرسال رابط إعادة التعيين',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);

      ApiResponse.success(res, {
        message: 'تم إعادة تعيين كلمة المرور بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);

      ApiResponse.success(res, {
        message: 'تم تأكيد البريد الإلكتروني بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          isVerified: true,
          street: true,
          city: true,
          governorate: true,
          postalCode: true,
          licenseNumber: true,
          licenseExpiry: true,
          licenseImage: true,
          nationalId: true,
          nationalIdImage: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      ApiResponse.success(res, { data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updateData = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          street: true,
          city: true,
          governorate: true,
          postalCode: true,
        },
      });

      ApiResponse.success(res, {
        message: 'تم تحديث الملف الشخصي بنجاح',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user!.id, currentPassword, newPassword);

      ApiResponse.success(res, {
        message: 'تم تغيير كلمة المرور بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }
}
