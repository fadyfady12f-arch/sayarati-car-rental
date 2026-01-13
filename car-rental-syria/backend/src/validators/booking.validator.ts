import { z } from 'zod';

export const bookingValidator = {
  create: z.object({
    body: z.object({
      carId: z.string().uuid('معرف السيارة غير صالح'),
      startDate: z.string().datetime('تاريخ البدء غير صالح'),
      endDate: z.string().datetime('تاريخ الانتهاء غير صالح'),
      pickupLocation: z.string().min(1, 'يرجى تحديد موقع الاستلام'),
      returnLocation: z.string().min(1, 'يرجى تحديد موقع الإرجاع'),
      pickupBranchId: z.string().uuid().optional(),
      returnBranchId: z.string().uuid().optional(),
      extras: z.array(z.string().uuid()).optional(),
      couponCode: z.string().optional(),
      customerNotes: z.string().max(500).optional(),
      driverName: z.string().optional(),
      driverLicense: z.string().optional(),
      driverPhone: z.string().optional(),
    }).refine((data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    }, {
      message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().uuid('معرف الحجز غير صالح'),
    }),
    body: z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      pickupLocation: z.string().optional(),
      returnLocation: z.string().optional(),
      extras: z.array(z.string().uuid()).optional(),
      customerNotes: z.string().max(500).optional(),
    }),
  }),

  cancel: z.object({
    params: z.object({
      id: z.string().uuid('معرف الحجز غير صالح'),
    }),
    body: z.object({
      reason: z.string().max(500).optional(),
    }),
  }),

  updateStatus: z.object({
    params: z.object({
      id: z.string().uuid('معرف الحجز غير صالح'),
    }),
    body: z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
      adminNotes: z.string().optional(),
    }),
  }),

  vehicleCondition: z.object({
    params: z.object({
      id: z.string().uuid('معرف الحجز غير صالح'),
    }),
    body: z.object({
      type: z.enum(['pickup', 'return']),
      mileage: z.number().int().min(0),
      fuel: z.number().int().min(0).max(100),
      condition: z.string().optional(),
      photos: z.array(z.string()).optional(),
    }),
  }),
};
