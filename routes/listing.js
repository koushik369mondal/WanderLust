const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(listingsController.index));

// New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingsController.showListing));

// Create Route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingsController.createListing)
);

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm)
);

// Update Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingsController.updateListing)
);

// Delete Route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.deleteListing)
);

module.exports = router;
