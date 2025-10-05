const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    // Google OAuth fields
    googleId: {
        type: String,
        sparse: true, // Allows multiple documents without this field
    },
    displayName: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "",
    },
    hobbies: [{
        type: String,
        maxlength: 50,
    }],
    interests: [{
        type: String,
        maxlength: 50,
    }],
    socialLinks: {
        website: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        linkedin: {
            type: String,
            default: "",
        },
    },
    location: {
        type: String,
        maxlength: 100,
        default: "",
    },
    favoriteDestinations: [{
        type: String,
        maxlength: 100,
    }],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
    // Enhanced profile fields
    avatar: {
        url: {
            type: String,
            default: "",
        },
        filename: {
            type: String,
            default: "",
        }
    },
    wishlist: [
        {
            listing: {
                type: Schema.Types.ObjectId,
                ref: "Listing",
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
            notes: {
                type: String,
                maxlength: 200,
                default: "",
            }
        }
    ],
    travelStats: {
        countriesVisited: {
            type: Number,
            default: 0,
        },
        citiesVisited: {
            type: Number,
            default: 0,
        },
        totalTrips: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        totalListings: {
            type: Number,
            default: 0,
        }
    },
    badges: [{
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        earnedAt: {
            type: Date,
            default: Date.now,
        },
        category: {
            type: String,
            enum: ['explorer', 'reviewer', 'host', 'social', 'milestone'],
            required: true,
        }
    }],
    travelGoals: [{
        destination: {
            type: String,
            required: true,
            maxlength: 100,
        },
        description: {
            type: String,
            maxlength: 200,
        },
        targetDate: {
            type: Date,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    profileSettings: {
        isPublic: {
            type: Boolean,
            default: true,
        },
        showEmail: {
            type: Boolean,
            default: false,
        },
        showSocialLinks: {
            type: Boolean,
            default: true,
        },
        showWishlist: {
            type: Boolean,
            default: false,
        },
        showTravelStats: {
            type: Boolean,
            default: true,
        }
    },
    notificationSettings: {
        email: {
            newReview: { type: Boolean, default: true },
            badgeEarned: { type: Boolean, default: true },
            wishlistDiscount: { type: Boolean, default: true },
            systemAnnouncements: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: true }
        },
        push: {
            newReview: { type: Boolean, default: true },
            badgeEarned: { type: Boolean, default: true },
            wishlistDiscount: { type: Boolean, default: true },
            systemAnnouncements: { type: Boolean, default: false },
            newsletter: { type: Boolean, default: false }
        },
        inApp: {
            newReview: { type: Boolean, default: true },
            newRating: { type: Boolean, default: true },
            listingLiked: { type: Boolean, default: true },
            badgeEarned: { type: Boolean, default: true },
            wishlistDiscount: { type: Boolean, default: true },
            systemAnnouncements: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: true }
        }
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    activityLog: [{
        action: {
            type: String,
            required: true,
        },
        details: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
        }
    }]
});

// Indexes for better performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'travelStats.totalReviews': -1 });
userSchema.index({ 'badges.earnedAt': -1 });
userSchema.index({ lastActive: -1 });

// Virtual for total wishlisted items
userSchema.virtual('wishlistCount').get(function() {
    return this.wishlist.length;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
    let completion = 0;
    const fields = [
        this.bio, 
        this.location, 
        this.avatar.url,
        this.hobbies.length > 0,
        this.interests.length > 0,
        this.favoriteDestinations.length > 0,
        Object.values(this.socialLinks).some(link => link)
    ];
    
    fields.forEach(field => {
        if (field) completion += (100 / fields.length);
    });
    
    return Math.round(completion);
});

// Method to add activity to log
userSchema.methods.logActivity = function(action, details, relatedId) {
    this.activityLog.unshift({
        action,
        details,
        relatedId,
        timestamp: new Date()
    });
    
    // Keep only last 50 activities to prevent bloating
    if (this.activityLog.length > 50) {
        this.activityLog = this.activityLog.slice(0, 50);
    }
    
    this.lastActive = new Date();
    return this.save();
};

// Method to award badge
userSchema.methods.awardBadge = function(badgeData) {
    // Check if badge already exists
    const existingBadge = this.badges.find(badge => badge.name === badgeData.name);
    if (!existingBadge) {
        this.badges.push(badgeData);
        this.logActivity('badge_earned', `Earned "${badgeData.name}" badge`);
        return this.save();
    }
    return false;
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);