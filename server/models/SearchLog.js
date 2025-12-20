const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        query: {
            type: String,
            required: true
        },
        filters: {
            category: String,
            minPrice: Number,
            maxPrice: Number,
            location: String
        },
        resultsCount: Number,
        ipAddress: String,
        userAgent: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SearchLog", searchLogSchema);
