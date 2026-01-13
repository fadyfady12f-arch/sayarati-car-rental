# 🔒 الأمان والنشر - Security & Deployment
# Sicherheit, Tests und Deployment

---

## 🛡️ Sicherheitsmaßnahmen

### 1. Input Validation (التحقق من المدخلات)

```typescript
// src/validators/auth.validator.ts

import { z } from 'zod';

export const authValidator = {
  register: z.object({
    body: z.object({
      firstName: z
        .string()
        .min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل')
        .max(50, 'الاسم الأول طويل جداً')
        .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يحتوي على أحرف غير صالحة'),
      lastName: z
        .string()
        .min(2, 'الكنية يجب أن تكون حرفين على الأقل')
        .max(50, 'الكنية طويلة جداً'),
      email: z
        .string()
        .email('البريد الإلكتروني غير صالح')
        .toLowerCase(),
      phone: z
        .string()
        .regex(/^\+963[0-9]{9}$/, 'رقم الهاتف غير صالح. يجب أن يبدأ بـ +963'),
      password: z
        .string()
        .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص'
        ),
      governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
      acceptTerms: z.literal(true, {
        errorMap: () => ({ message: 'يجب الموافقة على الشروط والأحكام' }),
      }),
    }),
  }),

  login: z.object({
    body: z.object({
      emailOrPhone: z.string().min(1, 'يرجى إدخال البريد أو رقم الهاتف'),
      password: z.string().min(1, 'يرجى إدخال كلمة المرور'),
      rememberMe: z.boolean().optional(),
    }),
  }),
};

// src/validators/booking.validator.ts

export const bookingValidator = {
  create: z.object({
    body: z.object({
      carId: z.string().uuid('معرف السيارة غير صالح'),
      startDate: z.string().datetime('تاريخ البدء غير صالح'),
      endDate: z.string().datetime('تاريخ الانتهاء غير صالح'),
      pickupLocation: z.string().min(1, 'يرجى تحديد موقع الاستلام'),
      returnLocation: z.string().min(1, 'يرجى تحديد موقع الإرجاع'),
      extras: z.array(z.string().uuid()).optional(),
      couponCode: z.string().optional(),
      customerNotes: z.string().max(500).optional(),
    }).refine((data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    }, {
      message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
    }),
  }),
};
```

### 2. Authentication Middleware

```typescript
// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { AppError } from '../utils/appError';

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
    // الحصول على التوكن
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('غير مصرح. يرجى تسجيل الدخول', 401);
    }

    // التحقق من التوكن في القائمة السوداء
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('جلسة غير صالحة. يرجى تسجيل الدخول مجدداً', 401);
    }

    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // التحقق من وجود المستخدم ونشاطه
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

    if (!token && req.cookies.accessToken) {
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
    // تجاهل الأخطاء - المستخدم ببساطة غير مسجل
    next();
  }
};
```

### 3. Role-Based Access Control

```typescript
// src/middleware/role.middleware.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/appError';

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

export const hasPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // تنفيذ التحقق من الصلاحيات
    // يمكن استخدام جدول صلاحيات في قاعدة البيانات
    next();
  };
};
```

### 4. Rate Limiting

```typescript
// src/middleware/rateLimiter.middleware.ts

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

// الحد العام
export const generalLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100,
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموحة. يرجى المحاولة بعد 15 دقيقة',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// حد صارم لتسجيل الدخول
export const loginLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:login:',
  }),
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 5, // 5 محاولات
  message: {
    success: false,
    message: 'تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة بعد ساعة',
  },
  skipSuccessfulRequests: true,
});

// حد لإنشاء الحجوزات
export const bookingLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:booking:',
  }),
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'تم تجاوز عدد طلبات الحجز. يرجى المحاولة لاحقاً',
  },
});
```

### 5. Security Headers

