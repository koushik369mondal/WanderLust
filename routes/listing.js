const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate("reviews")
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found!");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
    })
);

// Create Route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);

        // Set image object
        newListing.image = {
            url: req.body.listing.image || "",
            filename: "listingimage",
        };

        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect(`/listings`);
    })
);

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

// Update Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {

        // Destructure form data
        const listingData = { ...req.body.listing };

        // Update image object properly
        listingData.image = {
            url: req.body.listing.image || "",
            filename: "listingimage",
        };

        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, listingData);
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    })
);

module.exports = router;
