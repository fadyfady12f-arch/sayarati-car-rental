import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { AppError } from '../utils/appError.js';

interface RegisterDTO {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  governorate: string;
}

export class AuthService {
  async register(data: RegisterDTO) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });

    if (existingUser) {
      throw new AppError('البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        verificationToken,
      },
    });

    return user;
  }

  async login(emailOrPhone: string, password: string, rememberMe: boolean) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone },
        ],
      },
    });

    if (!user) {
      throw new AppError('بيانات الدخول غير صحيحة', 401);
    }

    if (!user.isActive) {
      throw new AppError('الحساب معطل. يرجى التواصل مع الدعم', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('بيانات الدخول غير صحيحة', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await redis.set(
      `refresh_token:${user.id}`,
      refreshToken,
      'EX',
      30 * 24 * 60 * 60
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await redis.del(`refresh_token:${userId}`);
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

      const storedToken = await redis.get(`refresh_token:${decoded.id}`);
      if (storedToken !== refreshToken) {
        throw new AppError('توكن غير صالح', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw new AppError('المستخدم غير موجود', 401);
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      await redis.set(
        `refresh_token:${user.id}`,
        newRefreshToken,
        'EX',
        30 * 24 * 60 * 60
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AppError('توكن غير صالح', 401);
    }
  }

  async sendPasswordResetEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return;
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // TODO: Send email with reset link
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('رابط إعادة التعيين غير صالح أو منتهي الصلاحية', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('كلمة المرور الحالية غير صحيحة', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new AppError('رابط التحقق غير صالح', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
  }

  generateAccessToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }

  generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
  }

  sanitizeUser(user: any) {
    const { password, verificationToken, resetToken, resetTokenExpiry, ...sanitized } = user;
    return sanitized;
  }
}
