const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// GET /api/destinations - Get all destinations
router.get('/', destinationController.getAllDestinations);

module.exports = router;
