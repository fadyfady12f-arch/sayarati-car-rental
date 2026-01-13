import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { generateBookingNumber, calculateDays } from '../utils/helpers.js';
import { Prisma } from '@prisma/client';

interface CreateBookingDTO {
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  returnLocation: string;
  pickupBranchId?: string;
  returnBranchId?: string;
  extras?: string[];
  couponCode?: string;
  customerNotes?: string;
  driverName?: string;
  driverLicense?: string;
  driverPhone?: string;
}

export class BookingsService {
  async create(data: CreateBookingDTO) {
    const car = await prisma.car.findUnique({
      where: { id: data.carId },
    });

    if (!car) {
      throw new AppError('السيارة غير موجودة', 404);
    }

    if (car.status !== 'AVAILABLE') {
      throw new AppError('السيارة غير متاحة', 400);
    }

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        carId: data.carId,
        status: { in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
        OR: [
          { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } },
        ],
      },
    });

    if (conflict) {
      throw new AppError('السيارة محجوزة في هذه الفترة', 400);
    }

    const totalDays = calculateDays(data.startDate, data.endDate);
    const dailyRate = Number(car.pricePerDay);
    const subtotal = dailyRate * totalDays;

    // Calculate extras
    let extrasTotal = 0;
    let bookingExtras: any[] = [];

    if (data.extras && data.extras.length > 0) {
      const extras = await prisma.extra.findMany({
        where: { id: { in: data.extras }, isActive: true },
      });

      bookingExtras = extras.map((extra) => {
        const totalPrice = Number(extra.pricePerDay) * totalDays;
        extrasTotal += totalPrice;
        return {
          extraId: extra.id,
          quantity: 1,
          pricePerDay: extra.pricePerDay,
          totalPrice,
        };
      });
    }

    // Apply coupon
    let discount = 0;
    let couponId: string | null = null;

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode },
      });

      if (coupon && coupon.isActive &&
          new Date() >= coupon.startDate &&
          new Date() <= coupon.endDate &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)) {

        couponId = coupon.id;

        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal + extrasTotal) * (Number(coupon.discountValue) / 100);
          if (coupon.maxDiscount) {
            discount = Math.min(discount, Number(coupon.maxDiscount));
          }
        } else {
          discount = Number(coupon.discountValue);
        }

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const totalAmount = subtotal + extrasTotal - discount;
    const depositAmount = Number(car.deposit);

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId: data.userId,
        carId: data.carId,
        startDate: data.startDate,
        endDate: data.endDate,
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        pickupBranchId: data.pickupBranchId,
        returnBranchId: data.returnBranchId,
        dailyRate,
        totalDays,
        subtotal,
        extrasTotal,
        discount,
        totalAmount,
        depositAmount,
        customerNotes: data.customerNotes,
        driverName: data.driverName,
        driverLicense: data.driverLicense,
        driverPhone: data.driverPhone,
        couponId,
        extras: {
          create: bookingExtras,
        },
      },
      include: {
        car: true,
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        extras: { include: { extra: true } },
      },
    });

    return booking;
  }

  async getById(id: string, userId?: string, isAdmin: boolean = false) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: {
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
        extras: { include: { extra: true } },
        payments: true,
        review: true,
        coupon: true,
      },
    });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (!isAdmin && userId && booking.userId !== userId) {
      throw new AppError('غير مصرح لك بعرض هذا الحجز', 403);
    }

    return booking;
  }

  async getMyBookings(userId: string, status?: string, page: number = 1, limit: number = 10) {
    const where: Prisma.BookingWhereInput = { userId };

    if (status && status !== 'all') {
      where.status = status as any;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          car: {
            include: {
              images: { take: 1, orderBy: { order: 'asc' } },
            },
          },
          review: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total };
  }

  async getAll(
    filters: any,
    page: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const where: Prisma.BookingWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.search) {
      where.OR = [
        { bookingNumber: { contains: filters.search, mode: 'insensitive' } },
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { phone: { contains: filters.search } } },
      ];
    }
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          car: { select: { brand: true, model: true, licensePlate: true, mainImage: true } },
          user: { select: { firstName: true, lastName: true, phone: true, email: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total };
  }

  async confirm(id: string, adminId: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.status !== 'PENDING') {
      throw new AppError('لا يمكن تأكيد هذا الحجز', 400);
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        car: true,
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      },
    });
  }

  async reject(id: string, reason?: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.status !== 'PENDING') {
      throw new AppError('لا يمكن رفض هذا الحجز', 400);
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: reason || 'تم الرفض من قبل الإدارة',
      },
    });
  }

  async cancel(id: string, userId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('غير مصرح لك بإلغاء هذا الحجز', 403);
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new AppError('لا يمكن إلغاء هذا الحجز', 400);
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: reason || 'تم الإلغاء من قبل العميل',
      },
    });
  }

  async activate(id: string, vehicleData: any) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { car: true },
    });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.status !== 'CONFIRMED') {
      throw new AppError('لا يمكن تفعيل هذا الحجز', 400);
    }

    await prisma.car.update({
      where: { id: booking.carId },
      data: { status: 'RENTED' },
    });

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        pickupMileage: vehicleData.mileage,
        pickupFuel: vehicleData.fuel,
        pickupCondition: vehicleData.condition,
        pickupPhotos: vehicleData.photos || [],
      },
    });
  }

  async complete(id: string, vehicleData: any) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { car: true },
    });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.status !== 'ACTIVE') {
      throw new AppError('لا يمكن إنهاء هذا الحجز', 400);
    }

    await prisma.car.update({
      where: { id: booking.carId },
      data: {
        status: 'AVAILABLE',
        mileage: vehicleData.mileage,
      },
    });

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        actualReturnDate: new Date(),
        returnMileage: vehicleData.mileage,
        returnFuel: vehicleData.fuel,
        returnCondition: vehicleData.condition,
        returnPhotos: vehicleData.photos || [],
      },
    });
  }
}
