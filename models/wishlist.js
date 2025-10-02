const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        maxlength: 200,
        default: ""
    },
    tags: [{
        type: String,
        maxlength: 20
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
});

// Create compound index to prevent duplicate entries
wishlistSchema.index({ user: 1, listing: 1 }, { unique: true });

// Index for efficient queries
wishlistSchema.index({ user: 1, addedAt: -1 });
wishlistSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);