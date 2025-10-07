const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function createSimpleAdmin() {
    try {
        await mongoose.connect(dbUrl);
        
        await User.deleteMany({});
        console.log('Cleared all users');
        
        // Create admin with strong password that meets all requirements
        const admin = new User({
            username: 'admin',
            email: 'admin@test.com',
            isAdmin: true
        });
        
        // Password meets all requirements: 8+ chars, uppercase, lowercase, number, special char
        await User.register(admin, 'Admin123@');
        console.log('✅ Admin created successfully!');
        console.log('Username: admin');
        console.log('Password: Admin123@');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createSimpleAdmin();