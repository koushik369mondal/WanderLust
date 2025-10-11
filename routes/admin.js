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
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewData"
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: "$reviewData" },
                    avgRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviewData" }, 0] },
                            then: { $avg: "$reviewData.rating" },
                            else: 0
                        }
                    }
                }
            },
            { $match: { reviewCount: { $gte: 1 } } },
            {
                $group: {
                    _id: "$location",
                    avgRating: { $avg: "$avgRating" },
                    totalReviews: { $sum: "$reviewCount" },
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
        const [totalUsers, totalListings, totalReviews, avgRating, newUsersThisMonth, newListingsThisMonth] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Review.countDocuments(),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
            User.countDocuments({ joinDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
            Listing.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
        ]);

        res.json({
            totalUsers,
            totalListings,
            totalReviews,
            avgRating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0,
            newUsersThisMonth,
            newListingsThisMonth,
            growthRate: totalUsers > 0 ? Math.round((newUsersThisMonth / totalUsers) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quick stats" });
    }
});

// Additional analytics endpoints
router.get("/api/analytics/engagement-metrics", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const [activeUsers, topCategories, monthlyActivity] = await Promise.all([
            User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Listing.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$lastActive" },
                            month: { $month: "$lastActive" }
                        },
                        activeUsers: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                { $limit: 6 }
            ])
        ]);

        res.json({
            activeUsers,
            topCategories,
            monthlyActivity: monthlyActivity.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                activeUsers: item.activeUsers
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch engagement metrics" });
    }
});

router.get("/api/analytics/revenue-metrics", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const revenueData = await Listing.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalListings: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                    totalValue: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 }
        ]);

        const formattedData = revenueData.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            listings: item.totalListings,
            avgPrice: Math.round(item.avgPrice || 0),
            totalValue: Math.round(item.totalValue || 0)
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch revenue metrics" });
    }
});

// User Management Endpoints
router.get("/api/users", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'joinDate';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const query = search ? {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const users = await User.find(query)
            .select('username email joinDate isAdmin lastActive vacationSlots')
            .sort({ [sortBy]: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await User.countDocuments(query);

        res.json({
            users: users.map(user => ({
                ...user,
                joinDate: user.joinDate.toISOString().split('T')[0],
                lastActive: user.lastActive ? user.lastActive.toISOString().split('T')[0] : 'Never'
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/api/users/:id/make-admin", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.json({ success: true, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ error: "Failed to update admin status" });
    }
});

router.delete("/api/users/:id", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent deleting the current admin user
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ error: "Cannot delete your own account" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Listing Management Endpoints
router.get("/api/listings", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const category = req.query.category || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category;
        }

        const listings = await Listing.find(query)
            .populate('owner', 'username')
            .select('title location country category price createdAt featured reviews')
            .sort({ [sortBy]: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Listing.countDocuments(query);

        res.json({
            listings: listings.map(listing => ({
                ...listing,
                createdAt: listing.createdAt.toISOString().split('T')[0],
                reviewCount: listing.reviews ? listing.reviews.length : 0
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

router.delete("/api/listings/:id", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

router.post("/api/listings/:id/feature", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        listing.featured = !listing.featured;
        await listing.save();

        res.json({ success: true, featured: listing.featured });
    } catch (error) {
        res.status(500).json({ error: "Failed to update listing" });
    }
});

// Review Management Endpoints
router.get("/api/reviews", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const rating = req.query.rating ? parseInt(req.query.rating) : null;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const query = {};
        if (search) {
            query.comment = { $regex: search, $options: 'i' };
        }
        if (rating) {
            query.rating = rating;
        }

        const reviews = await Review.find(query)
            .populate('author', 'username')
            .populate('listing', 'title location')
            .select('rating comment createdAt flagged')
            .sort({ [sortBy]: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Review.countDocuments(query);

        res.json({
            reviews: reviews.map(review => ({
                ...review,
                createdAt: review.createdAt.toISOString().split('T')[0]
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

router.delete("/api/reviews/:id", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review" });
    }
});

router.post("/api/reviews/:id/flag", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        review.flagged = !review.flagged;
        await review.save();

        res.json({ success: true, flagged: review.flagged });
    } catch (error) {
        res.status(500).json({ error: "Failed to update review" });
    }
});

// System Settings (placeholder for future expansion)
router.get("/api/settings", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        // Placeholder for system settings
        res.json({
            maintenanceMode: false,
            allowRegistration: true,
            maxListingsPerUser: 10,
            featuredListingLimit: 5
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

// Recent Activity Logs (placeholder)
router.get("/api/activity", isLoggedIn, checkAdmin, async (req, res) => {
    try {
        // Placeholder for activity logs - in a real app, you'd have an activity log collection
        const recentUsers = await User.find()
            .select('username joinDate')
            .sort({ joinDate: -1 })
            .limit(5)
            .lean();

        const recentListings = await Listing.find()
            .select('title createdAt')
            .populate('owner', 'username')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.json({
            activities: [
                ...recentUsers.map(user => ({
                    type: 'user_registration',
                    message: `New user ${user.username} registered`,
                    timestamp: user.joinDate
                })),
                ...recentListings.map(listing => ({
                    type: 'listing_created',
                    message: `New listing "${listing.title}" created by ${listing.owner.username}`,
                    timestamp: listing.createdAt
                }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity logs" });
    }
});

module.exports = router;
