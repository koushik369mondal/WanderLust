const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function createQuickAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
        
        // Delete existing admin if any
        await User.deleteOne({ username: 'admin' });
        console.log('Removed existing admin user');
        
        // Create new admin
        const admin = new User({
            username: 'admin',
            email: 'admin@wanderlust.com',
            isAdmin: true
        });
        
        await User.register(admin, '@Admin123');
        console.log('✅ Admin created successfully!');
        console.log('Username: admin');
        console.log('Password: @Admin123');
        console.log('Dashboard URL: http://localhost:8080/admin/dashboard');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createQuickAdmin();