const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        basePrice: { type: Number, required: true }, // per person or per night
        description: { type: String },
        imageUrl: { type: String },

        // future add‑ons
        includesFood: { type: Boolean, default: false },
        includesTravel: { type: Boolean, default: false },
        includesWifi: { type: Boolean, default: false },
        activities: [{ type: String }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
