const User = require("../models/user");
const Listing = require("../models/listing");
const SearchLog = require("../models/searchLog");
const Wishlist = require('../models/wishlist');
const Review = require('../models/review');

// Utility imports
const phrases = require('../utils/phrases');

// Service imports
const aiSummarizationService = require('../services/aiSummarizationService');
const weatherService = require('../services/weatherService');

// Mapbox SDK
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

// Country default coordinates mapping
const COUNTRY_COORDINATES = {
  'india': [77.2090, 28.6139],
  'united states': [-95.7129, 37.0902],
  'usa': [-95.7129, 37.0902],
  'italy': [12.5674, 41.8719],
  'mexico': [-102.5528, 23.6345],
  'switzerland': [8.2275, 46.8182],
  'tanzania': [34.8888, -6.3690],
  'netherlands': [5.2913, 52.1326],
  'fiji': [179.4144, -16.5780],
  'united kingdom': [-3.4360, 55.3781],
  'uk': [-3.4360, 55.3781],
  'indonesia': [113.9213, -0.7893],
  'canada': [-106.3468, 56.1304],
  'thailand': [100.9925, 15.8700],
  'united arab emirates': [53.8478, 23.4241],
  'uae': [53.8478, 23.4241],
  'greece': [21.8243, 39.0742],
  'costa rica': [-83.7534, 9.7489],
  'japan': [138.2529, 36.2048],
  'maldives': [73.2207, 3.2028],
  'france': [2.2137, 46.2276],
  'spain': [-3.7492, 40.4637],
  'australia': [133.7751, -25.2744],
  'brazil': [-47.8825, -15.7942],
  'china': [104.1954, 35.8617]
};

// Helper function to get default coordinates
const getDefaultCoordinates = (country) => {
  const countryLower = (country || '').toLowerCase().trim();
  return COUNTRY_COORDINATES[countryLower] || [77.2090, 28.6139]; // Default to India
};

// Helper function to add badges to listings
const addBadgesToListing = (listing, avgRating = null) => {
  const now = new Date();
  const createdAt = new Date(listing.createdAt);
  const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);

  listing.isNewBadge = daysOld <= 7;
  listing.isFeaturedBadge = !!listing.isFeatured;
  listing.isDiscountBadge = !!listing.hasDiscount;

  // Calculate average rating if not provided
  if (avgRating === null && listing.reviews && listing.reviews.length > 0) {
    const total = listing.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    avgRating = total / listing.reviews.length;
  }

  listing.avgRating = avgRating || 0;
  listing.isHighlyRatedBadge = listing.reviews && listing.reviews.length > 0 && avgRating >= 4.5;

  return listing;
};

// Helper function to geocode location
const geocodeLocation = async (location) => {
  if (!geocodingClient) {
    return null;
  }

  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();

    if (response && response.body.features && response.body.features.length > 0) {
      return response.body.features[0].geometry;
    }
  } catch (error) {
    console.warn(`Geocoding failed for "${location}":`, error.message);
  }

  return null;
};

// ===========================
// MAIN CONTROLLER METHODS
// ===========================

/**
 * Display all listings with optional category and search filters
 */
module.exports.index = async (req, res, next) => {
  try {
    const { category, search, q } = req.query;
    const filter = {};
    let searchQuery = null;

    // Category filtering
    if (category) {
      filter.category = category;
    }

    // Search functionality - handle both 'search' and 'q' parameters
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      searchQuery = searchTerm.trim();
      const searchRegex = new RegExp(searchQuery, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { country: searchRegex }
      ];
    }

    // Fetch listings with populated reviews
    const allListings = await Listing.find(filter)
      .populate({ path: 'reviews', populate: { path: 'author' } })
      .lean();

    // Add badges to each listing
    allListings.forEach(listing => {
      addBadgesToListing(listing);
    });

    // Log search queries asynchronously (don't wait)
    if (searchQuery) {
      SearchLog.create({
        query: searchQuery,
        resultsCount: allListings.length,
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
        category: category || ''
      }).catch(err => {
        console.error('Search logging error:', err.message);
      });
    }

    res.render("listings/index.ejs", {
      allListings,
      category: req.query.category,
      searchQuery,
      totalResults: allListings.length,
      hasSearch: !!searchQuery,
      noResults: searchQuery && allListings.length === 0
    });
  } catch (error) {
    console.error('Error in index controller:', error);
    next(error);
  }
};

