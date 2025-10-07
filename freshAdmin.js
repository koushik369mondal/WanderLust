const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function createFreshAdmin() {
    try {
        await mongoose.connect(dbUrl);
        
        // Delete all existing users to start fresh
        await User.deleteMany({});
        console.log('Cleared all users');
        
        // Create fresh admin
        const admin = new User({
            username: 'superadmin',
            email: 'super@admin.com',
            isAdmin: true
        });
        
        await User.register(admin, 'password');
        console.log('✅ Fresh admin created!');
        console.log('Username: superadmin');
        console.log('Password: password');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createFreshAdmin();