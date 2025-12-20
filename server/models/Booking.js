const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },

        checkIn: {
            type: Date,
            required: true
        },
        checkOut: {
            type: Date,
            required: true
        },
        nights: Number,

        guests: {
            adults: { type: Number, default: 1 },
            children: { type: Number, default: 0 }
        },

        // Pricing
        pricePerNight: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        finalPrice: Number,

        // Extras
        extras: {
            food: { type: Boolean, default: false },
            travel: { type: Boolean, default: false },
            wifi: { type: Boolean, default: false },
            insurance: { type: Boolean, default: false }
        },
        extrasTotal: {
            type: Number,
            default: 0
        },

        // Payment
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded", "failed"],
            default: "pending"
        },
        paymentMethod: String,
        paymentId: String,

        // Status
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        },

        // Contact
        contactInfo: {
            name: String,
            email: String,
            phone: String
        },

        specialRequests: String,

        // Cancellation
        cancelledAt: Date,
        cancellationReason: String
    },
    {
        timestamps: true
    }
);

// Calculate nights and final price
bookingSchema.pre("save", function (next) {
    if (this.checkIn && this.checkOut) {
        const diffTime = Math.abs(this.checkOut - this.checkIn);
        this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    this.finalPrice = this.totalPrice - this.discount + this.extrasTotal;
    next();
});

module.exports = mongoose.model("Booking", bookingSchema);
