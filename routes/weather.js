const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// Get weather for specific coordinates
router.get('/current/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: 'Weather service unavailable' });
    }
});

// Get forecast for specific coordinates
router.get('/forecast/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const forecast = await weatherService.getForecast(parseFloat(lat), parseFloat(lon));
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: 'Forecast service unavailable' });
    }
});

module.exports = router;