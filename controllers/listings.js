const User = require("../models/user"); 

const Listing = require("../models/listing");
const SearchLog = require("../models/searchLog");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;





module.exports.index = async (req, res) => {
  const { 
    category, 
    search, 
    minPrice, 
    maxPrice, 
    minRating, 
    features, 
    location, 
    instantBook, 
    superhost,
    sort 
  } = req.query;
  
  const filter = {};
  let searchQuery = null;
  let sortOptions = {};

  // Category filtering
  if (category) {
    filter.category = category;
  }

  // Search functionality
  if (search && search.trim()) {
    searchQuery = search.trim();
    // Create a case-insensitive regex search across multiple fields
    const searchRegex = new RegExp(searchQuery, 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex },
      { country: searchRegex }
    ];
  }

  // Price range filtering
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice && !isNaN(minPrice)) {
      filter.price.$gte = parseInt(minPrice);
    }
    if (maxPrice && !isNaN(maxPrice)) {
      filter.price.$lte = parseInt(maxPrice);
    }
  }

  // Location filtering (additional to search)
  if (location && location.trim() && location !== searchQuery) {
    const locationRegex = new RegExp(location.trim(), 'i');
    if (filter.$or) {
      // If search already exists, add location as additional OR condition
      filter.$or.push(
        { location: locationRegex },
        { country: locationRegex }
      );
    } else {
      filter.$or = [
        { location: locationRegex },
        { country: locationRegex }
      ];
    }
  }

  // Features filtering (if we had features in the model)
  if (features) {
    const featureArray = Array.isArray(features) ? features : [features];
    // TODO: Replace simulation logic with proper feature schema filtering when implemented.
    // For now, we'll simulate feature filtering based on title/description
    // See issue tracker: https://github.com/your-org/your-repo/issues/123
    if (featureArray.length > 0) {
      const featureConditions = featureArray.map(feature => {
        const featureRegex = new RegExp(feature, 'i');
        return {
          $or: [
            { title: featureRegex },
            { description: featureRegex }
          ]
        };
      });
      
      if (filter.$and) {
        filter.$and.push(...featureConditions);
      } else {
        filter.$and = featureConditions;
      }
    }
  }

  // Sorting options
  switch (sort) {
    case 'price-low':
      sortOptions = { price: 1 };
      break;
    case 'price-high':
      sortOptions = { price: -1 };
      break;
    case 'rating':
      sortOptions = { avgRating: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    default:
      // Default relevance sort (newest first, then by title)
      sortOptions = { createdAt: -1, title: 1 };
  }

  // Populate reviews (with author) for avgRating calculation and apply sorting
  let query = Listing.find(filter)
    .populate({ path: 'reviews', populate: { path: 'author' } });
  
  // Apply sorting
  if (Object.keys(sortOptions).length > 0) {
    query = query.sort(sortOptions);
  }
  
  const allListings = await query;

  // Badge logic for each listing and rating filtering
  const filteredListings = [];
  
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

    // Apply rating filter after calculating avgRating
    if (minRating && !isNaN(minRating)) {
      const minRatingFloat = parseFloat(minRating);
      if (avgRating >= minRatingFloat) {
        filteredListings.push(listing);
      }
    } else {
      filteredListings.push(listing);
    }
  }

  // Use filtered listings for the final result
  const finalListings = filteredListings;

  // Log search queries for analytics (async, don't wait for completion)
  if (searchQuery) {
    SearchLog.create({
      query: searchQuery,
      resultsCount: finalListings.length,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      category: category || '',
      filters: {
        minPrice,
        maxPrice,
        minRating,
        features,
        location,
        sort
      }
    }).catch(err => {
      console.log('Search logging error:', err.message);
    });
  }

  // Check if this is an AJAX request for filtering
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    // Return JSON response for AJAX requests
    return res.json({
      listings: finalListings,
      totalResults: finalListings.length,
      hasSearch: !!searchQuery,
      appliedFilters: {
        category,
        minPrice,
        maxPrice,
        minRating,
        features,
        location,
        sort
      }
    });
  }

  res.render("listings/index.ejs", { 
    allListings: finalListings, 
    category: req.query.category,
    searchQuery: searchQuery,
    totalResults: finalListings.length,
    hasSearch: !!searchQuery,
    appliedFilters: {
      minPrice,
      maxPrice,
      minRating,
      features: Array.isArray(features) ? features : (features ? [features] : []),
      location,
      sort
    }
  });

};

