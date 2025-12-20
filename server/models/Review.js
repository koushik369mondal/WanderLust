const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            maxlength: 1000
        },

        // Detailed Ratings
        detailedRatings: {
            cleanliness: { type: Number, min: 1, max: 5 },
            accuracy: { type: Number, min: 1, max: 5 },
            communication: { type: Number, min: 1, max: 5 },
            location: { type: Number, min: 1, max: 5 },
            value: { type: Number, min: 1, max: 5 }
        },

        // Images
        images: [
            {
                url: String,
                publicId: String
            }
        ],

        // Helpful votes
        helpfulVotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        helpfulCount: {
            type: Number,
            default: 0
        },

        // Flagging
        isFlagged: {
            type: Boolean,
            default: false
        },
        flagReason: String,

        // Response from owner
        ownerResponse: {
            comment: String,
            respondedAt: Date
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate reviews
reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
