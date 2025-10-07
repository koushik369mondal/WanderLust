const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function makeAdmin() {
    try {
        await mongoose.connect(dbUrl);
        
        // Find any existing user and make them admin
        const existingUser = await User.findOne({});
        if (existingUser) {
            existingUser.isAdmin = true;
            await existingUser.save();
            console.log(`✅ Made ${existingUser.username} an admin!`);
            console.log(`Login with username: ${existingUser.username}`);
        } else {
            console.log('No users found. Please signup first at http://localhost:8080/signup');
            console.log('Then run this script again to make that user an admin.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

makeAdmin();