```typescript
// src/config/security.ts

import helmet from 'helmet';
import { Application } from 'express';

export const configureSecurity = (app: Application) => {
  // Helmet للرؤوس الأمنية
  app.use(helmet());

  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.FRONTEND_URL!],
      },
    })
  );

  // HSTS
  app.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    })
  );

  // منع Clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // منع MIME sniffing
  app.use(helmet.noSniff());

  // XSS Filter
  app.use(helmet.xssFilter());
};
```

### 6. SQL Injection Prevention (Prisma)

```typescript
// Prisma تحمي تلقائياً من SQL Injection
// لكن يجب الحذر مع raw queries

// ❌ خطأ - عرضة للحقن
const unsafeQuery = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;

// ✅ صحيح - استخدام Prisma client
const safeQuery = await prisma.user.findUnique({
  where: { email: userInput },
});

// ✅ صحيح - raw query مع parametrized
const safeRawQuery = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${Prisma.sql`${userInput}`}
`;
```

### 7. XSS Prevention

```typescript
// src/utils/sanitize.ts

import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // إزالة علامات HTML
    .trim();
};

// استخدام في الـ middleware
export const sanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};
```

### 8. File Upload Security

```typescript
// src/middleware/upload.middleware.ts

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { AppError } from '../utils/appError';

// التحقق من نوع الملف
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'model/gltf-binary', // GLB
    'model/gltf+json', // GLTF
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('نوع الملف غير مسموح', 400));
  }
};

// تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // اسم عشوائي آمن
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB للصور
    files: 10,
  },
});

export const uploadImages = (field: string, maxCount: number) => {
  return upload.array(field, maxCount);
};

// فحص الفيروسات (اختياري)
import ClamScan from 'clamscan';

export const scanFile = async (filePath: string): Promise<boolean> => {
  try {
    const clamscan = await new ClamScan().init();
    const { isInfected } = await clamscan.scanFile(filePath);
    return !isInfected;
  } catch {
    // في حالة عدم توفر ClamAV
    return true;
  }
};
```

---

## 🧪 Testing

### Unit Tests

```typescript
// tests/unit/auth.service.test.ts

import { AuthService } from '../../src/services/auth.service';
import { prisma } from '../../src/config/database';
import bcrypt from 'bcrypt';

jest.mock('../../src/config/database');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        phone: '+963912345678',
        password: 'Password123!',
        firstName: 'أحمد',
        lastName: 'محمد',
        governorate: 'دمشق',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        ...userData,
        password: 'hashedPassword',
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('id');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        phone: '+963912345678',
        password: 'Password123!',
        firstName: 'أحمد',
        lastName: 'محمد',
        governorate: 'دمشق',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(authService.register(userData)).rejects.toThrow(
        'البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً'
      );
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
        role: 'CUSTOMER',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login('test@example.com', 'password', false);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw error with incorrect password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login('test@example.com', 'wrongpassword', false)
      ).rejects.toThrow('بيانات الدخول غير صحيحة');
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/bookings.test.ts

import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/config/database';
import { generateToken } from '../helpers';

