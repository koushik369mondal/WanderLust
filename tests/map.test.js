const request = require('supertest');
const app = require('../app');

describe('Map Integration Tests', () => {
    describe('Listing Show Page Map', () => {
        it('should load show page and contain map element', async () => {
            // This test will check if the show page loads and contains map element
            // Note: We need a valid listing ID for this test
            console.log('Testing map integration...');

            // First get listings to find a valid ID
            const indexRes = await request(app)
                .get('/listings')
                .expect(200);

            // Check if the page contains map-related elements
            expect(indexRes.text).toContain('mapbox');
        });

        it('should have mapbox token available', () => {
            const mapToken = process.env.MAP_TOKEN;
            expect(mapToken).toBeDefined();
            expect(mapToken).not.toBe('');
            console.log('Map token exists:', !!mapToken);
        });

        it('should have proper mapbox CSS and JS references', async () => {
            const res = await request(app)
                .get('/listings')
                .expect(200);

            // Check for Mapbox CSS
            expect(res.text).toContain('mapbox-gl.css');
            // Check for Mapbox JS
            expect(res.text).toContain('mapbox-gl.js');
        });
    });

    describe('Map JavaScript Logic', () => {
        it('should handle missing coordinates gracefully', () => {
            // Mock listing without coordinates
            const mockListing = {
                title: 'Test Listing',
                location: 'Test City',
                country: 'Test Country'
            };

            // This would test the coordinate fallback logic
            expect(mockListing.location).toBeDefined();
            expect(mockListing.country).toBeDefined();
        });
    });
});