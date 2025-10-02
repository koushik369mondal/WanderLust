const User = require("../models/user"); 

const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

// Temporary fix for development - only initialize if valid token
let geocodingClient = null;
if (mapToken && mapToken.startsWith('pk.') && mapToken.length > 50) {
  geocodingClient = mbxGeocoding({ accessToken: mapToken });
}


module.exports.index = async (req, res) => {
  const { category } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  // Populate reviews (with author) for avgRating calculation
  const allListings = await Listing.find(filter)
    .populate({ path: 'reviews', populate: { path: 'author' } });

  // Badge logic for each listing
  for (const listing of allListings) {
    // 1️⃣ New Badge: createdAt within last 7 days
    const now = new Date();
    const createdAt = new Date(listing.createdAt);
    const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);
    listing.isNewBadge = daysOld <= 7;

    // 2️⃣ Featured Badge: isFeatured
    listing.isFeaturedBadge = !!listing.isFeatured;

    // 3️⃣ Discount Badge: hasDiscount
    listing.isDiscountBadge = !!listing.hasDiscount;

    // 4️⃣ Highly Rated Badge: avgRating from reviews
    let avgRating = 0;
    if (listing.reviews && listing.reviews.length > 0) {
      const total = listing.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      avgRating = total / listing.reviews.length;
    }
    listing.avgRating = avgRating;
    // Only show badge if avgRating >= 4.5 and has at least one review
    listing.isHighlyRatedBadge = (listing.reviews && listing.reviews.length > 0 && avgRating >= 4.5);
  }

  res.render("listings/index.ejs", { allListings, category: req.query.category });

};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};



module.exports.showListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    console.log("=== SHOW LISTING DEBUG ===");
    console.log("Looking for listing with ID:", id);
    console.log("Request URL:", req.url);
    console.log("Request method:", req.method);
    
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    // Badge logic for show page
    const now = new Date();
    const createdAt = new Date(listing.createdAt);
    const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);
    listing.isNewBadge = daysOld <= 7;
    listing.isFeaturedBadge = !!listing.isFeatured;
    listing.isDiscountBadge = !!listing.hasDiscount;
    let avgRating = 0;
    if (listing.reviews && listing.reviews.length > 0) {
      const total = listing.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      avgRating = total / listing.reviews.length;
    }
    listing.avgRating = avgRating;
    listing.isHighlyRatedBadge = avgRating >= 4.5;
      
    if (!listing) {
      console.log(" Listing not found in database");
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    
    console.log("Found listing:", listing.title);
    console.log("About to render template...");
    
    // Check if template file exists
    const path = require('path');
    const templatePath = path.join(__dirname, '../views/listings/show.ejs');
    console.log("Template path:", templatePath);
    
    // Add error handling for template rendering
    res.render("listings/show.ejs", { listing, currentUser: req.user }, (err, html) => {
      if (err) {
        console.error(" TEMPLATE RENDERING ERROR:");
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Template path:", templatePath);
        return next(err);
      }
      console.log("Template rendered successfully, sending response");
      res.send(html);
    });
    
  } catch (error) {
    console.error("ERROR in showListing:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    next(error);
  }
};


module.exports.createListing = async (req, res, next) => {
  let response = null;
  if (geocodingClient) {
    response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
  }
  try {

    let url = "";
    let filename = "";
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Set geometry from geocoding or use default coordinates
    if (response && response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    } else {
      // Default coordinates (New York City) for development
      newListing.geometry = {
        type: "Point",
        coordinates: [-74.006, 40.7128]
      };
    }

    let savedListings = await newListing.save();
    console.log(savedListings);
    req.flash("success", "New listing created!");
    res.redirect(`/listings`);
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }

  let originalImageURL = listing.image.url;
  originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageURL });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  try {
    // Get geocoding data for the updated location
    let response = null;
    if (geocodingClient) {
      response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
    }
    
    // First update the listing without saving to get the document
    let listing = await Listing.findById(id);
    
    // Update all fields from the form
    Object.assign(listing, req.body.listing);
    
    // Update geometry with new coordinates or use default
    if (response && response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry;
    } else {
      // Keep existing geometry or set default
      if (!listing.geometry) {
        listing.geometry = {
          type: "Point",
          coordinates: [-74.006, 40.7128]
        };
      }
    }
    
    // Update image if a new one was uploaded
    if (typeof req.file !== "undefined") {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }
    
    // Save the updated listing
    await listing.save();
    
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};



module.exports.likeListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(req.user._id);

    // Add user to listing's likes AND listing to user's likes
    if (!listing.likes.includes(user._id)) {
        listing.likes.push(user._id);
        user.likes.push(listing._id);

        await listing.save();
        await user.save();
        req.flash("success", "Added to your liked listings!");
    }
    res.redirect(`/listings/${req.params.id}`);
};


module.exports.unlikeListing = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    // Remove user ID from the listing's likes array
    await Listing.findByIdAndUpdate(id, { $pull: { likes: userId } });
    // Remove listing ID from the user's likes array
    await User.findByIdAndUpdate(userId, { $pull: { likes: id } });
    
    req.flash("success", "Removed from your liked listings.");
    res.redirect(`/listings/${id}`);
};

module.exports.searchListings = async (req, res) => {
    const { q } = req.query; //by query params
    let allListings = [];
    let noResults = false;

    if (q) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } }
            ]
        });
        if(allListings.length === 0) {
            noResults = true;
        }
    }
//rendering on idnex pg only
    res.render("listings/index.ejs", { allListings, category: null, searchQuery: q, noResults });
};