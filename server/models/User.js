const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            minlength: 6
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },
        googleId: String,

        // Profile Information
        profilePicture: {
            type: String,
            default: "https://res.cloudinary.com/wanderlust/image/upload/v1/default-avatar.png"
        },
        bio: {
            type: String,
            maxlength: 500
        },
        location: String,
        phone: String,

        // Social Links
        socialLinks: {
            website: String,
            instagram: String,
            twitter: String,
            linkedin: String
        },

        // Travel Stats
        travelStats: {
            countriesVisited: { type: Number, default: 0 },
            citiesVisited: { type: Number, default: 0 },
            tripsCompleted: { type: Number, default: 0 },
            reviewsWritten: { type: Number, default: 0 },
            listingsCreated: { type: Number, default: 0 }
        },

        // Interests
        interests: [String],
        hobbies: [String],
        favoriteDestinations: [String],

        // Wishlist & Likes
        wishlist: [
            {
                listing: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Listing"
                },
                note: String,
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        likedListings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing"
            }
        ],

        // Achievements & Points
        achievements: [
            {
                type: String,
                enum: [
                    "FIRST_TRIP",
                    "5_COUNTRIES",
                    "10_COUNTRIES",
                    "20_COUNTRIES",
                    "WORLD_TRAVELER",
                    "FIRST_REVIEW",
                    "10_REVIEWS",
                    "50_REVIEWS",
                    "REVIEW_MASTER",
                    "FIRST_LISTING",
                    "5_LISTINGS",
                    "POPULAR_HOST",
                    "SOCIAL_BUTTERFLY",
                    "HELPFUL_REVIEWER",
                    "EARLY_ADOPTER",
                    "VETERAN_TRAVELER"
                ]
            }
        ],
        points: {
            type: Number,
            default: 0
        },

        // Vacation Planner
        annualLeave: {
            total: { type: Number, default: 20 },
            used: { type: Number, default: 0 },
            planned: { type: Number, default: 0 }
        },

        // Admin & Status
        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isSuspended: {
            type: Boolean,
            default: false
        },
        suspendedUntil: Date,

        // Preferences
        language: {
            type: String,
            default: "en"
        },
        currency: {
            type: String,
            default: "USD"
        },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate available leave
userSchema.virtual("availableLeave").get(function () {
    return this.annualLeave.total - this.annualLeave.used - this.annualLeave.planned;
});

module.exports = mongoose.model("User", userSchema);
