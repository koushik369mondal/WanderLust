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


router
    .route("/profile")
    .get(isLoggedIn, userController.renderProfile)
    .put(isLoggedIn, userController.updateProfile);

// Root route - redirect to listings
router.get("/", (req, res) => {
    res.redirect("/listings");
});

module.exports = router;
