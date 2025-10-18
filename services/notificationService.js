const User = require('../models/user');

class NotificationService {
    // Create notification for trip actions
    static async createTripNotification(userId, type, tripData, tripId = null) {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            // Check if user has notifications enabled for this type
            const settings = user.notificationSettings;
            const typeMap = {
                'trip_added': 'tripAdded',
                'trip_updated': 'tripUpdated',
                'trip_deleted': 'tripDeleted',
                'trip_reminder': 'tripReminders',
                'trip_upcoming': 'tripReminders'
            };

            if (!settings[typeMap[type]]) return false;

            let title, message;

            switch (type) {
                case 'trip_added':
                    title = 'Trip Added Successfully';
                    message = `Your trip to ${tripData.destination} has been added to My Trip Plans!`;
                    break;
                case 'trip_updated':
                    title = 'Trip Updated';
                    message = `Your trip to ${tripData.destination} has been updated.`;
                    break;
                case 'trip_deleted':
                    title = 'Trip Deleted';
                    message = `Your trip to ${tripData.destination} has been removed from My Trip Plans.`;
                    break;
                case 'trip_reminder':
                    title = 'Trip Reminder';
                    message = tripData.message || `Don't forget your upcoming trip to ${tripData.destination}!`;
                    break;
                case 'trip_upcoming':
                    title = 'Upcoming Trip';
                    message = `Your trip to ${tripData.destination} is coming up soon!`;
                    break;
                default:
                    return false;
            }

            await user.addNotification({
                type,
                title,
                message,
                relatedTrip: tripId
            });

            return true;
        } catch (error) {
            console.error('Error creating trip notification:', error);
            return false;
        }
    }

    // Schedule reminders for upcoming trips
    static async scheduleTripReminders(userId, tripData, tripId) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.notificationSettings.tripReminders) return;

            const startDate = new Date(tripData.startDate);
            const now = new Date();

            // Schedule reminders for 1 day and 3 hours before departure
            const reminders = [
                {
                    type: 'departure',
                    message: `Your trip to ${tripData.destination} starts tomorrow! Don't forget to pack and check your itinerary.`,
                    scheduledFor: new Date(startDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before
                },
                {
                    type: 'departure',
                    message: `Your trip to ${tripData.destination} starts in 3 hours! Make sure you have everything ready.`,
                    scheduledFor: new Date(startDate.getTime() - 3 * 60 * 60 * 1000) // 3 hours before
                }
            ];

            // Add reminders to trip
            for (const reminder of reminders) {
                if (reminder.scheduledFor > now) {
                    user.tripPlans.id(tripId).reminders.push(reminder);
                }
            }

            await user.save();
        } catch (error) {
            console.error('Error scheduling trip reminders:', error);
        }
    }

    // Get user's notifications
    static async getUserNotifications(userId, limit = 50) {
        try {
            const user = await User.findById(userId).select('notifications');
            if (!user) return [];

            return user.notifications
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting user notifications:', error);
            return [];
        }
    }

    // Mark notification as read
    static async markAsRead(userId, notificationId) {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            return await user.markNotificationAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    }

    // Get unread notification count
    static async getUnreadCount(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) return 0;

            return user.getUnreadNotificationCount();
        } catch (error) {
            console.error('Error getting unread notification count:', error);
            return 0;
        }
    }

    // Process scheduled reminders (to be called by cron job)
    static async processScheduledReminders() {
        try {
            const now = new Date();
            const users = await User.find({
                'tripPlans.reminders': {
                    $elemMatch: {
                        isSent: false,
                        scheduledFor: { $lte: now }
                    }
                }
            });

            for (const user of users) {
                for (const trip of user.tripPlans) {
                    for (const reminder of trip.reminders) {
                        if (!reminder.isSent && reminder.scheduledFor <= now) {
                            await this.createTripNotification(
                                user._id,
                                'trip_reminder',
                                { message: reminder.message, destination: trip.destination },
                                trip._id
                            );

                            reminder.isSent = true;
                        }
                    }
                }
                await user.save();
            }

            console.log(`Processed reminders for ${users.length} users`);
        } catch (error) {
            console.error('Error processing scheduled reminders:', error);
        }
    }
}

module.exports = NotificationService;
