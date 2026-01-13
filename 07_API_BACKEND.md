# 🔌 Backend API - Node.js + Express + Prisma
# واجهة برمجة التطبيقات

---

## 📁 Backend Struktur

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── email.ts
│   │   └── upload.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── cars.controller.ts
│   │   ├── bookings.controller.ts
│   │   ├── customers.controller.ts
│   │   ├── payments.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── branches.controller.ts
│   │   ├── coupons.controller.ts
│   │   ├── admin.controller.ts
│   │   └── upload.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── upload.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── cars.routes.ts
│   │   ├── bookings.routes.ts
│   │   ├── customers.routes.ts
│   │   ├── payments.routes.ts
│   │   ├── reviews.routes.ts
│   │   ├── branches.routes.ts
│   │   ├── coupons.routes.ts
│   │   ├── admin.routes.ts
│   │   └── upload.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── cars.service.ts
│   │   ├── bookings.service.ts
│   │   ├── payments.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   ├── notification.service.ts
│   │   └── report.service.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── car.validator.ts
│   │   ├── booking.validator.ts
│   │   └── common.validator.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── pagination.ts
│   │   ├── apiResponse.ts
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── express.d.ts
│   │   └── api.types.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── uploads/
├── logs/
├── package.json
├── tsconfig.json
└── .env
```

---

## 🚀 Server Setup

```typescript
// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app: Application = express();
const httpServer = createServer(app);

