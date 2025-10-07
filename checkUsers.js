const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function checkUsers() {
    try {
        await mongoose.connect(dbUrl);
        
        // Check all users
        const users = await User.find({});
        console.log('All users:', users.map(u => ({ username: u.username, isAdmin: u.isAdmin })));
        
        // Create a simple admin with different password
        await User.deleteMany({ username: { $in: ['admin', 'testadmin'] } });
        
        const admin = new User({
            username: 'testadmin',
            email: 'test@admin.com',
            isAdmin: true
        });
        
        await User.register(admin, '123456');
        console.log('✅ Test admin created!');
        console.log('Username: testadmin');
        console.log('Password: 123456');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();