/**
 * Get search suggestions for autocomplete
 */
module.exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Optimized aggregation with early $match and $limit
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
        $limit: 50 // Limit early to reduce processing
      },
      {
        $group: {
          _id: null,
          locations: { $addToSet: "$location" },
          countries: { $addToSet: "$country" },
          titles: { $addToSet: "$title" }
        }
      },
      {
        $project: {
          _id: 0,
          locations: 1,
          countries: 1,
          titles: 1
        }
      }
    ]);

    let results = [];
    if (suggestions.length > 0) {
      const { locations = [], countries = [], titles = [] } = suggestions[0];
      const qLower = q.toLowerCase();

      // Filter and format suggestions efficiently
      const locationSuggestions = locations
        .filter(loc => loc && loc.toLowerCase().includes(qLower))
        .slice(0, 3)
        .map(loc => ({ type: 'location', value: loc, icon: 'fa-map-marker-alt' }));

      const countrySuggestions = countries
        .filter(country => country && country.toLowerCase().includes(qLower))
        .slice(0, 2)
        .map(country => ({ type: 'country', value: country, icon: 'fa-globe' }));

      const titleSuggestions = titles
        .filter(title => title && title.toLowerCase().includes(qLower))
        .slice(0, 2)
        .map(title => ({ type: 'property', value: title, icon: 'fa-home' }));

      results = [...locationSuggestions, ...countrySuggestions, ...titleSuggestions].slice(0, 8);
    }

    res.json(results);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json([]);
  }
};

/**
 * Advanced filtering with MongoDB aggregation
 */
module.exports.getFilteredListings = async (req, res, next) => {
  try {
    // Handle countries request
    if (req.query.getCountries) {
      const countries = await Listing.distinct('country');
      return res.json({ success: true, countries: countries.filter(Boolean).sort() });
    }

    const {
      search,
      category,
      country,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      page = 1,
      limit = 12
    } = req.query;

    // Build optimized aggregation pipeline
    const pipeline = [];

    // Stage 1: Match - filter early for performance
    const matchStage = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      matchStage.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { country: searchRegex }
      ];
    }

    if (category) matchStage.category = category;
    if (country) matchStage.country = country;

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = parseInt(minPrice);
      if (maxPrice) matchStage.price.$lte = parseInt(maxPrice);
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Stage 2: Lookup reviews
    pipeline.push({
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'listing',
        as: 'reviews'
      }
    });

    // Stage 3: Add computed fields
    pipeline.push({
      $addFields: {
        reviewCount: { $size: '$reviews' },
        avgRating: {
          $cond: {
            if: { $gt: [{ $size: '$reviews' }, 0] },
            then: { $avg: '$reviews.rating' },
            else: 0
          }
        },
        popularity: {
          $add: [
            { $size: '$reviews' },
            { $cond: { if: { $isArray: '$likes' }, then: { $size: '$likes' }, else: 0 } }
          ]
        }
      }
    });

    // Stage 4: Filter by minimum rating
    if (minRating) {
      pipeline.push({
        $match: { avgRating: { $gte: parseFloat(minRating) } }
      });
    }

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Listing.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Stage 5: Sorting
    const sortStage = {
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'rating': { avgRating: -1, reviewCount: -1 },
      'popularity': { popularity: -1, avgRating: -1 },
      'newest': { createdAt: -1 }
    }[sortBy] || { createdAt: -1 };

    pipeline.push({ $sort: sortStage });

    // Stage 6: Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Execute aggregation
    const listings = await Listing.aggregate(pipeline);

    // Add badges to listings
    const now = new Date();
    listings.forEach(listing => {
      const createdAt = new Date(listing.createdAt);
      const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);

      listing.isNewBadge = daysOld <= 7;
      listing.isFeaturedBadge = !!listing.isFeatured;
      listing.isDiscountBadge = !!listing.hasDiscount;
      listing.isHighlyRatedBadge = listing.avgRating >= 4.5 && listing.reviewCount > 0;
    });

    res.json({
      success: true,
      listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      },
      filters: { search, category, country, minPrice, maxPrice, minRating, sortBy }
    });
  } catch (error) {
    console.error('Filter listings error:', error);
    res.status(500).json({ success: false, error: 'Failed to filter listings' });
  }
};

