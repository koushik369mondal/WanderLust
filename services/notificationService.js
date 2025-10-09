const Notification = require('../models/notification');

class NotificationService {
    constructor(io = null) {
        this.io = io;
    }

    // Set Socket.io instance
    setSocketIO(io) {
        this.io = io;
    }

    // Create different types of notifications
    async createWelcomeNotification(userId) {
        return await this.createNotification({
            recipient: userId,
            type: 'welcome',
            title: '🌍 Welcome to WanderLust!',
            message: 'Start exploring amazing destinations and share your travel experiences!',
            priority: 'high',
            data: {
                url: '/listings',
                imageUrl: '/images/welcome-banner.jpg'
            }
        });
    }

    async createNewReviewNotification(listingOwnerId, reviewerId, listingId, reviewId) {
        const Listing = require('../models/listing');
        const User = require('../models/user');
        
        try {
            const [listing, reviewer] = await Promise.all([
                Listing.findById(listingId).select('title'),
                User.findById(reviewerId).select('username')
            ]);

            return await this.createNotification({
                recipient: listingOwnerId,
                sender: reviewerId,
                type: 'new_review',
                title: '⭐ New Review on Your Listing',
                message: `${reviewer.username} left a review on "${listing.title}"`,
                priority: 'medium',
                data: {
                    listingId,
                    reviewId,
                    url: `/listings/${listingId}`
                }
            });
        } catch (error) {
            console.error('Error creating new review notification:', error);
        }
    }

    async createBadgeEarnedNotification(userId, badgeName, badgeIcon) {
        return await this.createNotification({
            recipient: userId,
            type: 'badge_earned',
            title: '🏆 Badge Earned!',
            message: `Congratulations! You've earned the "${badgeName}" badge!`,
            priority: 'high',
            data: {
                badgeId: badgeName,
                url: '/users/profile',
                imageUrl: `/images/badges/${badgeIcon}.png`
            }
        });
    }

    async createListingLikedNotification(listingOwnerId, likerId, listingId) {
        const Listing = require('../models/listing');
        const User = require('../models/user');
        
        try {
            const [listing, liker] = await Promise.all([
                Listing.findById(listingId).select('title'),
                User.findById(likerId).select('username')
            ]);

            return await this.createNotification({
                recipient: listingOwnerId,
                sender: likerId,
                type: 'listing_liked',
                title: '❤️ Your Listing Was Liked',
                message: `${liker.username} liked your listing "${listing.title}"`,
                priority: 'low',
                data: {
                    listingId,
                    url: `/listings/${listingId}`
                }
            });
        } catch (error) {
            console.error('Error creating listing liked notification:', error);
        }
    }

    async createWishlistDiscountNotification(userId, listingId) {
        const Listing = require('../models/listing');
        
        try {
            const listing = await Listing.findById(listingId).select('title discountPrice');
            
            return await this.createNotification({
                recipient: userId,
                type: 'wishlist_item_discount',
                title: '🎯 Wishlist Item on Sale!',
                message: `"${listing.title}" from your wishlist is now ${listing.discountPrice ? 'on discount' : 'available'}!`,
                priority: 'high',
                data: {
                    listingId,
                    url: `/listings/${listingId}`
                }
            });
        } catch (error) {
            console.error('Error creating wishlist discount notification:', error);
        }
    }

    async createNewsletterSubscriptionNotification(userId, email) {
        return await this.createNotification({
            recipient: userId,
            type: 'newsletter_subscription',
            title: '📧 Newsletter Subscription Confirmed',
            message: `You've successfully subscribed to WanderLust newsletter at ${email}`,
            priority: 'low',
            data: {
                url: '/newsletter',
                metadata: { email }
            }
        });
    }

    async createListingFeaturedNotification(userId, listingId) {
        const Listing = require('../models/listing');
        
        try {
            const listing = await Listing.findById(listingId).select('title');
            
            return await this.createNotification({
                recipient: userId,
                type: 'listing_featured',
                title: '🌟 Your Listing is Featured!',
                message: `Your listing "${listing.title}" has been featured on the homepage!`,
                priority: 'high',
                data: {
                    listingId,
                    url: `/listings/${listingId}`
                }
            });
        } catch (error) {
            console.error('Error creating listing featured notification:', error);
        }
    }

    async createSystemAnnouncementNotification(userIds, title, message, priority = 'medium') {
        const notifications = userIds.map(userId => ({
            recipient: userId,
            type: 'system_announcement',
            title: `📢 ${title}`,
            message,
            priority,
            data: {
                url: '/'
            }
        }));

        try {
            const createdNotifications = await Promise.all(
                notifications.map(notification => this.createNotification(notification))
            );
            return createdNotifications;
        } catch (error) {
            console.error('Error creating system announcements:', error);
        }
    }

    // Generic notification creation method
    async createNotification(notificationData) {
        try {
            return await Notification.createAndEmit(notificationData, this.io);
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    // Get user notifications with pagination
    async getUserNotifications(userId, options = {}) {
        try {
            const notifications = await Notification.getUserNotifications(userId, options);
            const unreadCount = await Notification.getUnreadCount(userId);
            
            return {
                notifications,
                unreadCount,
                pagination: {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    hasMore: notifications.length === (options.limit || 20)
                }
            };
        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOne({
                _id: notificationId,
                recipient: userId
            });

            if (!notification) {
                throw new Error('Notification not found');
            }

            await notification.markAsRead();
            
            // Emit updated unread count
            if (this.io) {
                const unreadCount = await Notification.getUnreadCount(userId);
                this.io.to(`user_${userId}`).emit('unread_count_update', unreadCount);
            }

            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        try {
            await Notification.updateMany(
                { recipient: userId, status: 'unread' },
                { status: 'read', readAt: new Date() }
            );

            // Emit updated unread count
            if (this.io) {
                this.io.to(`user_${userId}`).emit('unread_count_update', 0);
            }

            return true;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Dismiss notification
    async dismissNotification(notificationId, userId) {
        try {
            const notification = await Notification.findOne({
                _id: notificationId,
                recipient: userId
            });

            if (!notification) {
                throw new Error('Notification not found');
            }

            await notification.dismiss();
            
            // Emit updated unread count
            if (this.io) {
                const unreadCount = await Notification.getUnreadCount(userId);
                this.io.to(`user_${userId}`).emit('unread_count_update', unreadCount);
            }

            return notification;
        } catch (error) {
            console.error('Error dismissing notification:', error);
            throw error;
        }
    }

    // Clean up old notifications (can be called by a cron job)
    async cleanupOldNotifications() {
        try {
            const result = await Notification.deleteMany({
                status: { $in: ['read', 'dismissed'] },
                createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 days old
            });

            console.log(`Cleaned up ${result.deletedCount} old notifications`);
            return result;
        } catch (error) {
            console.error('Error cleaning up old notifications:', error);
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
                        count: { $sum: 1 },
                        unreadCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
                        }
                    }
                }
            ]);

            const totalUnread = await Notification.getUnreadCount(userId);
            
            return {
                byType: stats,
                totalUnread
            };
        } catch (error) {
            console.error('Error getting notification stats:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;