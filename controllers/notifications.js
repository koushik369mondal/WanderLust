const Notification = require('../models/notification');
const NotificationService = require('../services/notificationServiceNew');

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.replace(/[<>'"&]/g, '').trim().slice(0, 1000); // Remove HTML chars and limit length
    }
    return input;
};

class NotificationController {
    constructor() {
        this.notificationService = NotificationService;
    }

    // Set Socket.io instance
    setSocketIO(io) {
        this.notificationService.setIo(io);
    }

    // Get user notifications with pagination
    async getNotifications(req, res) {
        try {
            const userId = req.user._id;
            const page = Math.max(1, Math.min(parseInt(req.query.page) || 1, 100)); // Limit page range
            const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 20, 50)); // Limit results per page
            const status = sanitizeInput(req.query.status);
            const type = sanitizeInput(req.query.type);

            const result = await this.notificationService.getUserNotifications(userId, {
                page,
                limit,
                status,
                type
            });

            if (req.headers.accept === 'application/json') {
                return res.json({
                    success: true,
                    data: result
                });
            }

            // Render notifications page
            res.render('notifications/index', {
                title: 'Notifications',
                notifications: result.notifications,
                unreadCount: result.unreadCount,
                pagination: result.pagination,
                currentStatus: status,
                currentType: type
            });

        } catch (error) {
            console.error('Error getting notifications:', error);
            if (req.headers.accept === 'application/json') {
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching notifications'
                });
            }
            req.flash('error', 'Error loading notifications');
            res.redirect('/');
        }
    }

    // Get unread notifications count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user._id;
            const unreadCount = await Notification.getUnreadCount(userId);

            res.json({
                success: true,
                count: unreadCount
            });
        } catch (error) {
            console.error('Error getting unread count:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching unread count'
            });
        }
    }

    // Mark single notification as read
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const notification = await this.notificationService.markAsRead(id, userId);

            res.json({
                success: true,
                message: 'Notification marked as read',
                data: notification
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error marking notification as read'
            });
        }
    }

    // Mark all notifications as read
    async markAllAsRead(req, res) {
        try {
            const userId = req.user._id;
            await this.notificationService.markAllAsRead(userId);

            res.json({
                success: true,
                message: 'All notifications marked as read'
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            res.status(500).json({
                success: false,
                message: 'Error marking notifications as read'
            });
        }
    }

    // Dismiss notification
    async dismissNotification(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const notification = await this.notificationService.dismissNotification(id, userId);

            res.json({
                success: true,
                message: 'Notification dismissed',
                data: notification
            });
        } catch (error) {
            console.error('Error dismissing notification:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error dismissing notification'
            });
        }
    }

    // Get notification settings (for user preferences)
    async getSettings(req, res) {
        try {
            const userId = req.user._id;
            const User = require('../models/user');

            const user = await User.findById(userId).select('notificationSettings');

            res.render('notifications/settings', {
                title: 'Notification Settings',
                settings: user.notificationSettings || this.getDefaultSettings()
            });
        } catch (error) {
            console.error('Error getting notification settings:', error);
            req.flash('error', 'Error loading notification settings');
            res.redirect('/');
        }
    }

    // Update notification settings
    async updateSettings(req, res) {
        try {
            const userId = req.user._id;
            const settings = req.body;
            const User = require('../models/user');

            // Validate settings
            const validatedSettings = this.validateSettings(settings);

            await User.findByIdAndUpdate(userId, {
                notificationSettings: validatedSettings
            });

            if (req.headers.accept === 'application/json') {
                return res.json({
                    success: true,
                    message: 'Notification settings updated'
                });
            }

            req.flash('success', 'Notification settings updated successfully');
            res.redirect('/notifications/settings');
        } catch (error) {
            console.error('Error updating notification settings:', error);
            if (req.headers.accept === 'application/json') {
                return res.status(500).json({
                    success: false,
                    message: 'Error updating settings'
                });
            }
            req.flash('error', 'Error updating notification settings');
            res.redirect('/notifications/settings');
        }
    }

    // Get notification statistics
    async getStats(req, res) {
        try {
            const userId = req.user._id;
            const stats = await this.notificationService.getNotificationStats(userId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error getting notification stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching notification statistics'
            });
        }
    }

    // Test notification (for development/testing)
    async sendTestNotification(req, res) {
        try {
            const userId = req.user._id;
            const { type, title, message } = req.body;

            const notification = await this.notificationService.createNotification({
                recipient: userId,
                type: type || 'system_announcement',
                title: title || '🧪 Test Notification',
                message: message || 'This is a test notification from WanderLust!',
                priority: 'low',
                data: {
                    url: '/',
                    metadata: { isTest: true }
                }
            });

            res.json({
                success: true,
                message: 'Test notification sent',
                data: notification
            });
        } catch (error) {
            console.error('Error sending test notification:', error);
            res.status(500).json({
                success: false,
                message: 'Error sending test notification'
            });
        }
    }

    // Helper method to get default notification settings
    getDefaultSettings() {
        return {
            email: {
                newReview: true,
                badgeEarned: true,
                wishlistDiscount: true,
                systemAnnouncements: true,
                newsletter: true
            },
            push: {
                newReview: true,
                badgeEarned: true,
                wishlistDiscount: true,
                systemAnnouncements: false,
                newsletter: false
            },
            inApp: {
                newReview: true,
                newRating: true,
                listingLiked: true,
                badgeEarned: true,
                wishlistDiscount: true,
                systemAnnouncements: true,
                newsletter: true
            }
        };
    }

    // Helper method to validate notification settings
    validateSettings(settings) {
        const defaultSettings = this.getDefaultSettings();
        const validatedSettings = { ...defaultSettings };

        // Validate email settings
        if (settings.email && typeof settings.email === 'object') {
            Object.keys(defaultSettings.email).forEach(key => {
                if (typeof settings.email[key] === 'boolean') {
                    validatedSettings.email[key] = settings.email[key];
                }
            });
        }

        // Validate push settings
        if (settings.push && typeof settings.push === 'object') {
            Object.keys(defaultSettings.push).forEach(key => {
                if (typeof settings.push[key] === 'boolean') {
                    validatedSettings.push[key] = settings.push[key];
                }
            });
        }

        // Validate in-app settings
        if (settings.inApp && typeof settings.inApp === 'object') {
            Object.keys(defaultSettings.inApp).forEach(key => {
                if (typeof settings.inApp[key] === 'boolean') {
                    validatedSettings.inApp[key] = settings.inApp[key];
                }
            });
        }

        return validatedSettings;
    }
}

module.exports = new NotificationController();