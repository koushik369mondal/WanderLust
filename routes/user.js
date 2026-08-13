const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

// Rate limiting for sensitive authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many authentication requests, please try again after 15 minutes."
});

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(authLimiter, wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        authLimiter,
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

router.get("/logout", userController.logout);

// Google OAuth routes
router.get("/auth/google", 
    authLimiter,
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", 
    authLimiter,
    passport.authenticate("google", { failureRedirect: "/signup" }),
    userController.googleCallback
);


router.get("/profile/likes", isLoggedIn, userController.showLikedListings);

// Wishlist Routes (place before general profile routes)
router.get("/profile/wishlist", isLoggedIn, wrapAsync(userController.showWishlist));
router.post("/profile/wishlist/:listingId", isLoggedIn, wrapAsync(userController.addToWishlist));
router.get("/profile/wishlist/add/:listingId", isLoggedIn, wrapAsync(userController.addToWishlist));
router.delete("/profile/wishlist/:listingId", isLoggedIn, wrapAsync(userController.removeFromWishlist));

// Vacation Slots Route
router.get("/profile/vacation-slots", isLoggedIn, wrapAsync(userController.showVacationSlots));

// Enhanced Profile Routes
router
    .route("/profile")
    .get(isLoggedIn, userController.renderProfile)
    .put(isLoggedIn, userController.updateProfile);

// Travel Goals Routes
router.post("/profile/travel-goals", isLoggedIn, wrapAsync(userController.addTravelGoal));
router.patch("/profile/travel-goals/:goalId/complete", isLoggedIn, wrapAsync(userController.completeTravelGoal));
router.delete("/profile/travel-goals/:goalId", isLoggedIn, wrapAsync(userController.deleteTravelGoal));

// Achievements Route
router.get("/achievements", isLoggedIn, wrapAsync(userController.showAchievements));

// Leaderboard Route
router.get("/leaderboard", isLoggedIn, wrapAsync(userController.showLeaderboard));

// Travel Journal Routes
router.get("/profile/travel-journal", isLoggedIn, wrapAsync(userController.showTravelJournal));
router.post("/profile/travel-journal", isLoggedIn, wrapAsync(userController.addTravelMemory));
router.patch("/profile/travel-journal/:memoryId", isLoggedIn, wrapAsync(userController.updateTravelMemory));
router.delete("/profile/travel-journal/:memoryId", isLoggedIn, wrapAsync(userController.deleteTravelMemory));

// Root route - redirect to listings
router.get("/", (req, res) => {
    res.redirect("/listings");
});

module.exports = router;