describe('Bookings API', () => {
  let customerToken: string;
  let adminToken: string;
  let testCar: any;
  let testUser: any;

  beforeAll(async () => {
    // إنشاء مستخدم اختبار
    testUser = await prisma.user.create({
      data: {
        email: 'testcustomer@example.com',
        phone: '+963912345678',
        password: 'hashedPassword',
        firstName: 'اختبار',
        lastName: 'مستخدم',
        role: 'CUSTOMER',
      },
    });

    // إنشاء سيارة اختبار
    testCar = await prisma.car.create({
      data: {
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        color: 'أبيض',
        licensePlate: 'TEST123',
        category: 'MIDSIZE',
        transmission: 'AUTOMATIC',
        fuelType: 'PETROL',
        seats: 5,
        doors: 4,
        pricePerDay: 100000,
        deposit: 500000,
        status: 'AVAILABLE',
      },
    });

    customerToken = generateToken(testUser);
    adminToken = generateToken({ ...testUser, role: 'ADMIN' });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { userId: testUser.id } });
    await prisma.car.delete({ where: { id: testCar.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        carId: testCar.id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        pickupLocation: 'فرع دمشق',
        returnLocation: 'فرع دمشق',
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('bookingNumber');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({});

      expect(response.status).toBe(401);
    });

    it('should fail with unavailable car', async () => {
      // تحديث السيارة لتكون غير متاحة
      await prisma.car.update({
        where: { id: testCar.id },
        data: { status: 'RENTED' },
      });

      const bookingData = {
        carId: testCar.id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        pickupLocation: 'فرع دمشق',
        returnLocation: 'فرع دمشق',
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(bookingData);

      expect(response.status).toBe(400);

      // إعادة السيارة للحالة المتاحة
      await prisma.car.update({
        where: { id: testCar.id },
        data: { status: 'AVAILABLE' },
      });
    });
  });

  describe('GET /api/bookings/my-bookings', () => {
    it('should return customer bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

### E2E Tests (Frontend)

```typescript
// tests/e2e/booking-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete booking flow successfully', async ({ page }) => {
    // البحث عن سيارة
    await page.fill('[data-testid="pickup-location"]', 'دمشق');
    await page.fill('[data-testid="pickup-date"]', '2024-03-01');
    await page.fill('[data-testid="return-date"]', '2024-03-05');
    await page.click('[data-testid="search-button"]');

    // انتظار نتائج البحث
    await page.waitForSelector('[data-testid="car-card"]');

    // اختيار سيارة
    await page.click('[data-testid="car-card"]:first-child [data-testid="book-button"]');

    // تسجيل الدخول (إذا لم يكن مسجلاً)
    if (await page.isVisible('[data-testid="login-form"]')) {
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'Password123!');
      await page.click('[data-testid="login-button"]');
    }

    // ملء بيانات الحجز
    await page.waitForSelector('[data-testid="booking-form"]');
    await page.click('[data-testid="same-location-checkbox"]');
    await page.click('[data-testid="continue-button"]');

    // اختيار الإضافات (اختياري)
    await page.click('[data-testid="continue-button"]');

    // المراجعة والتأكيد
    await page.waitForSelector('[data-testid="booking-summary"]');
    await page.click('[data-testid="accept-terms-checkbox"]');
    await page.click('[data-testid="confirm-booking-button"]');

    // التحقق من نجاح الحجز
    await page.waitForSelector('[data-testid="booking-success"]');
    expect(await page.textContent('[data-testid="booking-number"]')).toBeTruthy();
  });
});
```

---

## 🚀 Deployment

### Docker Setup

```dockerfile
# docker/frontend.Dockerfile

# مرحلة البناء
FROM node:20-alpine AS builder

WORKDIR /app

# نسخ ملفات التبعيات
COPY frontend/package*.json ./

# تثبيت التبعيات
RUN npm ci

# نسخ الكود المصدري
COPY frontend/ ./

# البناء للإنتاج
RUN npm run build

# مرحلة الإنتاج
FROM nginx:alpine

# نسخ إعدادات Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# نسخ الملفات المبنية
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# docker/backend.Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# نسخ ملفات التبعيات
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# تثبيت التبعيات
RUN npm ci

# توليد Prisma Client
RUN npx prisma generate

# نسخ الكود المصدري
COPY backend/ ./

# البناء
RUN npm run build

# مرحلة الإنتاج
FROM node:20-alpine

WORKDIR /app

# نسخ من البناء
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# إنشاء مجلد الرفع
RUN mkdir -p uploads logs

# المستخدم غير المميز
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml

version: '3.8'

services:
  # قاعدة البيانات
  postgres:
    image: postgres:15-alpine
    container_name: car_rental_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - car_rental_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: car_rental_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - car_rental_network
    healthcheck:
      test: ["CMD", "redis-cli", "--pass", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend
  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    container_name: car_rental_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    volumes:
      - uploads_data:/app/uploads
      - logs_data:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - car_rental_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
    container_name: car_rental_frontend
    restart: unless-stopped
    depends_on:
      - backend
    networks:
      - car_rental_network

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    container_name: car_rental_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - car_rental_network

volumes:
  postgres_data:
  redis_data:
  uploads_data:
  logs_data:

networks:
  car_rental_network:
    driver: bridge
```

### Nginx Configuration

```nginx
# docker/nginx.conf

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream servers
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name carrental.sy www.carrental.sy;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name carrental.sy www.carrental.sy;

        # SSL Certificates
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        # SSL Settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API Routes
        location /api {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Login Rate Limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
        }

        # Socket.io
        location /socket.io {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }

        # Uploads
        location /uploads {
            alias /app/uploads;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;

            # SPA fallback
            try_files $uri $uri/ /index.html;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: |
          cd backend
          npm ci

      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/backend.Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/frontend.Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/car-rental
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

---

## 📊 Monitoring & Logging

```typescript
// src/utils/logger.ts

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'car-rental-api' },
  transports: [
    // سجل الأخطاء
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
    }),
    // سجل عام
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// في بيئة التطوير، أضف Console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
```

```typescript
// src/middleware/requestLogger.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
    });
  });

  next();
};
```

---

## ✅ Checkliste vor dem Go-Live

```markdown
### قائمة التحقق قبل النشر

