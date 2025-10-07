const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function createAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Create admin user
        const adminData = {
            username: 'admin',
            email: 'admin@wanderlust.com',
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            // Update existing user to be admin
            existingAdmin.isAdmin = true;
            await existingAdmin.save();
            console.log('✅ Existing admin user updated successfully!');
        } else {
            // Create new admin user
            const admin = new User(adminData);
            await User.register(admin, 'admin123'); // password: admin123
            console.log('✅ Admin user created successfully!');
        }

        console.log('Admin credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Admin Dashboard URL: http://localhost:8080/admin/dashboard');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();