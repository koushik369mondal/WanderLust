const Review = require('../models/review');
const mongoose = require('mongoose');

describe('Review Model', () => {
    describe('Schema Validation', () => {
        it('should create a valid review', () => {
            const validReview = new Review({
                comment: 'Great place to stay!',
                rating: 5,
                author: new mongoose.Types.ObjectId()
            });

            const error = validReview.validateSync();
            expect(error).toBeUndefined();
        });

        it('should fail without comment', () => {
            const review = new Review({
                rating: 5,
                author: new mongoose.Types.ObjectId()
            });

            const error = review.validateSync();
            expect(error.errors.comment).toBeDefined();
        });

        it('should fail without rating', () => {
            const review = new Review({
                comment: 'Test comment',
                author: new mongoose.Types.ObjectId()
            });

            const error = review.validateSync();
            expect(error.errors.rating).toBeDefined();
        });

        it('should fail with rating less than 1', () => {
            const review = new Review({
                comment: 'Test',
                rating: 0,
                author: new mongoose.Types.ObjectId()
            });

            const error = review.validateSync();
            expect(error.errors.rating).toBeDefined();
        });

        it('should fail with rating greater than 5', () => {
            const review = new Review({
                comment: 'Test',
                rating: 6,
                author: new mongoose.Types.ObjectId()
            });

            const error = review.validateSync();
            expect(error.errors.rating).toBeDefined();
        });
    });
});
