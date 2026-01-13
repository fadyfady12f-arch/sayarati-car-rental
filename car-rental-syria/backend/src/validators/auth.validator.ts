import { z } from 'zod';

export const authValidator = {
  register: z.object({
    body: z.object({
      firstName: z
        .string()
        .min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل')
        .max(50, 'الاسم الأول طويل جداً'),
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
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم'
        ),
      governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
    }),
  }),

  login: z.object({
    body: z.object({
      emailOrPhone: z.string().min(1, 'يرجى إدخال البريد أو رقم الهاتف'),
      password: z.string().min(1, 'يرجى إدخال كلمة المرور'),
      rememberMe: z.boolean().optional(),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('البريد الإلكتروني غير صالح'),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'رمز إعادة التعيين مطلوب'),
      password: z
        .string()
        .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
      newPassword: z
        .string()
        .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
    }),
  }),

  updateProfile: z.object({
    body: z.object({
      firstName: z.string().min(2).max(50).optional(),
      lastName: z.string().min(2).max(50).optional(),
      phone: z.string().regex(/^\+963[0-9]{9}$/).optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      governorate: z.string().optional(),
      postalCode: z.string().optional(),
    }),
  }),
};
