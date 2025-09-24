const User = require("../models/user");

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
    const listingCount = await Listing.countDocuments({ owner: req.user._id });
    res.render("users/profile.ejs", { listingCount });
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
        const { bio, location, hobbies, interests, website, instagram, twitter, linkedin, favoriteDestinations } = req.body;

    
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
        console.error("Error updating profile:", error);
        req.flash("error", "Error updating profile. Please try again.");
        res.redirect("/profile");
    }
};

// Google OAuth callback handler
module.exports.googleCallback = (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
};