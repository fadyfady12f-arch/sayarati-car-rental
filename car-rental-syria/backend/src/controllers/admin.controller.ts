import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { prisma } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class AdminController {
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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
        prisma.booking.count({ where: { createdAt: { gte: today } } }),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.booking.count({ where: { status: 'ACTIVE' } }),
        prisma.payment.aggregate({
          where: { status: 'PAID', paidAt: { gte: today } },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: { status: 'PAID', paidAt: { gte: startOfMonth } },
          _sum: { amount: true },
        }),
        prisma.car.count({ where: { isActive: true } }),
        prisma.car.count({ where: { status: 'AVAILABLE', isActive: true } }),
        prisma.car.count({ where: { status: 'MAINTENANCE' } }),
        prisma.user.count({
          where: { role: 'CUSTOMER', isActive: true },
        }),
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

  async getRevenueStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period = 'month' } = req.query;
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      const payments = await prisma.payment.findMany({
        where: {
          status: 'PAID',
          paidAt: { gte: startDate },
        },
        select: {
          amount: true,
          method: true,
          paidAt: true,
        },
        orderBy: { paidAt: 'asc' },
      });

      const revenueByDate: Record<string, number> = {};
      const revenueByMethod: Record<string, number> = {};

      payments.forEach((payment) => {
        const date = payment.paidAt!.toISOString().split('T')[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + Number(payment.amount);
        revenueByMethod[payment.method] = (revenueByMethod[payment.method] || 0) + Number(payment.amount);
      });

      const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      ApiResponse.success(res, {
        data: {
          total,
          count: payments.length,
          byDate: revenueByDate,
          byMethod: revenueByMethod,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingsStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const statusCounts = await prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
      });

      const categoryCounts = await prisma.booking.groupBy({
        by: ['carId'],
        _count: { id: true },
      });

      ApiResponse.success(res, {
        data: {
          byStatus: statusCounts.reduce((acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          }, {} as Record<string, number>),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const bookings = await prisma.booking.findMany({
        include: {
          car: { select: { brand: true, model: true, mainImage: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      ApiResponse.success(res, { data: bookings });
    } catch (error) {
      next(error);
    }
  }

  async getSystemAlerts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const alerts: any[] = [];

      // Cars needing maintenance
      const carsNeedingService = await prisma.car.count({
        where: {
          nextService: { lte: new Date() },
          status: 'AVAILABLE',
        },
      });

      if (carsNeedingService > 0) {
        alerts.push({
          type: 'warning',
          title: 'سيارات تحتاج صيانة',
          message: `${carsNeedingService} سيارة تحتاج صيانة`,
        });
      }

      // Pending bookings
      const pendingBookings = await prisma.booking.count({
        where: { status: 'PENDING' },
      });

      if (pendingBookings > 0) {
        alerts.push({
          type: 'info',
          title: 'حجوزات بانتظار التأكيد',
          message: `${pendingBookings} حجز بانتظار التأكيد`,
        });
      }

      // Expiring insurance
      const expiringInsurance = await prisma.car.count({
        where: {
          insuranceExpiry: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            gte: new Date(),
          },
        },
      });

      if (expiringInsurance > 0) {
        alerts.push({
          type: 'warning',
          title: 'تأمين ينتهي قريباً',
          message: `${expiringInsurance} سيارة تأمينها ينتهي خلال 30 يوم`,
        });
      }

      ApiResponse.success(res, { data: alerts });
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50 } = req.query;

      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.activityLog.count(),
      ]);

      ApiResponse.success(res, {
        data: logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.setting.findMany();

      const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      ApiResponse.success(res, { data: settingsObject });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const settings = req.body;

      for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        });
      }

      ApiResponse.success(res, {
        message: 'تم حفظ الإعدادات بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }
}
