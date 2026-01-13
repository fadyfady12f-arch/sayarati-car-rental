import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموحة. يرجى المحاولة بعد 15 دقيقة',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: 'تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة بعد ساعة',
  },
  skipSuccessfulRequests: true,
});

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'تم تجاوز عدد طلبات الحجز. يرجى المحاولة لاحقاً',
  },
});
