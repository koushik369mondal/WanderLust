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

router
    .route("/profile")
    .get(isLoggedIn, userController.renderProfile)
    .put(isLoggedIn, userController.updateProfile);

// Root route - redirect to listings
router.get("/", (req, res) => {
    res.redirect("/listings");
});

module.exports = router;
