const Listing = require('../models/listing');
const mongoose = require('mongoose');

describe('Listing Model', () => {
    describe('Schema Validation', () => {
        it('should create a valid listing', () => {
            const validListing = new Listing({
                title: 'Beach House',
                description: 'Beautiful beach house with ocean view',
                image: { url: 'https://example.com/image.jpg', filename: 'image.jpg' },
                price: 200,
                location: 'Malibu',
                country: 'USA',
                owner: new mongoose.Types.ObjectId()
            });

            const error = validListing.validateSync();
            expect(error).toBeUndefined();
        });

        it('should fail without required title', () => {
            const listing = new Listing({
                description: 'Test description',
                price: 100,
                location: 'Test',
                country: 'Test'
            });

            const error = listing.validateSync();
            expect(error.errors.title).toBeDefined();
        });

        it('should fail without required description', () => {
            const listing = new Listing({
                title: 'Test Title',
                price: 100,
                location: 'Test',
                country: 'Test'
            });

            const error = listing.validateSync();
            expect(error.errors.description).toBeDefined();
        });

        it('should fail with negative price', () => {
            const listing = new Listing({
                title: 'Test',
                description: 'Test',
                price: -100,
                location: 'Test',
                country: 'Test'
            });

            const error = listing.validateSync();
            expect(error.errors.price).toBeDefined();
        });

        it('should set default image if not provided', () => {
            const listing = new Listing({
                title: 'Test',
                description: 'Test',
                price: 100,
                location: 'Test',
                country: 'Test'
            });

            expect(listing.image.url).toContain('default');
        });
    });
});
