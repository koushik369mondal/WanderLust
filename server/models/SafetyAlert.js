const mongoose = require("mongoose");

const safetyAlertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        location: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            specificLocation: String,
            coordinates: {
                type: { type: String, enum: ["Point"], default: "Point" },
                coordinates: { type: [Number], default: [0, 0] }
            }
        },

        category: {
            type: String,
            required: true,
            enum: ["overpricing", "fraud", "theft", "transportation_scam", "accommodation_scam", "food_safety", "harassment", "other"]
        },

        severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high", "critical"]
        },

        title: {
            type: String,
            required: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },

        evidence: [
            {
                url: String,
                publicId: String,
                type: { type: String, enum: ["image", "document"] }
            }
        ],

        dateOccurred: {
            type: Date,
            required: true
        },

        // Community Voting
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        downvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        voteScore: {
            type: Number,
            default: 0
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        // Status
        status: {
            type: String,
            enum: ["active", "resolved", "disputed", "removed"],
            default: "active"
        },

        // Admin Notes
        adminNotes: String
    },
    {
        timestamps: true
    }
);

// Index for geospatial queries
safetyAlertSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("SafetyAlert", safetyAlertSchema);
