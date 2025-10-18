const express = require('express');
const router = express.Router();
const phraseCtrl = require('../controllers/phraseAssistant');

// Render full page (optional)
router.get('/', phraseCtrl.renderIndex);

// API endpoints used by the widget
router.post('/api/translate', phraseCtrl.translate);
router.post('/api/save', phraseCtrl.saveFavorite);
router.get('/api/favorites', phraseCtrl.getFavorites);

module.exports = router;
