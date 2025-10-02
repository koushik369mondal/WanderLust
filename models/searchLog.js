const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchLogSchema = new Schema({
    query: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    resultsCount: {
        type: Number,
        required: true,
        min: 0
    },
    userAgent: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        default: ''
    }
});

// Create indexes for better performance
searchLogSchema.index({ timestamp: -1 });
searchLogSchema.index({ query: 1 });
searchLogSchema.index({ resultsCount: 1 });

module.exports = mongoose.model("SearchLog", searchLogSchema);