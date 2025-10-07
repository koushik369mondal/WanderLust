const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function fixAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Delete existing admin if exists
        await User.deleteOne({ username: 'admin' });
        console.log('Removed existing admin user');

        // Create new admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@wanderlust.com',
            isAdmin: true
        });

        await User.register(admin, 'admin123');
        console.log('✅ New admin user created!');
        console.log('Username: admin');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixAdmin();