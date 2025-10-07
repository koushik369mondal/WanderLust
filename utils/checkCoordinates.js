const mongoose = require('mongoose');
const Listing = require('../models/listing');
const { updateListingCoordinates } = require('./updateCoordinates');
require('dotenv').config();

async function checkAndFixCoordinates() {
  try {
    await mongoose.connect(process.env.ATLAS_DB_URL);
    console.log('✅ Connected to database');
    
    // Check current coordinates
    const listings = await Listing.find({});
    console.log('\n🔍 Current coordinates in database:');
    console.log('=======================================');
    
    let needsUpdate = false;
    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title}`);
      console.log(`   Location: ${listing.location}, ${listing.country}`);
      if (listing.geometry && listing.geometry.coordinates) {
        const [lng, lat] = listing.geometry.coordinates;
        console.log(`   Coordinates: [${lng}, ${lat}]`);
        // Check if coordinates are undefined, null, or default NYC coordinates
        if (lng === undefined || lat === undefined || lng === null || lat === null || isNaN(lng) || isNaN(lat)) {
          console.log(`   ❌ Invalid coordinates (undefined/null/NaN)!`);
          needsUpdate = true;
        } else if (lng === -74.006 && lat === 40.7128) {
          console.log(`   ⚠️  Using default NYC coordinates!`);
          needsUpdate = true;
        } else {
          console.log(`   ✅ Has specific coordinates`);
        }
      } else {
        console.log(`   ❌ No coordinates found!`);
        needsUpdate = true;
      }
      console.log('');
    });
    
    if (needsUpdate) {
      console.log('🔧 Some listings need coordinate updates. Running update...');
      await updateListingCoordinates();
      console.log('✅ Coordinate update completed!');
      
      // Show updated coordinates
      const updatedListings = await Listing.find({});
      console.log('\n📍 Updated coordinates:');
      console.log('=======================');
      updatedListings.forEach((listing, index) => {
        console.log(`${index + 1}. ${listing.title} -> [${listing.geometry.coordinates[0]}, ${listing.geometry.coordinates[1]}]`);
      });
    } else {
      console.log('✅ All listings have proper coordinates!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
  }
}

checkAndFixCoordinates();