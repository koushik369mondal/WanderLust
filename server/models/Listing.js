const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Location
        location: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            address: String,
            coordinates: {
                type: { type: String, enum: ["Point"], default: "Point" },
                coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
            }
        },

        // Images
        images: [
            {
                url: String,
                publicId: String,
                caption: String
            }
        ],

        // Category
        category: {
            type: String,
            required: true,
            enum: [
                "Trending",
                "Mountains",
                "Beaches",
                "Castles",
                "Arctic",
                "Domes",
                "Boats",
                "Islands",
                "Lakes",
                "Camping",
                "Farms",
                "Historic"
            ]
        },

        // Amenities & Features
        amenities: [String],
        maxGuests: {
            type: Number,
            default: 2
        },
        bedrooms: Number,
        bathrooms: Number,

        // Status
        isFeatured: {
            type: Boolean,
            default: false
        },
        hasDiscount: {
            type: Boolean,
            default: false
        },
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        // Owner
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Reviews & Ratings
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        },

        // Likes
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        likesCount: {
            type: Number,
            default: 0
        },

        // AI Summary
        aiSummary: {
            highlights: [String],
            pros: [String],
            cons: [String],
            targetAudience: String,
            generatedAt: Date
        },

        // Booking
        isAvailable: {
            type: Boolean,
            default: true
        },
        instantBooking: {
            type: Boolean,
            default: false
        },

        // Views
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Index for geospatial queries
listingSchema.index({ "location.coordinates": "2dsphere" });

// Text index for search
listingSchema.index({ title: "text", description: "text", "location.city": "text", "location.country": "text" });

// Calculate average rating
listingSchema.methods.updateAverageRating = async function () {
    const Review = mongoose.model("Review");
    const reviews = await Review.find({ listing: this._id });

    if (reviews.length === 0) {
        this.averageRating = 0;
        this.totalReviews = 0;
    } else {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = (sum / reviews.length).toFixed(1);
        this.totalReviews = reviews.length;
    }

    await this.save();
};

module.exports = mongoose.model("Listing", listingSchema);
