const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
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
        content: {
            type: String,
            required: true,
            maxlength: 5000
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        location: {
            country: String,
            city: String,
            place: String
        },

        images: [
            {
                url: String,
                publicId: String,
                caption: String
            }
        ],

        tags: [String],

        mood: {
            type: String,
            enum: ["amazing", "good", "okay", "difficult", "challenging"]
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },

        isPublic: {
            type: Boolean,
            default: false
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        likesCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
