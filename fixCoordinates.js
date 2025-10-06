const mongoose = require('mongoose');
const { updateListingCoordinates } = require('./utils/updateCoordinates');

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
    
    await updateListingCoordinates();
    
    console.log('Coordinate fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();