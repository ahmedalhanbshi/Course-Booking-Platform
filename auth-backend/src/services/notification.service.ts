import prisma from '../config/database';

export class NotificationService {
    /**
     * Get all notifications for a user (newest first)
     */
    async getNotifications(userId: string) {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        const typeMap: Record<string, string> = {
            COURSE_ENROLLMENT: 'enrollment',
            PAYMENT_APPROVED: 'payment',
            PAYMENT_REJECTED: 'payment',
            SESSION_REMINDER: 'session',
            SESSION_CANCELLED: 'session',
            BOOKING_STATUS_CHANGE: 'booking',
            NEW_ANNOUNCEMENT: 'announcement',
        };

        return notifications.map(n => ({
            id: n.id,
            type: typeMap[n.type] ?? n.type.toLowerCase(),
            title: n.title ?? '',
            message: n.message ?? '',
            isRead: n.isRead,
            createdAt: n.createdAt,
            relatedEntityId: n.relatedEntityId,
            actionUrl: n.actionUrl,
        }));
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: string, userId: string) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification || notification.userId !== userId) {
            throw new Error('الإشعار غير موجود');
        }
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
        return { message: 'تم تحديد الإشعار كمقروء' };
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string) {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
    }

    /**
     * Get unread count for a user
     */
    async getUnreadCount(userId: string) {
        const count = await prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { count };
    }
}

export default new NotificationService();
