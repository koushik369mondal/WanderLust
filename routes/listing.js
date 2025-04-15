const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingsController.index))
    // .post(
    //     isLoggedIn,
    //     validateListing,
    //     wrapAsync(listingsController.createListing)
    // );
    .post((req, res) => {
        res.send(req.body);
    })

// New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(
        isLoggedIn,
        isOwner,
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

module.exports = router;
