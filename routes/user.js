const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
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
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", 
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

// Smart Travel Recommendations Route
router.get("/recommendations", (req, res) => {
    console.log("Direct route handler called");
    res.send("Direct route handler working!");
});

// Root route - redirect to listings
router.get("/", (req, res) => {
    res.redirect("/listings");
});

module.exports = router;
