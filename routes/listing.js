

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingsController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingsController.createListing)
    );

// Search suggestions API
router.get("/search/suggestions", wrapAsync(listingsController.getSearchSuggestions));

// New Route - This must come BEFORE the /:id route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router.get("/search", wrapAsync(listingsController.searchListings));


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

// Like/Unlike routes
router.post('/:id/like', isLoggedIn, wrapAsync(listingsController.likeListing));
router.post('/:id/unlike', isLoggedIn, wrapAsync(listingsController.unlikeListing));

module.exports = router;
