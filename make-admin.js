// Quick script to make a user admin
const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to database
const MONGO_URL = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function makeAdmin() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');
        
        // Change 'your_username' to the actual username you want to make admin
        const username = 'your_username'; // CHANGE THIS
        
        const result = await User.updateOne(
            { username: username },
            { $set: { isAdmin: true } }
        );
        
        if (result.matchedCount > 0) {
            console.log(`✅ User '${username}' is now an admin!`);
        } else {
            console.log(`❌ User '${username}' not found`);
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

makeAdmin();