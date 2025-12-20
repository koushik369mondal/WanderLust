const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        name: String,

        isActive: {
            type: Boolean,
            default: true
        },

        preferences: {
            travelTips: { type: Boolean, default: true },
            deals: { type: Boolean, default: true },
            newDestinations: { type: Boolean, default: true },
            weeklyDigest: { type: Boolean, default: true }
        },

        unsubscribedAt: Date,
        unsubscribeReason: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
