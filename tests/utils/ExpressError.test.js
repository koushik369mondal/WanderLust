const ExpressError = require('../utils/ExpressError');

describe('ExpressError Utility', () => {
    it('should create error with status and message', () => {
        const error = new ExpressError(404, 'Not Found');
        
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Not Found');
        expect(error).toBeInstanceOf(Error);
    });

    it('should create error with custom status code', () => {
        const error = new ExpressError(500, 'Internal Server Error');
        
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Internal Server Error');
    });

    it('should create error with 400 Bad Request', () => {
        const error = new ExpressError(400, 'Bad Request');
        
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Bad Request');
    });
});