// Get search suggestions based on popular searches
module.exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    // Get unique locations and countries that match the query
    const suggestions = await Listing.aggregate([
      {
        $match: {
          $or: [
            { location: { $regex: q, $options: 'i' } },
            { country: { $regex: q, $options: 'i' } },
            { title: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          locations: { $addToSet: "$location" },
          countries: { $addToSet: "$country" },
          titles: { $addToSet: "$title" }
        }
      }
    ]);

    let results = [];
    if (suggestions.length > 0) {
      const { locations, countries, titles } = suggestions[0];
      
      // Filter and format suggestions
      const locationSuggestions = locations
        .filter(loc => loc.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 3)
        .map(loc => ({ type: 'location', value: loc, icon: 'fa-map-marker-alt' }));
      
      const countrySuggestions = countries
        .filter(country => country.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 2)
        .map(country => ({ type: 'country', value: country, icon: 'fa-globe' }));
      
      const titleSuggestions = titles
        .filter(title => title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 2)
        .map(title => ({ type: 'property', value: title, icon: 'fa-home' }));
      
      results = [...locationSuggestions, ...countrySuggestions, ...titleSuggestions];
    }
    
    res.json(results.slice(0, 8));
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.json([]);
  }
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
    try {
      response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
    } catch (error) {
      console.warn("Geocoding failed:", error.message);
    }
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
    if (response && response.body.features && response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    } else {
      // Default coordinates based on country or use Delhi, India
      const countryDefaults = {
        'india': [77.2090, 28.6139],     // Delhi
        'usa': [-74.006, 40.7128],       // New York
        'uk': [-0.1276, 51.5074],        // London
        'france': [2.3522, 48.8566],     // Paris
        'germany': [13.4050, 52.5200],   // Berlin
        'japan': [139.6917, 35.6895],    // Tokyo
        'australia': [151.2093, -33.8688], // Sydney
      };
      
      const country = (req.body.listing.country || '').toLowerCase();
      const defaultCoords = countryDefaults[country] || [77.2090, 28.6139]; // Default to Delhi
      
      newListing.geometry = {
        type: "Point",
        coordinates: defaultCoords
      };
      
      console.log(`Using default coordinates for ${country}: ${defaultCoords}`);
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
      try {
        response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
          .send();
      } catch (error) {
        console.warn("Geocoding failed:", error.message);
      }
    }
    
    // First update the listing without saving to get the document
    let listing = await Listing.findById(id);
    
    // Update all fields from the form
    Object.assign(listing, req.body.listing);
    
    // Update geometry with new coordinates or use default
    if (response && response.body.features && response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry;
    } else {
      // Keep existing geometry or set default based on country
      if (!listing.geometry || !listing.geometry.coordinates) {
        const countryDefaults = {
          'india': [77.2090, 28.6139],     // Delhi
          'usa': [-74.006, 40.7128],       // New York
          'uk': [-0.1276, 51.5074],        // London
          'france': [2.3522, 48.8566],     // Paris
          'germany': [13.4050, 52.5200],   // Berlin
          'japan': [139.6917, 35.6895],    // Tokyo
          'australia': [151.2093, -33.8688], // Sydney
        };
        
        const country = (listing.country || '').toLowerCase();
        const defaultCoords = countryDefaults[country] || [77.2090, 28.6139];
        
        listing.geometry = {
          type: "Point",
          coordinates: defaultCoords
        };
        
        console.log(`Using default coordinates for ${country}: ${defaultCoords}`);
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