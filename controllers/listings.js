const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
  const { category } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);
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
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
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

    newListing.geometry = response.body.features[0].geometry;

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
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    
    // First update the listing without saving to get the document
    let listing = await Listing.findById(id);
    
    // Update all fields from the form
    Object.assign(listing, req.body.listing);
    
    // Update geometry with new coordinates
    listing.geometry = response.body.features[0].geometry;
    
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
// Like a listing
module.exports.likeListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing.likes.includes(req.user._id)) {
    listing.likes.push(req.user._id);
    await listing.save();
  }
  res.redirect(`/listings/${req.params.id}`);
};

// Unlike a listing
module.exports.unlikeListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  listing.likes = listing.likes.filter(
    (userId) => userId.toString() !== req.user._id.toString()
  );
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
};
