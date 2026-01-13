import { prisma } from '../config/database.js';

interface CreateNotificationDTO {
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'BOOKING_REMINDER' |
        'PAYMENT_RECEIVED' | 'REVIEW_REQUEST' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  private io: any;

  setIO(io: any) {
    this.io = io;
  }

  async send(userId: string, notification: CreateNotificationDTO) {
    const savedNotification = await prisma.notification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
      },
    });

    // Send real-time notification
    if (this.io) {
      this.io.to(`user:${userId}`).emit('notification', savedNotification);
    }

    return savedNotification;
  }

  async sendToAdmins(notification: CreateNotificationDTO) {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true },
    });

    for (const admin of admins) {
      await this.send(admin.id, notification);
    }
  }

  async getByUser(userId: string, page: number = 1, limit: number = 20) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return { notifications, total };
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async delete(notificationId: string, userId: string) {
    return prisma.notification.delete({
      where: { id: notificationId, userId },
    });
  }
}

export const notificationService = new NotificationService();
