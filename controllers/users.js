const User = require("../models/user");
const Wishlist = require("../models/wishlist");
const BadgeService = require("../services/badgeService");
const Review = require("../models/review");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password, confirmPassword, acceptTerms } = req.body;
        
        // Validate required fields
        if (!username || !email || !password || !confirmPassword) {
            req.flash("error", "All fields are required");
            return res.redirect("/signup");
        }
        
        // Check if terms are accepted
        if (!acceptTerms) {
            req.flash("error", "You must accept the Terms of Service and Privacy Policy");
            return res.redirect("/signup");
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match");
            return res.redirect("/signup");
        }
        
        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            req.flash("error", passwordValidation.message);
            return res.redirect("/signup");
        }
        
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Password strength validation function
function validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@!$%]/.test(password);
    
    if (password.length < minLength) {
        return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!hasNumbers) {
        return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: "Password must contain at least one special character (@!$%)" };
    }
    
    return { isValid: true, message: "Password is strong" };
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

const Listing = require("../models/listing");

module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'wishlist.listing',
                select: 'title price location image'
            });

        const [listingCount, reviewCount, wishlistCount] = await Promise.all([
            Listing.countDocuments({ owner: req.user._id }),
            Review.countDocuments({ author: req.user._id }),
            Wishlist.countDocuments({ user: req.user._id })
        ]);

        // Update user stats
        await BadgeService.updateUserStats(req.user._id);
        
        // Check for new badges
        const newBadges = await BadgeService.checkAndAwardBadges(req.user._id);
        
        // Get updated user with new badges
        const updatedUser = await User.findById(req.user._id);

        // Get recent activity (last 10 activities)
        const recentActivity = updatedUser.activityLog.slice(0, 10);

        res.render("users/profile.ejs", { 
            listingCount,
            reviewCount,
            wishlistCount,
            user: updatedUser,
            recentActivity,
            newBadges: newBadges.length > 0 ? newBadges : null,
            BadgeService
        });
    } catch (error) {
        console.error("Error rendering profile:", error);
        req.flash("error", "Error loading profile. Please try again.");
        res.redirect("/listings");
    }
};

module.exports.showLikedListings = async (req, res) => {
    const user = await User.findById(req.user._id).populate("likes");

    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/listings");
    }


    console.log("Liked listings being sent to the page:", user.likes);
    
    res.render("users/liked.ejs", { 
        name: user.username,
        likedListings: user.likes 
    });
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { 
            bio, 
            location, 
            hobbies, 
            interests, 
            website, 
            instagram, 
            twitter, 
            linkedin, 
            favoriteDestinations,
            isPublic,
            showEmail,
            showSocialLinks,
            showWishlist,
            showTravelStats
        } = req.body;

        const hobbiesArray = hobbies ? hobbies.split(',').map(h => h.trim()).filter(h => h) : [];
        const interestsArray = interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [];
        const destinationsArray = favoriteDestinations ? favoriteDestinations.split(',').map(d => d.trim()).filter(d => d) : [];

        const user = await User.findByIdAndUpdate(req.user._id, {
            bio: bio || "",
            location: location || "",
            hobbies: hobbiesArray,
            interests: interestsArray,
            favoriteDestinations: destinationsArray,
            socialLinks: {
                website: website || "",
                instagram: instagram || "",
                twitter: twitter || "",
                linkedin: linkedin || ""
            },
            profileSettings: {
                isPublic: isPublic === 'on',
                showEmail: showEmail === 'on',
                showSocialLinks: showSocialLinks === 'on',
                showWishlist: showWishlist === 'on',
                showTravelStats: showTravelStats === 'on'
            }
        }, { new: true });

        // Log the profile update activity
        await user.logActivity('profile_updated', 'Updated profile information');

        // Check for new badges after profile update
        await BadgeService.checkAndAwardBadges(req.user._id);

        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    } catch (error) {
        console.error("Error updating profile:", error);
        req.flash("error", "Error updating profile. Please try again.");
        res.redirect("/profile");
    }
};

