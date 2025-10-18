const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');
const { isLoggedIn } = require('../middleware');

// Simple rate limiting middleware
const rateLimitMap = new Map();
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const clientId = req.ip + ':' + (req.user ? req.user._id : 'anonymous');
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!rateLimitMap.has(clientId)) {
            rateLimitMap.set(clientId, []);
        }
        
        const requests = rateLimitMap.get(clientId).filter(time => time > windowStart);
        
        if (requests.length >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        
        requests.push(now);
        rateLimitMap.set(clientId, requests);
        next();
    };
};

// Middleware to ensure user is logged in for all notification routes
router.use(isLoggedIn);
// Add rate limiting to prevent abuse
router.use(rateLimit(50, 15 * 60 * 1000)); // 50 requests per 15 minutes

// Routes
router.get('/', notificationController.getNotifications.bind(notificationController));
router.get('/count', notificationController.getUnreadCount.bind(notificationController));
router.get('/stats', notificationController.getStats.bind(notificationController));
router.get('/settings', notificationController.getSettings.bind(notificationController));

router.put('/settings', notificationController.updateSettings.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.put('/read-all', notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', notificationController.dismissNotification.bind(notificationController));

// Test route (only in development)
if (process.env.NODE_ENV !== 'production') {
    router.post('/test', notificationController.sendTestNotification.bind(notificationController));
}

module.exports = router;