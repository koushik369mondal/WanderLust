const request = require('supertest');
const app = require('../app');

describe('Authentication Routes', () => {
    describe('GET /signup', () => {
        it('should render signup page', async () => {
            const res = await request(app)
                .get('/signup')
                .expect('Content-Type', /html/)
                .expect(200);

            expect(res.text).toContain('Sign Up');
        });
    });

    describe('GET /login', () => {
        it('should render login page', async () => {
            const res = await request(app)
                .get('/login')
                .expect('Content-Type', /html/)
                .expect(200);

            expect(res.text).toContain('Login');
        });
    });

    describe('POST /signup', () => {
        it('should reject signup with missing fields', async () => {
            const res = await request(app)
                .post('/signup')
                .send({
                    username: '',
                    email: '',
                    password: ''
                });

            expect(res.status).toBe(302); // Redirect on validation error
        });

        it('should reject signup with invalid email', async () => {
            const res = await request(app)
                .post('/signup')
                .send({
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(res.status).toBe(302);
        });
    });

    describe('POST /login', () => {
        it('should reject login with invalid credentials', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    username: 'nonexistent',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(302); // Redirect on failed login
        });
    });

    describe('GET /logout', () => {
        it('should logout user and redirect', async () => {
            const res = await request(app)
                .get('/logout')
                .expect(302);

            expect(res.headers.location).toBe('/listings');
        });
    });
});
