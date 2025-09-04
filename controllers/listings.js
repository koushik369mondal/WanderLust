const Listing = require("../models/listing");
// Mapbox geocoding disabled for development
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let filter = {};
  
  // Add category filtering
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, activeCategory: req.query.category || null });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing, currentUser: req.user });
};

module.exports.createListing = async (req, res, next) => {
  // Geocoding disabled for development
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
