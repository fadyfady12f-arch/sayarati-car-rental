import { Request, Response, NextFunction } from 'express';
import { CarsService } from '../services/cars.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Pagination } from '../utils/pagination.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../config/database.js';

const carsService = new CarsService();

export class CarsController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
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

      const result = await carsService.getAll(
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
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const car = await carsService.getById(id, userId);

      ApiResponse.success(res, { data: car });
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const cars = await carsService.getFeatured(limit);

      ApiResponse.success(res, { data: cars });
    } catch (error) {
      next(error);
    }
  }

  async searchAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        pickupDate,
        returnDate,
        pickupLocation,
        category,
        page = 1,
        limit = 12,
      } = req.query;

      if (!pickupDate || !returnDate) {
        return ApiResponse.error(res, { message: 'تاريخ الاستلام والإرجاع مطلوبان' }, 400);
      }

      const result = await carsService.searchAvailable({
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
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      const availability = await carsService.checkAvailability(
        id,
        new Date(startDate),
        new Date(endDate)
      );

      ApiResponse.success(res, { data: availability });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = [
        { id: 'ECONOMY', nameAr: 'اقتصادية', nameEn: 'Economy' },
        { id: 'COMPACT', nameAr: 'صغيرة', nameEn: 'Compact' },
        { id: 'MIDSIZE', nameAr: 'متوسطة', nameEn: 'Midsize' },
        { id: 'FULLSIZE', nameAr: 'كبيرة', nameEn: 'Fullsize' },
        { id: 'LUXURY', nameAr: 'فاخرة', nameEn: 'Luxury' },
        { id: 'SUV', nameAr: 'دفع رباعي', nameEn: 'SUV' },
        { id: 'VAN', nameAr: 'فان', nameEn: 'Van' },
        { id: 'PICKUP', nameAr: 'بيك أب', nameEn: 'Pickup' },
        { id: 'SPORTS', nameAr: 'رياضية', nameEn: 'Sports' },
        { id: 'CONVERTIBLE', nameAr: 'مكشوفة', nameEn: 'Convertible' },
      ];

      // Get count per category
      const categoryCounts = await prisma.car.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { isActive: true },
      });

      const categoriesWithCount = categories.map((cat) => {
        const count = categoryCounts.find((c) => c.category === cat.id);
        return { ...cat, count: count?._count.id || 0 };
      });

      ApiResponse.success(res, { data: categoriesWithCount });
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { carId: id, isApproved: true },
          include: {
            user: { select: { firstName: true, lastName: true, profileImage: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.review.count({ where: { carId: id, isApproved: true } }),
      ]);

      ApiResponse.success(res, {
        data: reviews,
        pagination: Pagination.create(total, Number(page), Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin methods
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const files = req.files as Express.Multer.File[];

      const car = await carsService.create(data, files);

      ApiResponse.success(res, {
        message: 'تم إضافة السيارة بنجاح',
        data: car,
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files as Express.Multer.File[];

      const car = await carsService.update(id, data, files);

      ApiResponse.success(res, {
        message: 'تم تعديل السيارة بنجاح',
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await carsService.delete(id);

      ApiResponse.success(res, {
        message: 'تم حذف السيارة بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const car = await carsService.updateStatus(id, status);

      ApiResponse.success(res, {
        message: 'تم تحديث حالة السيارة',
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }
}