#### الأمان
- [ ] جميع البيانات الحساسة في متغيرات البيئة
- [ ] HTTPS مفعل
- [ ] Rate limiting مطبق
- [ ] Input validation على جميع المدخلات
- [ ] تم اختبار SQL Injection
- [ ] تم اختبار XSS
- [ ] CORS مهيأ بشكل صحيح
- [ ] Headers الأمنية مضافة

#### الأداء
- [ ] Gzip مفعل
- [ ] التخزين المؤقت (Caching) مهيأ
- [ ] الصور محسنة
- [ ] Lazy loading للمكونات
- [ ] Database indexes منشأة

#### الوظائف
- [ ] التسجيل وتسجيل الدخول يعملان
- [ ] عملية الحجز كاملة
- [ ] الدفع يعمل
- [ ] الإشعارات تصل
- [ ] البريد الإلكتروني يُرسل
- [ ] لوحة الإدارة تعمل

#### المراقبة
- [ ] نظام التسجيل (Logging) يعمل
- [ ] مراقبة الأخطاء مهيأة
- [ ] Health checks موجودة
- [ ] النسخ الاحتياطي مجدول

#### الإنتاج
- [ ] NODE_ENV=production
- [ ] Debug mode معطل
- [ ] Secret keys قوية
- [ ] SSL certificates صالحة
```

---

## 🎉 ملخص المشروع / Projektzusammenfassung

تم إنشاء **8 ملفات MD** تحتوي على:

1. **01_PROJEKT_UEBERSICHT.md** - نظرة عامة وتقنيات المشروع
2. **02_DATENBANK_SCHEMA.md** - مخطط قاعدة البيانات Prisma
3. **03_LANDING_PAGE.md** - الصفحة الرئيسية العربية
4. **04_KUNDENPORTAL.md** - بوابة العملاء الكاملة
5. **05_ADMIN_DASHBOARD.md** - لوحة تحكم المسؤول
6. **06_3D_VISUALISIERUNG.md** - التصميم ثلاثي الأبعاد والحركات
7. **07_API_BACKEND.md** - واجهة برمجة التطبيقات
8. **08_SICHERHEIT_DEPLOYMENT.md** - الأمان والنشر

**المميزات الرئيسية:**
- 100% Open Source
- تصميم RTL عربي كامل
- عرض سيارات 3D تفاعلي
- نظام حجز متكامل
- لوحة إدارة شاملة
- أمان متقدم
- جاهز للنشر مع Docker

🚗 **بالتوفيق في مشروعك!**
