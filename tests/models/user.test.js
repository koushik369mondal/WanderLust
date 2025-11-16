const User = require('../models/user');

describe('User Model', () => {
    describe('Schema Validation', () => {
        it('should create a valid user', () => {
            const validUser = new User({
                email: 'test@example.com',
                username: 'testuser'
            });

            const error = validUser.validateSync();
            expect(error).toBeUndefined();
        });

        it('should fail without email', () => {
            const user = new User({
                username: 'testuser'
            });

            const error = user.validateSync();
            expect(error.errors.email).toBeDefined();
        });

        it('should fail without username', () => {
            const user = new User({
                email: 'test@example.com'
            });

            const error = user.validateSync();
            expect(error.errors.username).toBeDefined();
        });

        it('should fail with invalid email format', () => {
            const user = new User({
                email: 'invalid-email',
                username: 'testuser'
            });

            const error = user.validateSync();
            expect(error.errors.email).toBeDefined();
        });

        it('should have default role as user', () => {
            const user = new User({
                email: 'test@example.com',
                username: 'testuser'
            });

            expect(user.role).toBe('user');
        });
    });
});
