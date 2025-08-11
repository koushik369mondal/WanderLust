const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "",
    },
    hobbies: [{
        type: String,
        maxlength: 50,
    }],
    interests: [{
        type: String,
        maxlength: 50,
    }],
    socialLinks: {
        website: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        linkedin: {
            type: String,
            default: "",
        },
    },
    location: {
        type: String,
        maxlength: 100,
        default: "",
    },
    favoriteDestinations: [{
        type: String,
        maxlength: 100,
    }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);