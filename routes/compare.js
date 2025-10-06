const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// GET /listings/compare
router.get('/compare', async (req, res) => {
    try {
        console.log('Compare route accessed'); // Debug log
        const listingIds = req.query.ids ? req.query.ids.split(',') : [];
        
        if (listingIds.length < 2 || listingIds.length > 3) {
            req.flash('error', 'Please select 2-3 listings to compare.');
            return res.redirect('/listings');
        }

        const listings = await Listing.find({
            '_id': { $in: listingIds }
        }).populate('reviews');

        const processedListings = listings.map(listing => {
            const avgRating = listing.reviews.length > 0 
                ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
                : 0;

            return {
                ...listing.toObject(),
                avgRating: avgRating.toFixed(1),
                amenities: listing.amenities || [],
                priceWithTax: Math.round(listing.price * 1.18),
                reviewCount: listing.reviews.length
            };
        });

        res.render('listings/compare', { 
            listings: processedListings,
            title: 'Compare Listings'
        });
    } catch (error) {
        console.error('Comparison error:', error);
        req.flash('error', 'Error loading comparison page.');
        res.redirect('/listings');
    }
});

module.exports = router; // Make sure this line is present