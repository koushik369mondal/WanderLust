const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        type: {
            type: String,
            required: true,
            enum: [
                "trip_reminder",
                "review_response",
                "achievement_earned",
                "price_drop",
                "booking_confirmed",
                "booking_cancelled",
                "new_review",
                "listing_approved",
                "listing_featured",
                "goal_completed",
                "message_received",
                "like_received",
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

        // Related entities
        relatedListing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        },
        relatedTrip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },
        relatedBooking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        },

        link: String,

        isRead: {
            type: Boolean,
            default: false
        },
        readAt: Date,

        priority: {
            type: String,
            enum: ["low", "normal", "high"],
            default: "normal"
        },

        // Scheduled notifications
        scheduledFor: Date,
        isSent: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
