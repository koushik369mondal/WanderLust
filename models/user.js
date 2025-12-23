const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
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
    lastActive: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
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
    }],
    vacationSlots: [{
        holidayName: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        holidayType: {
            type: String,
            required: true,
        },
        markedAt: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            maxlength: 200,
            default: "",
        }
    }],
    tripPlans: [{
        destination: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        travelers: {
            type: Number,
            required: true,
        },
        budgetType: {
            type: String,
            enum: ['budget', 'moderate', 'luxury'],
            required: true,
        },
        costs: {
            flights: Number,
            hotels: Number,
            food: Number,
            activities: Number
        },
        total: {
            type: Number,
            required: true,
        },
        packingList: {
            categories: {
                clothing: [{
                    item: String,
                    packed: { type: Boolean, default: false }
                }],
                toiletries: [{
                    item: String,
                    packed: { type: Boolean, default: false }
                }],
                gadgets: [{
                    item: String,
                    packed: { type: Boolean, default: false }
                }],
                activityGear: [{
                    item: String,
                    packed: { type: Boolean, default: false }
                }],
                healthEssentials: [{
                    item: String,
                    packed: { type: Boolean, default: false }
                }]
            },
            generatedAt: Date,
            weatherConsidered: { type: Boolean, default: false },
            fallback: { type: Boolean, default: false }
        },
        status: {
            type: String,
            enum: ['planned', 'booked', 'completed'],
            default: 'planned'
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        bookingStatus: {
            flights: { type: Boolean, default: false },
            hotels: { type: Boolean, default: false },
            activities: { type: Boolean, default: false }
        },
        notes: {
            type: String,
            default: ''
        },
        reminders: [{
            type: {
                type: String,
                enum: ['departure', 'custom'],
                default: 'departure'
            },
            message: String,
            scheduledFor: Date,
            isSent: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }],
        sharedWith: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    notifications: [{
        type: {
            type: String,
            enum: ['trip_added', 'trip_updated', 'trip_deleted', 'trip_reminder', 'trip_upcoming'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        relatedTrip: {
            type: Schema.Types.ObjectId,
            ref: 'User.tripPlans'
        },
        isRead: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    travelMemories: [{
        destination: {
            type: String,
            required: true,
            maxlength: 100
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        photos: [{
            url: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                required: true
            },
            caption: {
                type: String,
                maxlength: 200,
                default: ""
            }
        }],
        reflections: {
            type: String,
            maxlength: 1000,
            default: ""
        },
        rating: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        category: {
            type: String,
            enum: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'relaxation', 'food', 'nature', 'other'],
            default: 'other'
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notificationSettings: {
        tripAdded: { type: Boolean, default: true },
        tripUpdated: { type: Boolean, default: true },
        tripDeleted: { type: Boolean, default: true },
        tripReminders: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: false },
        pushNotifications: { type: Boolean, default: false },
        // Real-time notification system settings
        welcome: { type: Boolean, default: true },
        review: { type: Boolean, default: true },
        badge: { type: Boolean, default: true },
        like: { type: Boolean, default: true },
        system: { type: Boolean, default: true },
        discount: { type: Boolean, default: true },
        security: { type: Boolean, default: true },
        maintenance: { type: Boolean, default: false },
        event: { type: Boolean, default: true },
        friend: { type: Boolean, default: true },
        custom: { type: Boolean, default: true }
    }
}, { strict: false });


// Apply passport-local-mongoose plugin before indexes
userSchema.plugin(passportLocalMongoose);

// Indexes for better performance (username index handled by plugin)
userSchema.index({ email: 1 });
userSchema.index({ 'travelStats.totalReviews': -1 });
userSchema.index({ 'badges.earnedAt': -1 });
userSchema.index({ lastActive: -1 });

// Virtual for total wishlisted items
userSchema.virtual('wishlistCount').get(function () {
    return this.wishlist.length;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function () {
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
userSchema.methods.logActivity = function (action, details, relatedId) {
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
userSchema.methods.awardBadge = function (badgeData) {
    // Check if badge already exists
    const existingBadge = this.badges.find(badge => badge.name === badgeData.name);
    if (!existingBadge) {
        this.badges.push(badgeData);
        this.logActivity('badge_earned', `Earned "${badgeData.name}" badge`);
        return this.save();
    }
    return false;
};

// Method to add notification
userSchema.methods.addNotification = function (notificationData) {
    this.notifications.unshift(notificationData);

    // Keep only last 100 notifications to prevent bloating
    if (this.notifications.length > 100) {
        this.notifications = this.notifications.slice(0, 100);
    }

    return this.save();
};

// Method to mark notification as read
userSchema.methods.markNotificationAsRead = function (notificationId) {
    const notification = this.notifications.id(notificationId);
    if (notification) {
        notification.isRead = true;
        return this.save();
    }
    return false;
};

// Method to get unread notification count
userSchema.methods.getUnreadNotificationCount = function () {
    return this.notifications.filter(n => !n.isRead).length;
};

module.exports = mongoose.model('User', userSchema);
