const Newsletter = require("../models/newsletter.js");

// Subscribe to newsletter
module.exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email) {
            req.flash("error", "Please provide an email address.");
            return res.redirect("back");
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                req.flash("error", "This email is already subscribed to our newsletter!");
                return res.redirect("back");
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();
                req.flash("success", "Welcome back! Your newsletter subscription has been reactivated.");
                return res.redirect("back");
            }
        }

        // Create new subscription
        const newSubscriber = new Newsletter({
            email: email.toLowerCase(),
            source: req.body.source || 'footer'
        });

        await newSubscriber.save();
        req.flash("success", "🎉 Thank you for subscribing! You'll receive travel tips and exclusive deals.");
        res.redirect("back");

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        
        if (error.name === 'ValidationError') {
            req.flash("error", "Please enter a valid email address.");
        } else if (error.code === 11000) {
            req.flash("error", "This email is already subscribed to our newsletter!");
        } else {
            req.flash("error", "Something went wrong. Please try again later.");
        }
        
        res.redirect("back");
    }
};

// Unsubscribe from newsletter
module.exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            req.flash("error", "Please provide an email address.");
            return res.redirect("back");
        }

        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        
        if (!subscriber) {
            req.flash("error", "Email address not found in our newsletter list.");
            return res.redirect("back");
        }

        if (!subscriber.isActive) {
            req.flash("error", "This email is already unsubscribed.");
            return res.redirect("back");
        }

        subscriber.isActive = false;
        await subscriber.save();
        
        req.flash("success", "You have been successfully unsubscribed from our newsletter.");
        res.redirect("back");

    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        req.flash("error", "Something went wrong. Please try again later.");
        res.redirect("back");
    }
};

// Get newsletter statistics (admin only)
module.exports.getStats = async (req, res) => {
    try {
        const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
        const recentSubscribers = await Newsletter.countDocuments({
            isActive: true,
            subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        });
        
        const subscribersBySource = await Newsletter.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        res.json({
            totalSubscribers,
            recentSubscribers,
            subscribersBySource
        });

    } catch (error) {
        console.error("Newsletter stats error:", error);
        res.status(500).json({ error: "Failed to fetch newsletter statistics" });
    }
};