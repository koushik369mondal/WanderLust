if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function testKaushikLogin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('🔗 Connected to MongoDB');

        // Find the user
        const user = await User.findOne({ username: 'kaushikfire' });
        if (!user) {
            console.log('❌ User "kaushikfire" not found');
            process.exit(1);
        }

        console.log('✅ User found:');
        console.log('   Username:', user.username);
        console.log('   Email:', user.email);
        console.log('   Admin Status:', user.isAdmin);

        // Test authentication
        console.log('\n🔐 Testing password authentication...');
        user.authenticate('Admin@123', (err, authenticatedUser, passwordErr) => {
            if (err) {
                console.log('❌ Authentication error:', err);
            } else if (passwordErr) {
                console.log('❌ Password error:', passwordErr);
            } else if (authenticatedUser) {
                console.log('✅ Password authentication successful!');
                console.log('\n🎉 Login credentials verified:');
                console.log('Username: kaushikfire');
                console.log('Password: Admin@123');
                console.log('Dashboard URL: http://localhost:8080/admin/dashboard');
            } else {
                console.log('❌ Authentication failed');
            }
            
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testKaushikLogin();