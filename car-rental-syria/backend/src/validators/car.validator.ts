import { z } from 'zod';

const carCategoryEnum = z.enum([
  'ECONOMY', 'COMPACT', 'MIDSIZE', 'FULLSIZE', 'LUXURY',
  'SUV', 'VAN', 'PICKUP', 'SPORTS', 'CONVERTIBLE'
]);

const transmissionEnum = z.enum(['AUTOMATIC', 'MANUAL']);
const fuelTypeEnum = z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG']);
const carStatusEnum = z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'RESERVED', 'UNAVAILABLE']);

export const carValidator = {
  create: z.object({
    body: z.object({
      brand: z.string().min(1, 'الماركة مطلوبة'),
      model: z.string().min(1, 'الموديل مطلوب'),
      year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
      color: z.string().min(1, 'اللون مطلوب'),
      licensePlate: z.string().min(1, 'رقم اللوحة مطلوب'),
      vin: z.string().optional(),
      category: carCategoryEnum,
      transmission: transmissionEnum,
      fuelType: fuelTypeEnum,
      seats: z.number().int().min(2).max(12),
      doors: z.number().int().min(2).max(5),
      engineSize: z.number().positive().optional(),
      horsepower: z.number().int().positive().optional(),
      tankCapacity: z.number().positive().optional(),
      mileage: z.number().int().min(0).default(0),
      pricePerDay: z.number().positive('السعر اليومي مطلوب'),
      pricePerWeek: z.number().positive().optional(),
      pricePerMonth: z.number().positive().optional(),
      deposit: z.number().min(0).default(0),
      status: carStatusEnum.optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      branchId: z.string().uuid().optional(),
      currentLocation: z.string().optional(),
      featureIds: z.array(z.string().uuid()).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().uuid('معرف السيارة غير صالح'),
    }),
    body: z.object({
      brand: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
      year: z.number().int().min(2000).max(new Date().getFullYear() + 1).optional(),
      color: z.string().min(1).optional(),
      licensePlate: z.string().min(1).optional(),
      vin: z.string().optional(),
      category: carCategoryEnum.optional(),
      transmission: transmissionEnum.optional(),
      fuelType: fuelTypeEnum.optional(),
      seats: z.number().int().min(2).max(12).optional(),
      doors: z.number().int().min(2).max(5).optional(),
      engineSize: z.number().positive().optional(),
      horsepower: z.number().int().positive().optional(),
      tankCapacity: z.number().positive().optional(),
      mileage: z.number().int().min(0).optional(),
      pricePerDay: z.number().positive().optional(),
      pricePerWeek: z.number().positive().optional(),
      pricePerMonth: z.number().positive().optional(),
      deposit: z.number().min(0).optional(),
      status: carStatusEnum.optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      branchId: z.string().uuid().optional(),
      currentLocation: z.string().optional(),
      featureIds: z.array(z.string().uuid()).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().uuid('معرف السيارة غير صالح'),
    }),
  }),
};
