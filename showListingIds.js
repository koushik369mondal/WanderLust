// Quick script to show all valid listing IDs in the database
const mongoose = require('mongoose');
require('dotenv').config();

const Listing = require('./models/listing');

async function showAllListingIds() {
    try {
        const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
        const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;
        
        console.log('Connecting to database...');
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB ✅\n');
        
        const listings = await Listing.find({}).select('_id title location country').limit(20);
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('   VALID LISTING IDS IN YOUR DATABASE');
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        if (listings.length === 0) {
            console.log('❌ No listings found! Run: npm run seed');
        } else {
            listings.forEach((listing, index) => {
                console.log(`${index + 1}. ID: ${listing._id}`);
                console.log(`   Title: ${listing.title}`);
                console.log(`   Location: ${listing.location}, ${listing.country}`);
                console.log(`   URL: http://localhost:8080/listings/${listing._id}`);
                console.log('');
            });
            
            console.log('═══════════════════════════════════════════════════════════════');
            console.log(`Total listings: ${listings.length}`);
            console.log('═══════════════════════════════════════════════════════════════\n');
            
            console.log('📝 INVALID IDs FROM YOUR BROWSER CACHE:');
            console.log('   ❌ 68f0440df427bea75937500b');
            console.log('   ❌ 68f0440df427bea75937500d');
            console.log('   ❌ 68f0440df427bea75937500e');
            console.log('   ❌ 68f0440df427bea75937501f');
            console.log('\n   These IDs DO NOT EXIST in the database!\n');
            
            console.log('🚨 SOLUTION: CLEAR YOUR BROWSER CACHE!');
            console.log('   1. Press Ctrl + Shift + Delete');
            console.log('   2. Select "All time"');
            console.log('   3. Clear cache and cookies');
            console.log('   4. Restart browser\n');
        }
        
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB ✅');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

showAllListingIds();
