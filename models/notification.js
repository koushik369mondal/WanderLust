const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: [
            "new_review",
            "new_rating", 
            "listing_liked",
            "badge_earned",
            "wishlist_item_discount",
            "newsletter_subscription",
            "account_activity",
            "listing_featured",
            "review_helpful",
            "welcome",
            "system_announcement"
        ]
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    data: {
        // Additional data specific to notification type
        listingId: {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        },
        reviewId: {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
        badgeId: String,
        url: String, // Link to relevant page
        imageUrl: String, // Optional image for notification
        metadata: Schema.Types.Mixed // Flexible data storage
    },
    status: {
        type: String,
        enum: ["unread", "read", "dismissed"],
        default: "unread",
        index: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    isRealTime: {
        type: Boolean,
        default: true // Whether to send via Socket.io
    },
    expiresAt: {
        type: Date,
        default: function() {
            // Auto-expire notifications after 30 days
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    },
    readAt: {
        type: Date
    },
    dismissedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ recipient: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const created = this.createdAt;
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return created.toLocaleDateString();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
};

// Method to dismiss notification
notificationSchema.methods.dismiss = function() {
    this.status = 'dismissed';
    this.dismissedAt = new Date();
    return this.save();
};

// Static method to create notification with automatic Socket.io emission
notificationSchema.statics.createAndEmit = async function(notificationData, io) {
    try {
        const notification = new this(notificationData);
        await notification.save();
        
        // Populate referenced fields for complete data
        await notification.populate([
            { path: 'sender', select: 'username avatar' },
            { path: 'data.listingId', select: 'title image' },
            { path: 'data.reviewId', select: 'comment rating' }
        ]);

        // Emit to specific user if Socket.io is available and real-time is enabled
        if (io && notification.isRealTime) {
            io.to(`user_${notification.recipient}`).emit('new_notification', {
                id: notification._id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                priority: notification.priority,
                timeAgo: notification.timeAgo,
                data: notification.data,
                sender: notification.sender
            });
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Static method to get user's unread count
notificationSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({ 
        recipient: userId, 
        status: 'unread' 
    });
};

// Static method to get user's notifications with pagination
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        status = null,
        type = null
    } = options;

    const query = { recipient: userId };
    if (status) query.status = status;
    if (type) query.type = type;

    return this.find(query)
        .populate('sender', 'username avatar')
        .populate('data.listingId', 'title image')
        .populate('data.reviewId', 'comment rating')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
};

// Pre-save middleware to set defaults
notificationSchema.pre('save', function(next) {
    if (this.isNew) {
        // Set default URL if not provided
        if (!this.data.url) {
            switch (this.type) {
                case 'new_review':
                case 'new_rating':
                    if (this.data.listingId) {
                        this.data.url = `/listings/${this.data.listingId}`;
                    }
                    break;
                case 'badge_earned':
                    this.data.url = '/users/profile';
                    break;
                case 'wishlist_item_discount':
                    this.data.url = '/users/wishlist';
                    break;
                default:
                    this.data.url = '/';
            }
        }
    }
    next();
});

module.exports = mongoose.model("Notification", notificationSchema);