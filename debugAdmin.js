const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function debugAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log('🔗 Connected to MongoDB');

        // Check if admin exists
        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            console.log('✅ Admin user found:');
            console.log('   Username:', admin.username);
            console.log('   Email:', admin.email);
            console.log('   IsAdmin:', admin.isAdmin);
            console.log('   Has hash:', !!admin.hash);
            console.log('   Has salt:', !!admin.salt);
        } else {
            console.log('❌ No admin user found');
            console.log('Creating admin user...');
            
            // Create admin user
            const newAdmin = new User({
                username: 'admin',
                email: 'admin@wanderlust.com',
                isAdmin: true
            });
            
            await User.register(newAdmin, '@Admin123');
            console.log('✅ Admin user created successfully!');
        }

        // Test authentication
        console.log('\n🔐 Testing authentication...');
        const testAdmin = await User.findOne({ username: 'admin' });
        
        if (testAdmin) {
            // Test password
            testAdmin.authenticate('@Admin123', (err, user, passwordErr) => {
                if (err) {
                    console.log('❌ Authentication error:', err);
                } else if (passwordErr) {
                    console.log('❌ Password error:', passwordErr);
                } else if (user) {
                    console.log('✅ Password authentication successful!');
                } else {
                    console.log('❌ Authentication failed - user is false');
                }
                
                console.log('\n📋 Final credentials:');
                console.log('Username: admin');
                console.log('Password: @Admin123');
                console.log('Login URL: http://localhost:8080/login');
                console.log('Dashboard URL: http://localhost:8080/admin/dashboard');
                
                process.exit(0);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

debugAdmin();