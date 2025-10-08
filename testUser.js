const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function testUser() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Check if User has register method
        console.log('User.register:', typeof User.register);
        console.log('User.authenticate:', typeof User.authenticate);

        // Check schema paths
        console.log('Schema paths:', Object.keys(User.schema.paths));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testUser();
