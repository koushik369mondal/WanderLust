const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const Listing = require('../models/listing');

// Main weather page
router.get('/', async (req, res) => {
    try {
        // Fetch unique locations from listings for the dropdown
        let destinations = await Listing.distinct('location');
        
        // Fallback destinations if no listings
        if (!destinations || destinations.length === 0) {
            destinations = [
                'Paris', 'Tokyo', 'New York', 'London', 'Sydney', 'Rome', 'Barcelona', 'Amsterdam',
                'Dubai', 'Singapore', 'Bangkok', 'Mumbai', 'Cape Town', 'Rio de Janeiro', 'Toronto'
            ];
        }
        
        res.render('weather', {
            title: 'Weather Information',
            currentUser: req.user,
            destinations: destinations.sort() // Sort alphabetically
        });
    } catch (error) {
        console.error('Error fetching destinations:', error);
        // Fallback destinations on error
        const fallbackDestinations = [
            'Paris', 'Tokyo', 'New York', 'London', 'Sydney', 'Rome', 'Barcelona', 'Amsterdam',
            'Dubai', 'Singapore', 'Bangkok', 'Mumbai', 'Cape Town', 'Rio de Janeiro', 'Toronto'
        ];
        res.render('weather', {
            title: 'Weather Information',
            currentUser: req.user,
            destinations: fallbackDestinations.sort()
        });
    }
});

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

// Search weather by location name
router.get('/search/:location', async (req, res) => {
    try {
        const { location } = req.params;
        const weather = await weatherService.getWeatherByLocation(location);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: 'Weather search failed' });
    }
});

module.exports = router;
