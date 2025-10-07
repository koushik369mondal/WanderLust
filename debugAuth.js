const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function debugAuth() {
    try {
        await mongoose.connect(dbUrl);
        
        // Check all users
        const users = await User.find({});
        console.log('All users in database:');
        users.forEach(user => {
            console.log(`- Username: ${user.username}, Email: ${user.email}, isAdmin: ${user.isAdmin}`);
        });
        
        // Test authentication with the admin user
        if (users.length > 0) {
            const admin = users.find(u => u.username === 'admin');
            if (admin) {
                console.log('\nTesting authentication...');
                
                // Test with correct password
                admin.authenticate('Admin123@', (err, user, passwordErr) => {
                    if (err) {
                        console.log('Authentication error:', err);
                    } else if (passwordErr) {
                        console.log('Password error:', passwordErr);
                    } else if (user) {
                        console.log('✅ Authentication successful!');
                        console.log('Use: Username: admin, Password: Admin123@');
                    } else {
                        console.log('❌ Authentication failed');
                    }
                    process.exit(0);
                });
            } else {
                console.log('No admin user found');
                process.exit(0);
            }
        } else {
            console.log('No users found in database');
            process.exit(0);
        }
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugAuth();