const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        travelers: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true },

        // future fields: travel type, food plan, activities etc.
        extras: {
            food: { type: Boolean, default: false },
            travel: { type: Boolean, default: false },
            wifi: { type: Boolean, default: false }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
