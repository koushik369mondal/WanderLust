const wrapAsync = require('../utils/wrapAsync');

describe('wrapAsync Utility', () => {
    it('should wrap async function and catch errors', async () => {
        const asyncFn = async (req, res) => {
            throw new Error('Test error');
        };

        const wrappedFn = wrapAsync(asyncFn);
        const mockReq = {};
        const mockRes = {};
        const mockNext = jest.fn();

        await wrappedFn(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(mockNext.mock.calls[0][0].message).toBe('Test error');
    });

    it('should call next with error when async function fails', async () => {
        const asyncFn = async () => {
            throw new Error('Async error');
        };

        const wrappedFn = wrapAsync(asyncFn);
        const mockNext = jest.fn();

        await wrappedFn({}, {}, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should not call next if no error occurs', async () => {
        const asyncFn = async (req, res) => {
            res.status(200).send('OK');
        };

        const wrappedFn = wrapAsync(asyncFn);
        const mockReq = {};
        const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const mockNext = jest.fn();

        await wrappedFn(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
