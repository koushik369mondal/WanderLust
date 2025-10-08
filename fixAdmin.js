if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function fixAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log(`\n🎯 Targeting database: ${mongoose.connection.name}`);
        if (process.env.ATLAS_DB_URL) {
            console.log("   (Using MongoDB Atlas from .env file)");
        } else {
            console.log("   (Using local MongoDB)");
        }
        console.log('🔗 Connected to MongoDB');

        // Delete the broken admin user
        await User.deleteOne({ username: 'admin' });
        console.log('🗑️ Deleted broken admin user');

        // Create fresh admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@wanderlust.com',
            isAdmin: true
        });

        // User.register handles hashing the password and saving the user.
        const registeredAdmin = await User.register(admin, '@Admin123');
        console.log('✅ Fresh admin user created!');

        // Verify it works
        const testAdmin = await User.findOne({ username: 'admin' }).select('+hash +salt');
        console.log('✅ Admin verification:');
        console.log('   Has hash:', !!testAdmin.hash);
        console.log('   Has salt:', !!testAdmin.salt);
        console.log('   IsAdmin:', testAdmin.isAdmin); // Should be true
        
        console.log('\n🎉 FIXED! Use these credentials:');
        console.log('Username: admin');
        console.log('Password: @Admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixAdmin();