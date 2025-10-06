const Listing = require("../models/listing");
const Review = require("../models/review");
const translate = require('google-translate-api-x');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save(); 
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);   
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
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
