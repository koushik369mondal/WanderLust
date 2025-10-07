const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

// Admin middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "Access denied. Admin privileges required.");
        return res.redirect("/listings");
    }
    next();
};

// Admin Dashboard Route
router.get("/dashboard", isLoggedIn, checkAdmin, (req, res) => {
    res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// Analytics API Endpoints
router.get("/api/analytics/user-growth", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$joinDate" },
                        month: { $month: "$joinDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 }
        ]);

        const formattedData = userGrowth.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            users: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user growth data" });
    }
});

router.get("/api/analytics/top-destinations", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const topDestinations = await Listing.aggregate([
            { $match: { avgRating: { $gte: 1 } } },
            {
                $group: {
                    _id: "$location",
                    avgRating: { $avg: "$avgRating" },
                    totalReviews: { $sum: { $size: "$reviews" } },
                    listingCount: { $sum: 1 }
                }
            },
            { $sort: { avgRating: -1, totalReviews: -1 } },
            { $limit: 10 }
        ]);

        res.json(topDestinations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch top destinations" });
    }
});

router.get("/api/analytics/top-contributors", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const topContributors = await User.aggregate([
            {
                $lookup: {
                    from: "listings",
                    localField: "_id",
                    foreignField: "owner",
                    as: "listings"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "author",
                    as: "reviews"
                }
            },
            {
                $project: {
                    username: 1,
                    listingCount: { $size: "$listings" },
                    reviewCount: { $size: "$reviews" },
                    totalContributions: { $add: [{ $size: "$listings" }, { $size: "$reviews" }] }
                }
            },
            { $sort: { totalContributions: -1 } },
            { $limit: 10 }
        ]);

        res.json(topContributors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch top contributors" });
    }
});

router.get("/api/analytics/review-trends", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const reviewTrends = await Review.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    avgRating: { $avg: "$rating" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 }
        ]);

        const formattedData = reviewTrends.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            reviews: item.count,
            avgRating: Math.round(item.avgRating * 10) / 10
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch review trends" });
    }
});

router.get("/api/analytics/quick-stats", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const [totalUsers, totalListings, totalReviews, avgRating] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Review.countDocuments(),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }])
        ]);

        res.json({
            totalUsers,
            totalListings,
            totalReviews,
            avgRating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quick stats" });
    }
});

module.exports = router;