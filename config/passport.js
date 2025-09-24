const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
            return done(null, existingUser);
        }
        
        // Check if user exists with same email
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.displayName = profile.displayName;
            user.profilePicture = profile.photos[0]?.value || "";
            await user.save();
            return done(null, user);
        }
        
        // Create new user
        const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            profilePicture: profile.photos[0]?.value || "",
            username: profile.emails[0].value.split('@')[0] // Use email prefix as username
        });
        
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
