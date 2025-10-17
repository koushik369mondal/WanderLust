const Notification = require('../models/notification');
const User = require('../models/user');

class NotificationService {
    constructor() {
        this.io = null;
    }

    // Set Socket.io instance
    setIo(io) {
        this.io = io;
    }

    // Create a new notification
    async createNotification({
        recipient,
        type,
        title,
        message,
        priority = 'medium',
        relatedModel = null,
        relatedId = null,
        metadata = {}
    }) {
        try {
            // Check if user has this notification type enabled
            const user = await User.findById(recipient);
            if (!user || !user.notificationSettings[type]) {
                return null;
            }

            const notification = new Notification({
                recipient,
                type,
                title,
                message,
                priority,
                relatedModel,
                relatedId,
                metadata
            });

            await notification.save();
            await notification.populate('recipient', 'username email');

            // Send real-time notification via Socket.io
            if (global.io) {
                global.io.to(`user_${recipient}`).emit('new_notification', {
                    id: notification._id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    priority: notification.priority,
                    createdAt: notification.createdAt,
                    metadata: notification.metadata
                });
            }

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            return null;
        }
    }

    // Create welcome notification for new users
    async createWelcomeNotification(userId) {
        return this.createNotification({
            recipient: userId,
            type: 'welcome',
            title: '🎉 Welcome to WanderLust!',
            message: 'Welcome to our travel community! Start exploring amazing destinations and create unforgettable memories.',
            priority: 'high',
            metadata: {
                action: 'explore',
                actionUrl: '/listings'
            }
        });
    }

    // Create review notification for property owners
    async createReviewNotification(ownerId, reviewData) {
        return this.createNotification({
            recipient: ownerId,
            type: 'review',
            title: '⭐ New Review Received!',
            message: `You received a new ${reviewData.rating}-star review for your property "${reviewData.listingTitle}".`,
            priority: 'high',
            relatedModel: 'Review',
            relatedId: reviewData.reviewId,
            metadata: {
                listingId: reviewData.listingId,
                listingTitle: reviewData.listingTitle,
                rating: reviewData.rating,
                action: 'view_review',
                actionUrl: `/listings/${reviewData.listingId}`
            }
        });
    }

    // Create badge achievement notification
    async createBadgeNotification(userId, badgeData) {
        return this.createNotification({
            recipient: userId,
            type: 'badge',
            title: '🏆 Badge Earned!',
            message: `Congratulations! You've earned the "${badgeData.name}" badge. ${badgeData.description}`,
            priority: 'high',
            relatedModel: 'Badge',
            relatedId: badgeData.badgeId,
            metadata: {
                badgeName: badgeData.name,
                badgeIcon: badgeData.icon,
                badgeLevel: badgeData.level,
                action: 'view_badges',
                actionUrl: '/profile/badges'
            }
        });
    }

    // Create like notification
    async createLikeNotification(ownerId, likeData) {
        return this.createNotification({
            recipient: ownerId,
            type: 'like',
            title: '👍 Your listing was liked!',
            message: `Someone liked your property "${likeData.listingTitle}". Your listing is getting popular!`,
            priority: 'medium',
            relatedModel: 'Listing',
            relatedId: likeData.listingId,
            metadata: {
                listingTitle: likeData.listingTitle,
                action: 'view_listing',
                actionUrl: `/listings/${likeData.listingId}`
            }
        });
    }

    // Create system announcement
    async createSystemAnnouncement(message, priority = 'medium') {
        const users = await User.find({ 'notificationSettings.system': true });
        const notifications = [];

        for (const user of users) {
            const notification = await this.createNotification({
                recipient: user._id,
                type: 'system',
                title: '📢 System Announcement',
                message: message,
                priority: priority,
                metadata: {
                    isSystemWide: true
                }
            });
            if (notification) notifications.push(notification);
        }

        return notifications;
    }

    // Get notifications for a user
    async getUserNotifications(userId, { page = 1, limit = 20, type = null, unreadOnly = false } = {}) {
        try {
            const query = { recipient: userId };
            
            if (type) query.type = type;
            if (unreadOnly) query.read = false;

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .populate('recipient', 'username');

            const total = await Notification.countDocuments(query);

            return {
                notifications,
                total,
                page,
                pages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            return { notifications: [], total: 0, page: 1, pages: 0 };
        }
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, recipient: userId },
                { read: true, readAt: new Date() },
                { new: true }
            );
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return null;
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        try {
            const result = await Notification.updateMany(
                { recipient: userId, read: false },
                { read: true, readAt: new Date() }
            );
            return result;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return null;
        }
    }

    // Delete notification
    async deleteNotification(notificationId, userId) {
        try {
            const notification = await Notification.findOneAndDelete({
                _id: notificationId,
                recipient: userId
            });
            return notification;
        } catch (error) {
            console.error('Error deleting notification:', error);
            return null;
        }
    }

    // Get unread count for a user
    async getUnreadCount(userId) {
        try {
            const count = await Notification.countDocuments({
                recipient: userId,
                read: false
            });
            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Get notification statistics
    async getNotificationStats(userId) {
        try {
            const stats = await Notification.aggregate([
                { $match: { recipient: userId } },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: 1 },
                        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            console.error('Error getting notification stats:', error);
            return [];
        }
    }

    // Process scheduled reminders (for cron job)
    async processScheduledReminders() {
        try {
            // This can be extended to handle scheduled notifications
            console.log('Processing scheduled reminders...');
            return true;
        } catch (error) {
            console.error('Error processing scheduled reminders:', error);
            return false;
        }
    }

    // Clean up old notifications
    async cleanupOldNotifications(daysOld = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await Notification.deleteMany({
                createdAt: { $lt: cutoffDate },
                read: true
            });

            console.log(`Cleaned up ${result.deletedCount} old notifications`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error cleaning up old notifications:', error);
            return 0;
        }
    }

    // Send bulk notifications
    async sendBulkNotifications(userIds, notificationData) {
        const notifications = [];
        
        for (const userId of userIds) {
            const notification = await this.createNotification({
                ...notificationData,
                recipient: userId
            });
            if (notification) notifications.push(notification);
        }

        return notifications;
    }
}

module.exports = new NotificationService();