const User = require("../models/user");
const { isLoggedIn } = require("../middleware.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
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

module.exports.renderProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to view your profile!");
        return res.redirect("/login");
    }
    res.render("users/profile.ejs");
};

module.exports.updateProfile = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to update your profile!");
        return res.redirect("/login");
    }
    
    try {
        const { bio, location, hobbies, interests, website, instagram, twitter, linkedin, favoriteDestinations } = req.body;
        
        // Parse comma-separated strings into arrays
        const hobbiesArray = hobbies ? hobbies.split(',').map(h => h.trim()).filter(h => h) : [];
        const interestsArray = interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [];
        const destinationsArray = favoriteDestinations ? favoriteDestinations.split(',').map(d => d.trim()).filter(d => d) : [];
        
        await User.findByIdAndUpdate(req.user._id, {
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
            }
        });
        
        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    } catch (error) {
        req.flash("error", "Error updating profile. Please try again.");
        res.redirect("/profile");
    }
};
