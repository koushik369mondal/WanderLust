if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function createKaushikAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('🔗 Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ username: 'kaushikfire' });
        if (existingUser) {
            // Update existing user to be admin
            existingUser.isAdmin = true;
            await existingUser.save();
            console.log('✅ Existing user "kaushikfire" updated to admin successfully!');
        } else {
            // Create new admin user
            const adminData = {
                username: 'kaushikfire',
                email: 'kaushikfire@wanderlust.com',
                isAdmin: true
            };

            const admin = new User(adminData);
            await User.register(admin, 'Admin@123');
            console.log('✅ New admin user "kaushikfire" created successfully!');
        }

        console.log('\n🎉 Admin credentials:');
        console.log('Username: kaushikfire');
        console.log('Password: Admin@123');
        console.log('Admin Dashboard URL: http://localhost:8080/admin/dashboard');
        console.log('Login URL: http://localhost:8080/login');

        // Verify the user was created correctly
        const verifyUser = await User.findOne({ username: 'kaushikfire' });
        if (verifyUser && verifyUser.isAdmin) {
            console.log('\n✅ Verification successful:');
            console.log('   Username:', verifyUser.username);
            console.log('   Email:', verifyUser.email);
            console.log('   Admin Status:', verifyUser.isAdmin);
            console.log('   Has hash:', !!verifyUser.hash);
            console.log('   Has salt:', !!verifyUser.salt);
        } else {
            console.log('❌ Verification failed');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createKaushikAdmin();