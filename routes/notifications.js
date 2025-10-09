const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');
const { isLoggedIn } = require('../middleware');

// Middleware to ensure user is logged in for all notification routes
router.use(isLoggedIn);

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