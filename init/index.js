const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68b03abbf434cdd259bd1032",
    geometry: {
      type: "Point",
      // Default coordinates (New York City)
      // Format: [longitude, latitude]
      coordinates: [-74.006, 40.7128],
    },
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
