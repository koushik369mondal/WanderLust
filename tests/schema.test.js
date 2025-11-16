const { listingSchema, reviewSchema } = require('../schema');

describe('Schema Validation', () => {
    describe('Listing Schema', () => {
        it('should validate a valid listing', () => {
            const validListing = {
                listing: {
                    title: 'Test Listing',
                    description: 'Test Description',
                    price: 100,
                    location: 'Test Location',
                    country: 'Test Country'
                }
            };

            const { error } = listingSchema.validate(validListing);
            expect(error).toBeUndefined();
        });

        it('should reject listing without title', () => {
            const invalidListing = {
                listing: {
                    description: 'Test',
                    price: 100,
                    location: 'Test',
                    country: 'Test'
                }
            };

            const { error } = listingSchema.validate(invalidListing);
            expect(error).toBeDefined();
        });

        it('should reject listing with negative price', () => {
            const invalidListing = {
                listing: {
                    title: 'Test',
                    description: 'Test',
                    price: -100,
                    location: 'Test',
                    country: 'Test'
                }
            };

            const { error } = listingSchema.validate(invalidListing);
            expect(error).toBeDefined();
        });

        it('should reject listing with empty description', () => {
            const invalidListing = {
                listing: {
                    title: 'Test',
                    description: '',
                    price: 100,
                    location: 'Test',
                    country: 'Test'
                }
            };

            const { error } = listingSchema.validate(invalidListing);
            expect(error).toBeDefined();
        });
    });

    describe('Review Schema', () => {
        it('should validate a valid review', () => {
            const validReview = {
                review: {
                    rating: 5,
                    comment: 'Great place!'
                }
            };

            const { error } = reviewSchema.validate(validReview);
            expect(error).toBeUndefined();
        });

        it('should reject review without rating', () => {
            const invalidReview = {
                review: {
                    comment: 'Test'
                }
            };

            const { error } = reviewSchema.validate(invalidReview);
            expect(error).toBeDefined();
        });

        it('should reject review with rating > 5', () => {
            const invalidReview = {
                review: {
                    rating: 6,
                    comment: 'Test'
                }
            };

            const { error } = reviewSchema.validate(invalidReview);
            expect(error).toBeDefined();
        });

        it('should reject review with rating < 1', () => {
            const invalidReview = {
                review: {
                    rating: 0,
                    comment: 'Test'
                }
            };

            const { error } = reviewSchema.validate(invalidReview);
            expect(error).toBeDefined();
        });

        it('should reject review without comment', () => {
            const invalidReview = {
                review: {
                    rating: 5
                }
            };

            const { error } = reviewSchema.validate(invalidReview);
            expect(error).toBeDefined();
        });
    });
});
