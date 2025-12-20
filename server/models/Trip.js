const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        destination: {
            country: { type: String, required: true },
            city: { type: String, required: true }
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        duration: Number, // in days

        travelers: {
            adults: { type: Number, default: 1 },
            children: { type: Number, default: 0 }
        },

        budgetType: {
            type: String,
            enum: ["budget", "moderate", "luxury"],
            default: "moderate"
        },

        // Cost Breakdown
        estimatedCosts: {
            flights: { type: Number, default: 0 },
            accommodation: { type: Number, default: 0 },
            activities: { type: Number, default: 0 },
            food: { type: Number, default: 0 },
            transport: { type: Number, default: 0 },
            insurance: { type: Number, default: 0 },
            miscellaneous: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },

        // Itinerary
        itinerary: [
            {
                day: Number,
                activities: [
                    {
                        time: String,
                        activity: String,
                        location: String,
                        cost: Number,
                        notes: String
                    }
                ]
            }
        ],

        // Bookings
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            }
        ],

        // Packing List
        packingList: [
            {
                category: String,
                items: [
                    {
                        name: String,
                        packed: { type: Boolean, default: false }
                    }
                ]
            }
        ],

        // Status
        status: {
            type: String,
            enum: ["planning", "booked", "ongoing", "completed", "cancelled"],
            default: "planning"
        },

        // Notes
        notes: String,

        // Weather at destination
        weatherInfo: {
            temperature: Number,
            conditions: String,
            fetchedAt: Date
        }
    },
    {
        timestamps: true
    }
);

// Calculate duration
tripSchema.pre("save", function (next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);
        this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    next();
});

module.exports = mongoose.model("Trip", tripSchema);
