const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  // BADGE FIELDS
  isFeatured: { type: Boolean, default: false },
  hasDiscount: { type: Boolean, default: false },
  avgRating: { type: Number, default: 0 },
  hasFeaturedReview: { type: Boolean, default: false },
  discountPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },

  category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing pool', 'Camping', 'Farms', 'Arctic','Domes','Boats'], // This ensures only these values are accepted
  },
  bestSeason: {
    type: String,
  },
  travelTip: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  // category: {
  //     type: String,
  //     enum: [
  //         "mountains",
  //         "arctic",
  //         "farms",
  //         "deserts",
  //     ]
  // }
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