/**
 * Render new listing form
 */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/**
 * Show individual listing details
 */
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('❌ Invalid ObjectId format:', id);
      req.flash("error", "Invalid listing ID format! Please clear your browser cache.");
      return res.redirect("/listings");
    }

    // Fetch listing with populated data
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner")
      .lean();

    if (!listing) {
      console.error('❌ Listing not found:', id);
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Check if listing is in user's wishlist
    let isInWishlist = false;
    if (req.user) {
      const wishlistItem = await Wishlist.findOne({
        user: req.user._id,
        listing: id
      });
      isInWishlist = !!wishlistItem;
    }

    // Add badges to listing
    addBadgesToListing(listing);

    // Generate or retrieve AI summary
    let aiSummary = listing.aiSummary;
    if (aiSummarizationService.needsUpdate(listing.aiSummaryLastUpdated, listing.reviews.length)) {
      try {
        aiSummary = await aiSummarizationService.generateSummary(listing.reviews, listing.title);

        // Update the document (need to convert from lean)
        await Listing.findByIdAndUpdate(id, {
          aiSummary,
          aiSummaryLastUpdated: new Date()
        });

        console.log('✅ AI summary generated for:', listing.title);
      } catch (error) {
        console.error('AI summary generation failed:', error.message);
        aiSummary = listing.aiSummary || null;
      }
    }

    // Get weather data
    let weatherData = null;
    let forecast = null;
    let bestTimeToVisit = null;

    if (listing.geometry?.coordinates) {
      const [lon, lat] = listing.geometry.coordinates;
      try {
        [weatherData, forecast] = await Promise.all([
          weatherService.getCurrentWeather(lat, lon),
          weatherService.getForecast(lat, lon)
        ]);
        bestTimeToVisit = weatherService.getBestTimeToVisit(listing.location, listing.country);
      } catch (error) {
        console.error('Weather service error:', error.message);
      }
    }

    // Get personalized recommendations
    const recommendations = await getRecommendations(listing, req.user);

    // Render the listing page
    res.render("listings/show.ejs", {
      listing,
      currentUser: req.user,
      isInWishlist,
      recommendations,
      weatherData,
      forecast,
      bestTimeToVisit,
      phrases
    });
  } catch (error) {
    console.error('❌ Error in showListing:', error);
    next(error);
  }
};

/**
 * Helper function to get personalized recommendations
 */
const getRecommendations = async (listing, user) => {
  let recommendations = [];

  try {
    if (user) {
      // Get user's review history for personalized recommendations
      const userReviews = await Review.find({ author: user._id })
        .populate('listing', 'category country')
        .limit(10)
        .lean();

      if (userReviews.length > 0) {
        const userCategories = [...new Set(userReviews.map(r => r.listing?.category).filter(Boolean))];
        const userCountries = [...new Set(userReviews.map(r => r.listing?.country).filter(Boolean))];

        // Category-based recommendations
        if (userCategories.length > 0) {
          recommendations = await Listing.aggregate([
            { $match: { _id: { $ne: listing._id }, category: { $in: userCategories } } },
            { $sample: { size: 2 } }
          ]);
        }

        // Country-based recommendations
        if (recommendations.length < 2 && userCountries.length > 0) {
          const countryRecs = await Listing.aggregate([
            { $match: { _id: { $ne: listing._id }, country: { $in: userCountries } } },
            { $sample: { size: 2 - recommendations.length } }
          ]);
          recommendations = [...recommendations, ...countryRecs];
        }
      }
    }

    // Fallback: Similar category
    if (recommendations.length < 4) {
      const similarCategory = await Listing.aggregate([
        { $match: { _id: { $ne: listing._id }, category: listing.category } },
        { $sample: { size: Math.min(2, 4 - recommendations.length) } }
      ]);
      recommendations = [...recommendations, ...similarCategory];
    }

    // Fallback: Similar country
    if (recommendations.length < 4) {
      const similarCountry = await Listing.aggregate([
        { $match: { _id: { $ne: listing._id }, country: listing.country, category: { $ne: listing.category } } },
        { $sample: { size: 4 - recommendations.length } }
      ]);
      recommendations = [...recommendations, ...similarCountry];
    }

    // Final fallback: Random diverse listings
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

    return uniqueRecs;
  } catch (error) {
    console.error('Recommendation error:', error.message);
    return [];
  }
};

