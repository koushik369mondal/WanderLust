const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { updateListingCoordinates } = require("../utils/updateCoordinates.js");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

const MONGO_URL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68b03abbf434cdd259bd1032",
    // Don't set default coordinates here - let updateListingCoordinates handle it
  }));
  await Listing.insertMany(initData.data);
  console.log("✅ Sample data initialized");
  
  // Now update all listings with proper coordinates
  console.log("🗺️ Updating listing coordinates...");
  await updateListingCoordinates();
  console.log("✅ All coordinates updated!");
};

initDB();
