const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// This API route is crucial for the advanced client-side filtering
// It points to the `filterListings` function from the controller provided earlier
router.get("/api/filter", wrapAsync(listingsController.filterListings));

// This route handles both displaying all listings and the initial search from the navbar
router
    .route("/")
    .get(wrapAsync(listingsController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing, // Added validation middleware for consistency
        wrapAsync(listingsController.createListing)
    );

// Preserving your search suggestions API
router.get("/search/suggestions", wrapAsync(listingsController.getSearchSuggestions));

// Preserving your about route
router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

// New Route - This must come BEFORE the /:id route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingsController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm)
);

// Preserving your like/unlike routes
router.post('/:id/like', isLoggedIn, wrapAsync(listingsController.likeListing));
router.post('/:id/unlike', isLoggedIn, wrapAsync(listingsController.unlikeListing));

module.exports = router;