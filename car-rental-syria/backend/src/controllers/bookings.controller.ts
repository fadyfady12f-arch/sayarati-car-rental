import { Request, Response, NextFunction } from 'express';
import { BookingsService } from '../services/bookings.service.js';
import { notificationService } from '../services/notification.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Pagination } from '../utils/pagination.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const bookingsService = new BookingsService();

export class BookingsController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      const booking = await bookingsService.create({
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });

      await notificationService.send(userId, {
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
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user!.role);

      const booking = await bookingsService.getById(id, userId, isAdmin);

      ApiResponse.success(res, { data: booking });
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status, page = 1, limit = 10 } = req.query;

      const result = await bookingsService.getMyBookings(
        userId,
        status as string,
        Number(page),
        Number(limit)
      );

      ApiResponse.success(res, {
        data: result.bookings,
        pagination: Pagination.create(result.total, Number(page), Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        paymentStatus,
        search,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const result = await bookingsService.getAll(
        { status, paymentStatus, search, startDate, endDate },
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      ApiResponse.success(res, {
        data: result.bookings,
        pagination: Pagination.create(result.total, Number(page), Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { reason } = req.body;

      const booking = await bookingsService.cancel(id, userId, reason);

      ApiResponse.success(res, {
        message: 'تم إلغاء الحجز بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;

      const booking = await bookingsService.confirm(id, adminId);

      await notificationService.send(booking.userId, {
        type: 'BOOKING_CONFIRMED',
        title: 'تم تأكيد حجزك',
        message: `تم تأكيد حجزك رقم ${booking.bookingNumber}. يرجى الحضور في الموعد المحدد.`,
        data: { bookingId: booking.id },
      });

      ApiResponse.success(res, {
        message: 'تم تأكيد الحجز بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await bookingsService.reject(id, reason);

      await notificationService.send(booking.userId, {
        type: 'BOOKING_CANCELLED',
        title: 'تم رفض حجزك',
        message: reason || 'تم رفض حجزك من قبل الإدارة',
        data: { bookingId: booking.id },
      });

      ApiResponse.success(res, {
        message: 'تم رفض الحجز',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicleData = req.body;

      const booking = await bookingsService.activate(id, vehicleData);

      ApiResponse.success(res, {
        message: 'تم بدء الإيجار بنجاح',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicleData = req.body;

      const booking = await bookingsService.complete(id, vehicleData);

      await notificationService.send(booking.userId, {
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
  }
}