/**
 * Create new listing
 */
module.exports.createListing = async (req, res, next) => {
  try {
    const { listing } = req.body;

    // Validate required fields
    if (!listing || !listing.title || !listing.location) {
      req.flash("error", "Missing required fields!");
      return res.redirect("/listings/new");
    }

    // Geocode the location
    const geometry = await geocodeLocation(listing.location);

    // Create new listing
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;

    // Set image if uploaded
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // Set geometry from geocoding or use default
    if (geometry) {
      newListing.geometry = geometry;
      console.log(`✅ Geocoded ${listing.location}:`, geometry.coordinates);
    } else {
      const defaultCoords = getDefaultCoordinates(listing.country);
      newListing.geometry = {
        type: "Point",
        coordinates: defaultCoords
      };
      console.log(`ℹ️ Using default coordinates for ${listing.country}:`, defaultCoords);
    }

    await newListing.save();

    console.log('✅ Created new listing:', newListing.title);
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

/**
 * Render edit form
 */
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).lean();

    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }

    // Generate thumbnail URL
    let originalImageURL = listing.image?.url || '';
    if (originalImageURL) {
      originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageURL });
  } catch (error) {
    console.error("❌ Error rendering edit form:", error);
    next(error);
  }
};

/**
 * Update listing
 */
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { listing: listingData } = req.body;

    // Validate listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Update fields
    Object.assign(listing, listingData);

    // Update image if new one uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // Update geometry if location changed
    if (listingData.location !== listing.location) {
      const geometry = await geocodeLocation(listingData.location);

      if (geometry) {
        listing.geometry = geometry;
        console.log(`✅ Updated coordinates for ${listingData.location}`);
      } else if (!listing.geometry?.coordinates) {
        const defaultCoords = getDefaultCoordinates(listingData.country);
        listing.geometry = {
          type: "Point",
          coordinates: defaultCoords
        };
        console.log(`ℹ️ Using default coordinates for ${listingData.country}`);
      }
    }

    await listing.save();

    console.log('✅ Updated listing:', listing.title);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

/**
 * Delete listing
 */
module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    console.log('✅ Deleted listing:', deletedListing.title);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    next(error);
  }
};

/**
 * Like a listing
 */
module.exports.likeListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Use atomic operations for better performance
    const listing = await Listing.findById(id);
    const user = await User.findById(userId);

    if (!listing || !user) {
      req.flash("error", "Listing or user not found!");
      return res.redirect("/listings");
    }

    // Check if already liked
    if (listing.likes.includes(userId)) {
      req.flash("info", "You already liked this listing!");
      return res.redirect(`/listings/${id}`);
    }

    // Add to both arrays atomically
    await Promise.all([
      Listing.findByIdAndUpdate(id, { $addToSet: { likes: userId } }),
      User.findByIdAndUpdate(userId, { $addToSet: { likes: id } })
    ]);

    req.flash("success", "Added to your liked listings!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("❌ Error liking listing:", error);
    next(error);
  }
};

/**
 * Unlike a listing
 */
module.exports.unlikeListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Remove from both arrays atomically
    await Promise.all([
      Listing.findByIdAndUpdate(id, { $pull: { likes: userId } }),
      User.findByIdAndUpdate(userId, { $pull: { likes: id } })
    ]);

    req.flash("success", "Removed from your liked listings!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("❌ Error unliking listing:", error);
    next(error);
  }
};
