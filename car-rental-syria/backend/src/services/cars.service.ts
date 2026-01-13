import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { Prisma } from '@prisma/client';

interface CarFilters {
  search?: string;
  category?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  status?: string;
  branchId?: string;
}

interface SearchAvailableParams {
  pickupDate: Date;
  returnDate: Date;
  pickupLocation?: string;
  category?: string;
  page: number;
  limit: number;
}

export class CarsService {
  async getAll(
    filters: CarFilters,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) {
    const where: Prisma.CarWhereInput = {
      isActive: true,
    };

    if (filters.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { licensePlate: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) where.category = filters.category as any;
    if (filters.transmission) where.transmission = filters.transmission as any;
    if (filters.fuelType) where.fuelType = filters.fuelType as any;
    if (filters.status) where.status = filters.status as any;
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

    let isFavorite = false;
    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: { userId_carId: { userId, carId: id } },
      });
      isFavorite = !!favorite;
    }

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

  async getFeatured(limit: number = 8) {
    const cars = await prisma.car.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        status: 'AVAILABLE',
      },
      include: {
        images: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { reviews: true } },
      },
      take: limit,
    });

    return Promise.all(
      cars.map(async (car) => {
        const avgRating = await prisma.review.aggregate({
          where: { carId: car.id, isApproved: true },
          _avg: { rating: true },
        });
        return {
          ...car,
          avgRating: avgRating._avg.rating || 0,
        };
      })
    );
  }

  async searchAvailable(params: SearchAvailableParams) {
    const { pickupDate, returnDate, pickupLocation, category, page, limit } = params;

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

    const where: Prisma.CarWhereInput = {
      id: { notIn: bookedIds },
      status: 'AVAILABLE',
      isActive: true,
    };

    if (pickupLocation) {
      where.branchId = pickupLocation;
    }

    if (category) {
      where.category = category as any;
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

    if (car.status !== 'AVAILABLE') {
      return {
        available: false,
        reason: 'السيارة غير متاحة حالياً',
      };
    }

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

  async create(data: any, files?: Express.Multer.File[]) {
    const { featureIds, ...carData } = data;

    const car = await prisma.car.create({
      data: {
        ...carData,
        mainImage: files?.[0]?.filename ? `/uploads/${files[0].filename}` : null,
      },
    });

    if (files && files.length > 0) {
      await prisma.carImage.createMany({
        data: files.map((file, index) => ({
          carId: car.id,
          imageUrl: `/uploads/${file.filename}`,
          order: index,
        })),
      });
    }

    if (featureIds && featureIds.length > 0) {
      await prisma.carFeature.createMany({
        data: featureIds.map((featureId: string) => ({
          carId: car.id,
          featureId,
        })),
      });
    }

    return this.getById(car.id);
  }

  async update(id: string, data: any, files?: Express.Multer.File[]) {
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    const { featureIds, ...carData } = data;

    await prisma.car.update({
      where: { id },
      data: carData,
    });

    if (files && files.length > 0) {
      const maxOrder = await prisma.carImage.findFirst({
        where: { carId: id },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      const startOrder = (maxOrder?.order ?? -1) + 1;

      await prisma.carImage.createMany({
        data: files.map((file, index) => ({
          carId: id,
          imageUrl: `/uploads/${file.filename}`,
          order: startOrder + index,
        })),
      });
    }

    if (featureIds) {
      await prisma.carFeature.deleteMany({ where: { carId: id } });
      await prisma.carFeature.createMany({
        data: featureIds.map((featureId: string) => ({
          carId: id,
          featureId,
        })),
      });
    }

    return this.getById(id);
  }

  async delete(id: string) {
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    const activeBookings = await prisma.booking.count({
      where: {
        carId: id,
        status: { in: ['CONFIRMED', 'ACTIVE'] },
      },
    });

    if (activeBookings > 0) {
      throw new AppError('لا يمكن حذف السيارة لوجود حجوزات نشطة', 400);
    }

    await prisma.car.delete({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    return prisma.car.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
