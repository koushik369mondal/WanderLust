const User = require("../models/user"); 

const Listing = require("../models/listing");
const SearchLog = require("../models/searchLog");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;





module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  let searchQuery = null;

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

  // Log search queries for analytics (async, don't wait for completion)
  if (searchQuery) {
    SearchLog.create({
      query: searchQuery,
      resultsCount: allListings.length,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      category: category || ''
    }).catch(err => {
      console.log('Search logging error:', err.message);
    });
  }

  res.render("listings/index.ejs", { 
    allListings, 
    category: req.query.category,
    searchQuery: searchQuery,
    totalResults: allListings.length,
    hasSearch: !!searchQuery
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


    if (!listing) {
      console.log(" Listing not found in database");
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Check if listing is in user's wishlist
    let isInWishlist = false;
    if (req.user) {
      const Wishlist = require('../models/wishlist');
      const wishlistItem = await Wishlist.findOne({
        user: req.user._id,
        listing: id
      });
      isInWishlist = !!wishlistItem;
    }


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

    // AI Recommendations - "You may also like"
    let recommendations = [];
    try {
      // Create a unique seed based on listing ID for consistent but different results
      const listingSeed = parseInt(id.slice(-6), 16) % 1000;
      
      if (req.user) {
        // Get user's review history for personalized recommendations
        const Review = require('../models/review');
        const userReviews = await Review.find({ author: req.user._id })
          .populate('listing', 'category country')
          .limit(10);
        
        if (userReviews.length > 0) {
          const userCategories = [...new Set(userReviews.map(r => r.listing?.category).filter(Boolean))];
          const userCountries = [...new Set(userReviews.map(r => r.listing?.country).filter(Boolean))];
          
          // Add randomization based on listing ID
          const categoryQuery = userCategories.length > 0 ? 
            { category: { $in: userCategories } } : 
            { category: listing.category };
          
          recommendations = await Listing.aggregate([
            { $match: { _id: { $ne: listing._id }, ...categoryQuery } },
            { $sample: { size: 2 } }
          ]);
          
          if (recommendations.length < 2 && userCountries.length > 0) {
            const countryRecs = await Listing.aggregate([
              { $match: { _id: { $ne: listing._id }, country: { $in: userCountries } } },
              { $sample: { size: 2 - recommendations.length } }
            ]);
            recommendations = [...recommendations, ...countryRecs];
          }
        }
      }
      
      // Smart fallback based on current listing attributes
      if (recommendations.length < 4) {
        // Mix of similar category and country with randomization
        const similarCategory = await Listing.aggregate([
          { $match: { _id: { $ne: listing._id }, category: listing.category } },
          { $sample: { size: Math.min(2, 4 - recommendations.length) } }
        ]);
        recommendations = [...recommendations, ...similarCategory];
        
        if (recommendations.length < 4) {
          const similarCountry = await Listing.aggregate([
            { $match: { _id: { $ne: listing._id }, country: listing.country, category: { $ne: listing.category } } },
            { $sample: { size: 4 - recommendations.length } }
          ]);
          recommendations = [...recommendations, ...similarCountry];
        }
      }
      
      // Final diverse fallback
      if (recommendations.length < 4) {
        const diverse = await Listing.aggregate([
          { $match: { _id: { $ne: listing._id } } },
          { $sample: { size: 4 - recommendations.length } }
        ]);
        recommendations = [...recommendations, ...diverse];
      }
      
      // Remove duplicates and limit to 4
      const uniqueRecs = recommendations.filter((rec, index, self) => 
        index === self.findIndex(r => r._id.toString() === rec._id.toString())
      ).slice(0, 4);
      
      recommendations = uniqueRecs;
    } catch (recError) {
      console.log('Recommendation error:', recError.message);
    }
    
    console.log("Found listing:", listing.title);
    console.log("About to render template...");
    
    // Check if template file exists
    const path = require('path');
    const templatePath = path.join(__dirname, '../views/listings/show.ejs');
    console.log("Template path:", templatePath);
    
    // Add error handling for template rendering main
    res.render("listings/show.ejs", { listing, currentUser: req.user, isInWishlist, recommendations }, (err, html) => {

   
      if (err) {
        console.error(" TEMPLATE RENDERING ERROR:");
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Template path:", templatePath);
        return next(err);
      }
      console.log("Template rendered successfully, sending   response");
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