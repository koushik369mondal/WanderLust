const Listing = require("../models/listing");
const Review = require("../models/review");
const aiSummarizationService = require("../services/aiSummarizationService");
const translate = require('google-translate-api-x');

// Helper function to update ratings and AI summary in one go
const updateListingDetails = async (listingId) => {
    try {
        const listing = await Listing.findById(listingId).populate({
            path: "reviews",
            populate: { path: "author" }, // Populate author for AI summary context
        });

        if (!listing) return;

        // 1. Calculate Average Rating and Review Count
        if (listing.reviews.length > 0) {
            const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
            listing.avgRating = parseFloat((totalRating / listing.reviews.length).toFixed(2));
            listing.reviewCount = listing.reviews.length;
        } else {
            listing.avgRating = 0;
            listing.reviewCount = 0;
        }

        // 2. Regenerate AI Summary
        const newSummary = await aiSummarizationService.generateSummary(listing.reviews, listing.title);
        listing.aiSummary = newSummary;
        listing.aiSummaryLastUpdated = new Date();

        // 3. Save all changes
        await listing.save();
        console.log(`Successfully updated details for listing: ${listingId}`);

    } catch (error) {
        console.error(`Failed to update listing details for ${listingId}:`, error.message);
    }
};

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save(); // Save the initial review link first

    // Call the helper to update ratings and summary
    await updateListingDetails(req.params.id);

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // Call the helper to update ratings and summary
    await updateListingDetails(id);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};

module.exports.translateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId); 
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const targetLang = req.getLocale();
        if (targetLang === 'en') {
            return res.json({ translatedText: review.comment });
        }

        const result = await translate(review.comment, { to: targetLang });
        res.json({ translatedText: result.text });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
};