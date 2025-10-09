const Listing = require("../models/listing");
const Review = require("../models/review");
const aiSummarizationService = require("../services/aiSummarizationService");
const translate = require('google-translate-api-x');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate('owner');
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    // Send notification to listing owner (if not reviewing own listing)
    if (listing.owner._id.toString() !== req.user._id.toString()) {
        try {
            const NotificationService = require("../services/notificationService");
            const notificationService = new NotificationService(global.io);
            await notificationService.createNewReviewNotification(
                listing.owner._id,
                req.user._id,
                listing._id,
                newReview._id
            );
        } catch (notificationError) {
            console.error('Error sending review notification:', notificationError);
        }
    }
    

    // Regenerate AI summary after adding review
    try {
      const populatedListing = await Listing.findById(req.params.id).populate({
        path: "reviews",
        populate: { path: "author" },
      });
      const newSummary = await aiSummarizationService.generateSummary(populatedListing.reviews, populatedListing.title);
      await Listing.findByIdAndUpdate(req.params.id, {
        aiSummary: newSummary,
        aiSummaryLastUpdated: new Date()
      });
      console.log('AI summary updated after adding review');
    } catch (error) {
      console.log('AI summary update failed after adding review:', error.message);
    }

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // Regenerate AI summary after removing review
    try {
      const populatedListing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
      });
      const newSummary = await aiSummarizationService.generateSummary(populatedListing.reviews, populatedListing.title);
      await Listing.findByIdAndUpdate(id, {
        aiSummary: newSummary,
        aiSummaryLastUpdated: new Date()
      });
      console.log('AI summary updated after removing review');
    } catch (error) {
      console.log('AI summary update failed after removing review:', error.message);
    }

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};