// Wishlist Management
module.exports.addToWishlist = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { notes, priority, isPrivate } = req.body;

        // Check if already in wishlist
        const existingWishlist = await Wishlist.findOne({
            user: req.user._id,
            listing: listingId
        });

        if (existingWishlist) {
            req.flash("error", "This listing is already in your wishlist!");
            return res.redirect(`/listings/${listingId}`);
        }

        const wishlistItem = new Wishlist({
            user: req.user._id,
            listing: listingId,
            notes: notes || "",
            priority: priority || 'medium',
            isPrivate: isPrivate === 'on'
        });

        await wishlistItem.save();

        // Log activity
        const user = await User.findById(req.user._id);
        await user.logActivity('wishlist_add', 'Added listing to wishlist', listingId);

        req.flash("success", "Added to your wishlist!");
        res.redirect(`/listings/${listingId}`);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        req.flash("error", "Error adding to wishlist. Please try again.");
        res.redirect("/listings");
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { listingId } = req.params;

        await Wishlist.findOneAndDelete({
            user: req.user._id,
            listing: listingId
        });

        // Log activity
        const user = await User.findById(req.user._id);
        await user.logActivity('wishlist_remove', 'Removed listing from wishlist', listingId);

        req.flash("success", "Removed from your wishlist!");
        res.redirect("/profile/wishlist");
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        req.flash("error", "Error removing from wishlist. Please try again.");
        res.redirect("/profile/wishlist");
    }
};

module.exports.showWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ user: req.user._id })
            .populate('listing')
            .sort({ addedAt: -1 });

        res.render("users/wishlist.ejs", { 
            wishlistItems,
            title: "My Wishlist"
        });
    } catch (error) {
        console.error("Error loading wishlist:", error);
        req.flash("error", "Error loading wishlist. Please try again.");
        res.redirect("/profile");
    }
};

// Travel Goals Management
module.exports.addTravelGoal = async (req, res) => {
    try {
        const { destination, description, targetDate } = req.body;

        const user = await User.findById(req.user._id);
        user.travelGoals.push({
            destination,
            description: description || "",
            targetDate: targetDate ? new Date(targetDate) : null
        });

        await user.save();
        await user.logActivity('travel_goal_added', `Added travel goal: ${destination}`);

        req.flash("success", "Travel goal added successfully!");
        res.redirect("/profile#travel-goals");
    } catch (error) {
        console.error("Error adding travel goal:", error);
        req.flash("error", "Error adding travel goal. Please try again.");
        res.redirect("/profile");
    }
};

module.exports.completeTravelGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const user = await User.findById(req.user._id);
        
        const goal = user.travelGoals.id(goalId);
        if (!goal) {
            req.flash("error", "Travel goal not found!");
            return res.redirect("/profile");
        }

        goal.isCompleted = true;
        goal.completedAt = new Date();
        
        await user.save();
        await user.logActivity('travel_goal_completed', `Completed travel goal: ${goal.destination}`);

        // Check for achievement badges
        await BadgeService.checkAndAwardBadges(req.user._id);

        req.flash("success", "Congratulations on completing your travel goal!");
        res.redirect("/profile#travel-goals");
    } catch (error) {
        console.error("Error completing travel goal:", error);
        req.flash("error", "Error updating travel goal. Please try again.");
        res.redirect("/profile");
    }
};

module.exports.deleteTravelGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const user = await User.findById(req.user._id);
        
        user.travelGoals.id(goalId).remove();
        await user.save();

        req.flash("success", "Travel goal deleted successfully!");
        res.redirect("/profile#travel-goals");
    } catch (error) {
        console.error("Error deleting travel goal:", error);
        req.flash("error", "Error deleting travel goal. Please try again.");
        res.redirect("/profile");
    }
};

// Google OAuth callback handler
module.exports.googleCallback = (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
};