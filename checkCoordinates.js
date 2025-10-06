const mongoose = require('mongoose');
const Listing = require('./models/listing');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function checkCoordinates() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
    
    const listings = await Listing.find({}, 'title location country geometry').limit(5);
    
    console.log('Sample listings and their coordinates:');
    listings.forEach(listing => {
      console.log(`${listing.title} (${listing.location}, ${listing.country})`);
      console.log(`Coordinates: ${listing.geometry ? listing.geometry.coordinates : 'No geometry'}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCoordinates();