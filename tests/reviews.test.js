const request = require('supertest');
const app = require('../app');

describe('Review Routes', () => {
    describe('POST /listings/:id/reviews', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .post('/listings/123456789012345678901234/reviews')
                .send({
                    rating: 5,
                    comment: 'Great place!'
                })
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });

        it('should reject review with invalid rating', async () => {
            const res = await request(app)
                .post('/listings/123456789012345678901234/reviews')
                .send({
                    rating: 6, // Invalid rating (should be 1-5)
                    comment: 'Test comment'
                });
            
            expect(res.status).toBe(302);
        });

        it('should reject review with missing comment', async () => {
            const res = await request(app)
                .post('/listings/123456789012345678901234/reviews')
                .send({
                    rating: 5,
                    comment: ''
                });
            
            expect(res.status).toBe(302);
        });
    });

    describe('DELETE /listings/:id/reviews/:reviewId', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .delete('/listings/123456789012345678901234/reviews/123456789012345678901234')
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });
    });
});
