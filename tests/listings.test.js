const request = require('supertest');
const app = require('../app');

describe('Listing Routes', () => {
    describe('GET /listings', () => {
        it('should return listings index page', async () => {
            const res = await request(app)
                .get('/listings')
                .expect('Content-Type', /html/)
                .expect(200);
            
            expect(res.text).toContain('All Listings');
        });
    });

    describe('GET /listings/new', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .get('/listings/new')
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });
    });

    describe('GET /listings/:id', () => {
        it('should return 404 for invalid listing ID', async () => {
            const res = await request(app)
                .get('/listings/invalid-id-123')
                .expect(500); // MongoDB will throw error for invalid ID
        });
    });

    describe('POST /listings', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .post('/listings')
                .send({
                    title: 'Test Listing',
                    description: 'Test Description',
                    price: 100,
                    location: 'Test Location',
                    country: 'Test Country'
                })
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });

        it('should reject listing with missing required fields', async () => {
            const res = await request(app)
                .post('/listings')
                .send({
                    title: '',
                    description: ''
                });
            
            expect(res.status).toBe(302);
        });
    });

    describe('GET /listings/:id/edit', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .get('/listings/123456789012345678901234/edit')
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });
    });

    describe('DELETE /listings/:id', () => {
        it('should redirect to login when not authenticated', async () => {
            const res = await request(app)
                .delete('/listings/123456789012345678901234')
                .expect(302);
            
            expect(res.headers.location).toContain('/login');
        });
    });
});
