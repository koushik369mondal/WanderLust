const request = require('supertest');
const app = require('../app');

describe('Middleware Tests', () => {
    describe('Error Handling Middleware', () => {
        it('should handle 404 errors', async () => {
            const res = await request(app)
                .get('/non-existent-route')
                .expect(404);

            expect(res.text).toContain('404');
        });
    });

    describe('Session Middleware', () => {
        it('should set session cookies', async () => {
            const res = await request(app)
                .get('/listings');

            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('Flash Messages', () => {
        it('should flash success messages', async () => {
            const agent = request.agent(app);

            // First request to set up session
            await agent.get('/listings');

            // Flash messages should work after session is established
            const res = await agent.get('/login');
            expect(res.status).toBe(200);
        });
    });

    describe('Security Headers', () => {
        it('should set security headers with Helmet', async () => {
            const res = await request(app)
                .get('/listings');

            expect(res.headers['x-content-type-options']).toBeDefined();
        });
    });

    describe('Method Override', () => {
        it('should support method override via query', async () => {
            const res = await request(app)
                .post('/listings/123456789012345678901234?_method=DELETE')
                .expect(302);
        });
    });
});
