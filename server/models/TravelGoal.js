const mongoose = require("mongoose");

const travelGoalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 100
        },
        description: String,

        goalType: {
            type: String,
            enum: ["visit_country", "complete_trips", "write_reviews", "earn_badge", "save_money", "learn_skill", "custom"],
            required: true
        },

        target: {
            type: Number,
            required: true
        },
        progress: {
            type: Number,
            default: 0
        },

        targetDate: Date,

        destination: {
            country: String,
            city: String
        },

        status: {
            type: String,
            enum: ["in_progress", "completed", "paused"],
            default: "in_progress"
        },

        completedAt: Date,

        notes: String,

        milestones: [
            {
                title: String,
                target: Number,
                achieved: { type: Boolean, default: false },
                achievedAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

// Calculate progress percentage
travelGoalSchema.virtual("progressPercentage").get(function () {
    return Math.min(Math.round((this.progress / this.target) * 100), 100);
});

module.exports = mongoose.model("TravelGoal", travelGoalSchema);
