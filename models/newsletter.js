const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'footer',
        enum: ['footer', 'popup', 'signup', 'newsletter-page']
    }
});

// Create indexes for better performance
// Email index is automatically created due to unique: true
newsletterSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model("Newsletter", newsletterSchema);