// Socket.io للإشعارات الفورية
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware الأمان
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموحة، يرجى المحاولة لاحقاً',
  },
});
app.use('/api', limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// ملفات ثابتة
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// معالج الأخطاء
app.use(errorHandler);

export { app, httpServer };
```

```typescript
// src/server.ts

import { httpServer } from './app';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // الاتصال بقاعدة البيانات
    await prisma.$connect();
    logger.info('✅ تم الاتصال بقاعدة البيانات');

    // الاتصال بـ Redis
    await redis.connect();
    logger.info('✅ تم الاتصال بـ Redis');

    // بدء الخادم
    httpServer.listen(PORT, () => {
      logger.info(`🚀 الخادم يعمل على المنفذ ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ فشل في بدء الخادم:', error);
    process.exit(1);
  }
}

// معالجة إغلاق الخادم
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  await redis.disconnect();
  process.exit(0);
});

startServer();
```

---

## 🔐 Authentication API

```typescript
// src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authValidator } from '../validators/auth.validator';
import { auth } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// التسجيل
router.post(
  '/register',
  validate(authValidator.register),
  authController.register
);

// تسجيل الدخول
router.post(
  '/login',
  validate(authValidator.login),
  authController.login
);

// تسجيل الخروج
router.post('/logout', auth, authController.logout);

// تحديث التوكن
router.post('/refresh-token', authController.refreshToken);

// نسيت كلمة المرور
router.post(
  '/forgot-password',
  validate(authValidator.forgotPassword),
  authController.forgotPassword
);

// إعادة تعيين كلمة المرور
router.post(
  '/reset-password',
  validate(authValidator.resetPassword),
  authController.resetPassword
);

// تأكيد البريد الإلكتروني
router.post('/verify-email/:token', authController.verifyEmail);

// إرسال OTP
router.post('/send-otp', authController.sendOTP);

// التحقق من OTP
router.post('/verify-otp', authController.verifyOTP);

// الملف الشخصي
router.get('/me', auth, authController.getProfile);
router.put('/me', auth, authController.updateProfile);
router.put('/me/password', auth, authController.changePassword);

export default router;
```

```typescript
// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../utils/appError';

export class AuthController {
  private authService = new AuthService();

  // التسجيل
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, phone, password, firstName, lastName, governorate } = req.body;

      const user = await this.authService.register({
        email,
        phone,
        password,
        firstName,
        lastName,
        governorate,
      });

      // إرسال بريد التحقق
      await this.authService.sendVerificationEmail(user.id);

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
  };

  // تسجيل الدخول
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { emailOrPhone, password, rememberMe } = req.body;

      const result = await this.authService.login(emailOrPhone, password, rememberMe);

      // تعيين التوكن في الكوكيز
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
  };

  // تسجيل الخروج
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!.id);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      ApiResponse.success(res, {
        message: 'تم تسجيل الخروج بنجاح',
      });
    } catch (error) {
      next(error);
    }
  };

  // نسيت كلمة المرور
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.authService.sendPasswordResetEmail(email);

      ApiResponse.success(res, {
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      });
    } catch (error) {
      next(error);
    }
  };

  // إعادة تعيين كلمة المرور
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);

      ApiResponse.success(res, {
        message: 'تم إعادة تعيين كلمة المرور بنجاح',
      });
    } catch (error) {
      next(error);
    }
  };
}
```

```typescript
// src/services/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { EmailService } from './email.service';
import { AppError } from '../utils/appError';

export class AuthService {
  private emailService = new EmailService();

  async register(data: RegisterDTO) {
    // التحقق من وجود المستخدم
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

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // إنشاء رمز التحقق
    const verificationToken = uuidv4();

    // إنشاء المستخدم
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
    // البحث عن المستخدم
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

    // التحقق من الحساب
    if (!user.isActive) {
      throw new AppError('الحساب معطل. يرجى التواصل مع الدعم', 403);
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('بيانات الدخول غير صحيحة', 401);
    }

    // إنشاء التوكنات
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // حفظ التوكن في Redis
    await redis.set(
      `refresh_token:${user.id}`,
      refreshToken,
      'EX',
      30 * 24 * 60 * 60 // 30 يوم
    );

    // تحديث آخر تسجيل دخول
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

  generateAccessToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  }

  generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    );
  }

  sanitizeUser(user: any) {
    const { password, verificationToken, resetToken, ...sanitized } = user;
    return sanitized;
  }
}
```

---

## 🚗 Cars API

```typescript
// src/routes/cars.routes.ts

import { Router } from 'express';
import { CarsController } from '../controllers/cars.controller';
import { auth, optionalAuth } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { carValidator } from '../validators/car.validator';
import { uploadImages } from '../middleware/upload.middleware';

const router = Router();
const carsController = new CarsController();

// ======= Public Routes =======

// الحصول على جميع السيارات (مع الفلاتر)
router.get('/', optionalAuth, carsController.getAll);

// الحصول على السيارات المميزة
router.get('/featured', carsController.getFeatured);

// الحصول على الفئات
router.get('/categories', carsController.getCategories);

// البحث عن سيارات متاحة
router.get('/available', carsController.searchAvailable);

// الحصول على سيارة محددة
router.get('/:id', optionalAuth, carsController.getById);

// الحصول على تقييمات السيارة
router.get('/:id/reviews', carsController.getReviews);

// التحقق من التوفر
router.post('/:id/check-availability', carsController.checkAvailability);

// ======= Admin Routes =======

// إضافة سيارة
router.post(
  '/',
  auth,
  adminOnly,
  uploadImages('images', 10),
  validate(carValidator.create),
  carsController.create
);

// تعديل سيارة
router.put(
  '/:id',
  auth,
  adminOnly,
  uploadImages('images', 10),
  validate(carValidator.update),
  carsController.update
);

// حذف سيارة
router.delete('/:id', auth, adminOnly, carsController.delete);

// تعديل حالة السيارة
router.patch('/:id/status', auth, adminOnly, carsController.updateStatus);

// تحديث الصور
router.post(
  '/:id/images',
  auth,
  adminOnly,
  uploadImages('images', 10),
  carsController.uploadImages
);

// حذف صورة
router.delete('/:id/images/:imageId', auth, adminOnly, carsController.deleteImage);

// رفع نموذج 3D
router.post(
  '/:id/3d-model',
  auth,
  adminOnly,
  uploadImages('model', 1),
  carsController.upload3DModel
);

export default router;
```

```typescript
// src/controllers/cars.controller.ts

import { Request, Response, NextFunction } from 'express';
import { CarsService } from '../services/cars.service';
import { ApiResponse } from '../utils/apiResponse';
import { Pagination } from '../utils/pagination';

export class CarsController {
  private carsService = new CarsService();

  // الحصول على جميع السيارات
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category,
        transmission,
        fuelType,
        minPrice,
        maxPrice,
        seats,
        status,
        branchId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const filters = {
        search: search as string,
        category: category as string,
        transmission: transmission as string,
        fuelType: fuelType as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        seats: seats ? Number(seats) : undefined,
        status: status as string,
        branchId: branchId as string,
      };

      const result = await this.carsService.getAll(
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      ApiResponse.success(res, {
        data: result.cars,
        pagination: Pagination.create(result.total, Number(page), Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  // الحصول على سيارة محددة
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const car = await this.carsService.getById(id, userId);

      ApiResponse.success(res, { data: car });
    } catch (error) {
      next(error);
    }
  };

  // البحث عن سيارات متاحة
  searchAvailable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        pickupDate,
        returnDate,
        pickupLocation,
        category,
        page = 1,
        limit = 12,
      } = req.query;

      const result = await this.carsService.searchAvailable({
        pickupDate: new Date(pickupDate as string),
        returnDate: new Date(returnDate as string),
        pickupLocation: pickupLocation as string,
        category: category as string,
        page: Number(page),
        limit: Number(limit),
      });

      ApiResponse.success(res, {
        data: result.cars,
        pagination: Pagination.create(result.total, Number(page), Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  // إنشاء سيارة (Admin)
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const files = req.files as Express.Multer.File[];

      const car = await this.carsService.create(data, files);

      // تسجيل النشاط
      await this.carsService.logActivity(req.user!.id, 'CREATE_CAR', car.id);

      ApiResponse.success(res, {
        message: 'تم إضافة السيارة بنجاح',
        data: car,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  // تعديل سيارة (Admin)
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files as Express.Multer.File[];

      const car = await this.carsService.update(id, data, files);

      await this.carsService.logActivity(req.user!.id, 'UPDATE_CAR', car.id);

      ApiResponse.success(res, {
        message: 'تم تعديل السيارة بنجاح',
        data: car,
      });
    } catch (error) {
      next(error);
    }
  };

  // التحقق من التوفر
  checkAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      const availability = await this.carsService.checkAvailability(
        id,
        new Date(startDate),
        new Date(endDate)
      );

      ApiResponse.success(res, { data: availability });
    } catch (error) {
      next(error);
    }
  };
}
```

```typescript
// src/services/cars.service.ts

import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { AppError } from '../utils/appError';

export class CarsService {
  async getAll(
    filters: CarFilters,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) {
    const where: any = {
      isActive: true,
    };

    // تطبيق الفلاتر
    if (filters.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { licensePlate: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) where.category = filters.category;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.status) where.status = filters.status;
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.seats) where.seats = filters.seats;

    if (filters.minPrice || filters.maxPrice) {
      where.pricePerDay = {};
      if (filters.minPrice) where.pricePerDay.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerDay.lte = filters.maxPrice;
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          branch: { select: { id: true, nameAr: true } },
          features: { include: { feature: true } },
          _count: { select: { reviews: true, bookings: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    // حساب متوسط التقييم
    const carsWithRating = await Promise.all(
      cars.map(async (car) => {
        const avgRating = await prisma.review.aggregate({
          where: { carId: car.id, isApproved: true },
          _avg: { rating: true },
        });
        return {
          ...car,
          avgRating: avgRating._avg.rating || 0,
          reviewCount: car._count.reviews,
        };
      })
    );

    return { cars: carsWithRating, total };
  }

  async getById(id: string, userId?: string) {
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        branch: true,
        features: { include: { feature: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    // التحقق من المفضلة
    let isFavorite = false;
    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: { userId_carId: { userId, carId: id } },
      });
      isFavorite = !!favorite;
    }

    // متوسط التقييم
    const avgRating = await prisma.review.aggregate({
      where: { carId: id, isApproved: true },
      _avg: { rating: true },
    });

    return {
      ...car,
      isFavorite,
      avgRating: avgRating._avg.rating || 0,
    };
  }

  async searchAvailable(params: SearchAvailableParams) {
    const { pickupDate, returnDate, pickupLocation, category, page, limit } = params;

    // السيارات المحجوزة في الفترة المحددة
    const bookedCarIds = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'ACTIVE'] },
        OR: [
          { startDate: { lte: returnDate }, endDate: { gte: pickupDate } },
        ],
      },
      select: { carId: true },
    });

    const bookedIds = bookedCarIds.map((b) => b.carId);

    const where: any = {
      id: { notIn: bookedIds },
      status: 'AVAILABLE',
      isActive: true,
    };

    if (pickupLocation) {
      where.branchId = pickupLocation;
    }

    if (category) {
      where.category = category;
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          branch: { select: { nameAr: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    return { cars, total };
  }

  async checkAvailability(carId: string, startDate: Date, endDate: Date) {
    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    // التحقق من حالة السيارة
    if (car.status !== 'AVAILABLE') {
      return {
        available: false,
        reason: 'السيارة غير متاحة حالياً',
      };
    }

    // التحقق من الحجوزات المتعارضة
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return {
        available: false,
        reason: 'السيارة محجوزة في هذه الفترة',
        nextAvailable: conflictingBooking.endDate,
      };
    }

    // حساب السعر
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(car.pricePerDay) * days;

    return {
      available: true,
      days,
      pricePerDay: car.pricePerDay,
      totalPrice,
      deposit: car.deposit,
    };
  }
}
```

---

## 📅 Bookings API

```typescript
// src/routes/bookings.routes.ts

import { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';
import { auth } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { bookingValidator } from '../validators/booking.validator';

const router = Router();
const bookingsController = new BookingsController();

// ======= Customer Routes =======

// حجوزات العميل
router.get('/my-bookings', auth, bookingsController.getMyBookings);

// إنشاء حجز
router.post(
  '/',
  auth,
  validate(bookingValidator.create),
  bookingsController.create
);

// عرض حجز محدد
router.get('/:id', auth, bookingsController.getById);

// إلغاء حجز
router.post('/:id/cancel', auth, bookingsController.cancel);

// تعديل حجز
router.put(
  '/:id',
  auth,
  validate(bookingValidator.update),
  bookingsController.update
);

// ======= Admin Routes =======

// جميع الحجوزات
router.get('/', auth, adminOnly, bookingsController.getAll);

// تأكيد حجز
router.post('/:id/confirm', auth, adminOnly, bookingsController.confirm);

// رفض حجز
router.post('/:id/reject', auth, adminOnly, bookingsController.reject);

// بدء الإيجار
router.post('/:id/activate', auth, adminOnly, bookingsController.activate);

// إنهاء الإيجار
router.post('/:id/complete', auth, adminOnly, bookingsController.complete);

// تحديث حالة السيارة
router.post(
  '/:id/vehicle-condition',
  auth,
  adminOnly,
  bookingsController.updateVehicleCondition
);

export default router;
```

```typescript
// src/controllers/bookings.controller.ts

export class BookingsController {
  private bookingsService = new BookingsService();
  private notificationService = new NotificationService();

  // إنشاء حجز
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = req.body;

      // التحقق من التوفر
      const availability = await this.bookingsService.checkAvailability(
        data.carId,
        new Date(data.startDate),
        new Date(data.endDate)
      );

      if (!availability.available) {
        throw new AppError(availability.reason || 'السيارة غير متاحة', 400);
      }

      // إنشاء الحجز
      const booking = await this.bookingsService.create({
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });

      // إرسال إشعار
      await this.notificationService.send(userId, {
        type: 'BOOKING_CONFIRMED',
        title: 'تم استلام طلب الحجز',
        message: `تم استلام طلب حجزك رقم ${booking.bookingNumber}. سيتم مراجعته قريباً.`,
        data: { bookingId: booking.id },
      });

      ApiResponse.success(res, {
        message: 'تم إنشاء الحجز بنجاح',
        data: booking,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  // تأكيد الحجز (Admin)
  confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;

      const booking = await this.bookingsService.confirm(id, adminId);

      // إرسال إشعار للعميل
      await this.notificationService.send(booking.userId, {
        type: 'BOOKING_CONFIRMED',
        title: 'تم تأكيد حجزك',
        message: `تم تأكيد حجزك رقم ${booking.bookingNumber}. يرجى الحضور في الموعد المحدد.`,
        data: { bookingId: booking.id },
      });

      // إرسال بريد إلكتروني
      await this.emailService.sendBookingConfirmation(booking);

      ApiResponse.success(res, {
        message: 'تم تأكيد الحجز بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  };

  // بدء الإيجار (Admin)
  activate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { pickupMileage, pickupFuel, pickupCondition, pickupPhotos } = req.body;

      const booking = await this.bookingsService.activate(id, {
        pickupMileage,
        pickupFuel,
        pickupCondition,
        pickupPhotos,
      });

      // تحديث حالة السيارة
      await prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'RENTED' },
      });

      ApiResponse.success(res, {
        message: 'تم بدء الإيجار بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  };

  // إنهاء الإيجار (Admin)
  complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { returnMileage, returnFuel, returnCondition, returnPhotos, additionalCharges } = req.body;

      const booking = await this.bookingsService.complete(id, {
        returnMileage,
        returnFuel,
        returnCondition,
        returnPhotos,
        additionalCharges,
      });

      // تحديث حالة السيارة
      await prisma.car.update({
        where: { id: booking.carId },
        data: {
          status: 'AVAILABLE',
          mileage: returnMileage,
        },
      });

      // إرسال طلب تقييم
      await this.notificationService.send(booking.userId, {
        type: 'REVIEW_REQUEST',
        title: 'شاركنا رأيك',
        message: 'نتمنى أن تكون قد استمتعت بتجربتك. شاركنا رأيك حول السيارة.',
        data: { bookingId: booking.id },
      });

      ApiResponse.success(res, {
        message: 'تم إنهاء الإيجار بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 💳 Payments API

```typescript
// src/routes/payments.routes.ts

import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller';
import { auth } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';

const router = Router();
const paymentsController = new PaymentsController();

// مدفوعات العميل
router.get('/my-payments', auth, paymentsController.getMyPayments);

// تسجيل دفعة
router.post('/', auth, adminOnly, paymentsController.create);

// جميع المدفوعات (Admin)
router.get('/', auth, adminOnly, paymentsController.getAll);

// تفاصيل دفعة
router.get('/:id', auth, paymentsController.getById);

// استرداد مبلغ
router.post('/:id/refund', auth, adminOnly, paymentsController.refund);

// تحميل إيصال
router.get('/:id/receipt', auth, paymentsController.downloadReceipt);

export default router;
```

---

## 📊 Admin Dashboard API

```typescript
// src/routes/admin.routes.ts

import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { auth } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';

const router = Router();
const adminController = new AdminController();

// تطبيق middleware على جميع المسارات
router.use(auth, adminOnly);

// إحصائيات لوحة التحكم
router.get('/dashboard/stats', adminController.getDashboardStats);

// إحصائيات الإيرادات
router.get('/dashboard/revenue', adminController.getRevenueStats);

// إحصائيات الحجوزات
router.get('/dashboard/bookings-stats', adminController.getBookingsStats);

// أحدث الحجوزات
router.get('/dashboard/recent-bookings', adminController.getRecentBookings);

// تنبيهات النظام
router.get('/dashboard/alerts', adminController.getSystemAlerts);

// سجل النشاط
router.get('/activity-logs', adminController.getActivityLogs);

// التقارير
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/bookings', adminController.getBookingsReport);
router.get('/reports/cars', adminController.getCarsReport);
router.get('/reports/customers', adminController.getCustomersReport);

// تصدير التقارير
router.post('/reports/export', adminController.exportReport);

// الإعدادات
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
```

```typescript
// src/controllers/admin.controller.ts

export class AdminController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        todayBookings,
        totalBookings,
        pendingBookings,
        activeBookings,
        todayRevenue,
        monthRevenue,
        totalCars,
        availableCars,
        carsInMaintenance,
        activeCustomers,
        openTickets,
      ] = await Promise.all([
        // حجوزات اليوم
        prisma.booking.count({
          where: { createdAt: { gte: today } },
        }),
        // إجمالي الحجوزات
        prisma.booking.count(),
        // الحجوزات المعلقة
        prisma.booking.count({ where: { status: 'PENDING' } }),
        // الحجوزات النشطة
        prisma.booking.count({ where: { status: 'ACTIVE' } }),
        // إيرادات اليوم
        prisma.payment.aggregate({
          where: {
            status: 'PAID',
            paidAt: { gte: today },
          },
          _sum: { amount: true },
        }),
        // إيرادات الشهر
        prisma.payment.aggregate({
          where: {
            status: 'PAID',
            paidAt: {
              gte: new Date(today.getFullYear(), today.getMonth(), 1),
            },
          },
          _sum: { amount: true },
        }),
        // السيارات
        prisma.car.count({ where: { isActive: true } }),
        prisma.car.count({ where: { status: 'AVAILABLE', isActive: true } }),
        prisma.car.count({ where: { status: 'MAINTENANCE' } }),
        // العملاء النشطين
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            isActive: true,
            bookings: { some: {} },
          },
        }),
        // تذاكر الدعم المفتوحة
        prisma.supportTicket.count({
          where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
        }),
      ]);

      ApiResponse.success(res, {
        data: {
          todayBookings,
          totalBookings,
          pendingBookings,
          activeBookings,
          todayRevenue: todayRevenue._sum.amount || 0,
          monthRevenue: monthRevenue._sum.amount || 0,
          totalCars,
          availableCars,
          carsInMaintenance,
          activeCustomers,
          openTickets,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { period = 'month', startDate, endDate } = req.query;

      let dateFilter: any = {};

      if (startDate && endDate) {
        dateFilter = {
          paidAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        };
      } else {
        // الفترة الافتراضية
        const now = new Date();
        if (period === 'week') {
          dateFilter = {
            paidAt: { gte: new Date(now.setDate(now.getDate() - 7)) },
          };
        } else if (period === 'month') {
          dateFilter = {
            paidAt: { gte: new Date(now.setMonth(now.getMonth() - 1)) },
          };
        } else if (period === 'year') {
          dateFilter = {
            paidAt: { gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
          };
        }
      }

      const payments = await prisma.payment.findMany({
        where: {
          status: 'PAID',
          ...dateFilter,
        },
        include: {
          booking: {
            include: {
              car: { select: { category: true } },
            },
          },
        },
        orderBy: { paidAt: 'asc' },
      });

      // تجميع البيانات
      const revenueByDate = payments.reduce((acc, payment) => {
        const date = payment.paidAt!.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>);

      const revenueByCategory = payments.reduce((acc, payment) => {
        const category = payment.booking.car.category;
        acc[category] = (acc[category] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>);

      const revenueByMethod = payments.reduce((acc, payment) => {
        acc[payment.method] = (acc[payment.method] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>);

      ApiResponse.success(res, {
        data: {
          total: payments.reduce((sum, p) => sum + Number(p.amount), 0),
          count: payments.length,
          byDate: revenueByDate,
          byCategory: revenueByCategory,
          byMethod: revenueByMethod,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 🔔 Real-time Notifications (Socket.io)

```typescript
// src/services/notification.service.ts

import { io } from '../app';
import { prisma } from '../config/database';

export class NotificationService {
  async send(userId: string, notification: CreateNotificationDTO) {
    // حفظ في قاعدة البيانات
    const savedNotification = await prisma.notification.create({
      data: {
        userId,
        ...notification,
      },
    });

    // إرسال في الوقت الفعلي
    io.to(`user:${userId}`).emit('notification', savedNotification);

    return savedNotification;
  }

  async sendToAdmins(notification: CreateNotificationDTO) {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true },
    });

    for (const admin of admins) {
      await this.send(admin.id, notification);
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

// Socket.io handlers
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      socket.leave(`user:${userId}`);
    }
  });
});
```

---

## ➡️ Weiter zu: 08_SICHERHEIT_DEPLOYMENT.md
