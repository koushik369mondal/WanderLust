const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const User = require("../models/user");
const Listing = require("../models/listing");
const tripPlannerService = require("../services/tripPlannerService");

// Trip Planner main page
router.get("/", (req, res) => {
    const { destination } = req.query;
    res.render("tripPlanner/planner", { 
        title: "Plan My Trip",
        preselectedDestination: destination || ""
    });
});

// Enhanced API endpoint for cost estimation with mock external APIs
router.post("/api/estimate", async (req, res) => {
    try {
        // Log incoming request for debugging (body may contain user input)
        console.log('Estimate API called from', req.ip, 'headers:', req.headers['content-type']);
        console.log('Estimate request body:', req.body);

        const { destination, startDate, endDate, travelers, budgetType, departureCity } = req.body;

        // Basic validation so we can return early with a helpful message
        if (!destination || !startDate || !endDate || !departureCity) {
            console.warn('Estimate API: missing required fields', { destination, startDate, endDate, departureCity });
            return res.status(400).json({ success: false, error: 'Missing required fields: destination, startDate, endDate, departureCity' });
        }

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const startMonth = new Date(startDate).getMonth();
        
        // Use trip planner service for external API calls
        const flightData = await tripPlannerService.getFlightPrices(departureCity, destination, startDate, endDate, travelers);
        const hotelData = await tripPlannerService.getHotelPrices(destination, startDate, endDate, travelers, budgetType);
        const activityData = await tripPlannerService.getActivityPrices(destination, days, travelers, [req.body.tripType || 'leisure']);
        
        // Seasonal pricing multiplier
        const seasonalMultiplier = getSeasonalMultiplier(destination, startMonth);
        
        // Enhanced cost calculation
        const baseCosts = {
            budget: { flight: 200, hotel: 50, food: 30, activities: 25, transport: 15, insurance: 10 },
            moderate: { flight: 400, hotel: 100, food: 60, activities: 50, transport: 25, insurance: 20 },
            luxury: { flight: 800, hotel: 250, food: 120, activities: 100, transport: 50, insurance: 35 }
        };
        
        const costs = baseCosts[budgetType];
        
        // Apply seasonal and destination-specific adjustments
        const adjustedCosts = {
            flights: Math.round((flightData.price || costs.flight) * travelers * seasonalMultiplier),
            hotels: Math.round((hotelData.pricePerNight || costs.hotel) * travelers * days * seasonalMultiplier),
            food: Math.round(costs.food * travelers * days * getDestinationMultiplier(destination, 'food')),
            activities: Math.round((activityData.averagePrice || costs.activities) * travelers * days),
            transport: Math.round(costs.transport * travelers * days * getDestinationMultiplier(destination, 'transport')),
            insurance: Math.round(costs.insurance * travelers * days)
        };
        
        const grandTotal = Object.values(adjustedCosts).reduce((sum, cost) => sum + cost, 0);
        
        // Add recommendations and tips using service
        const recommendations = tripPlannerService.generateRecommendations(destination, budgetType, startMonth, days, travelers);
        const savingTips = tripPlannerService.generateSavingTips(budgetType, days, seasonalMultiplier, destination);
        
        // Prepare estimation in USD, then convert to requested currency if necessary
        const baseCurrency = 'USD';
        let responseCosts = { ...adjustedCosts };
        let responseTotal = grandTotal;
        let responsePerPerson = travelers > 0 ? Math.round(grandTotal / travelers) : 0;
        const requestedCurrency = req.body.currency || baseCurrency;

        if (requestedCurrency && requestedCurrency !== baseCurrency) {
            try {
                const rates = await tripPlannerService.getExchangeRates(baseCurrency);
                const conversionRate = rates[requestedCurrency] || 1;

                // Convert each cost component
                Object.keys(responseCosts).forEach(k => {
                    responseCosts[k] = Math.round(responseCosts[k] * conversionRate);
                });

                responseTotal = Math.round(responseTotal * conversionRate);
                responsePerPerson = travelers > 0 ? Math.round(responseTotal / travelers) : 0;
            } catch (convErr) {
                console.warn('Currency conversion failed, returning USD amounts:', convErr);
            }
        }

        // Recompute breakdown percentages safely
        const safeTotal = responseTotal || 1; // avoid division by zero
        const breakdown = {
            accommodation: Math.round((responseCosts.hotels / safeTotal) * 100),
            flights: Math.round((responseCosts.flights / safeTotal) * 100),
            food: Math.round((responseCosts.food / safeTotal) * 100),
            activities: Math.round((responseCosts.activities / safeTotal) * 100),
            transport: Math.round((responseCosts.transport / safeTotal) * 100),
            insurance: Math.round((responseCosts.insurance / safeTotal) * 100)
        };

        res.json({
            success: true,
            estimation: {
                destination,
                departureCity,
                duration: days,
                travelers,
                budgetType,
                costs: responseCosts,
                total: responseTotal,
                perPerson: responsePerPerson,
                currency: requestedCurrency || baseCurrency,
                seasonalMultiplier: seasonalMultiplier.toFixed(2),
                recommendations,
                savingTips,
                breakdown,
                externalData: {
                    flights: flightData,
                    hotels: hotelData,
                    activities: activityData
                }
            }
        });
    } catch (error) {
        console.error('Trip estimation error:', error);
        // Return consistent payload for client handling
        res.status(500).json({ success: false, error: "Failed to estimate trip cost" });
    }
});

// Temporary debug endpoint to verify POST connectivity and payloads
router.post('/api/echo', (req, res) => {
    try {
        console.log('Echo API called. Body:', req.body);
        res.json({ success: true, received: req.body });
    } catch (err) {
        console.error('Echo API error:', err);
        res.status(500).json({ success: false, error: 'Echo failed' });
    }
});

// Helper functions for seasonal and destination pricing
function getSeasonalMultiplier(destination, month) {
    const peakSeasons = {
        'Europe': [5, 6, 7, 8], // Jun-Sep
        'Asia': [10, 11, 0, 1, 2], // Nov-Mar
        'Americas': [5, 6, 7, 8], // Jun-Sep
        'Default': [5, 6, 7, 11] // Jun-Aug, Dec
    };
    
    const region = getRegion(destination);
    const peak = peakSeasons[region] || peakSeasons['Default'];
    
    return peak.includes(month) ? 1.3 : 0.9;
}

function getDestinationMultiplier(destination, category) {
    const multipliers = {
        'Tokyo': { food: 1.4, transport: 1.2 },
        'Paris': { food: 1.3, transport: 1.1 },
        'London': { food: 1.2, transport: 1.3 },
        'Dubai': { food: 1.1, transport: 0.8 },
        'Mumbai': { food: 0.6, transport: 0.5 },
        'Delhi': { food: 0.5, transport: 0.4 }
    };
    
    return multipliers[destination]?.[category] || 1.0;
}

function getRegion(destination) {
    const regions = {
        'Europe': ['Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam'],
        'Asia': ['Tokyo', 'Mumbai', 'Delhi', 'Bangkok', 'Singapore'],
        'Americas': ['New York', 'Los Angeles', 'Toronto', 'Mexico City']
    };
    
    for (const [region, cities] of Object.entries(regions)) {
        if (cities.includes(destination)) return region;
    }
    return 'Default';
}

// Save trip plan with enhanced data
router.post("/save", isLoggedIn, async (req, res) => {
    try {
        const { tripData } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user.tripPlans) {
            user.tripPlans = [];
        }
        
        // Enhanced trip data with additional fields
        const enhancedTripData = {
            ...tripData,
            createdAt: new Date(),
            status: 'planned',
            lastUpdated: new Date(),
            bookingStatus: {
                flights: false,
                hotels: false,
                activities: false
            },
            notes: '',
            reminders: [],
            sharedWith: []
        };
        
        user.tripPlans.push(enhancedTripData);
        
        // Update user travel stats
        user.travelStats.totalTrips += 1;
        
        // Log activity
        await user.logActivity('trip_planned', `Planned trip to ${tripData.destination}`);
        
        await user.save();
        res.json({ success: true, message: "Trip saved successfully!" });
    } catch (error) {
        console.error('Save trip error:', error);
        res.status(500).json({ error: "Failed to save trip" });
    }
});

// Get user's saved trips with analytics
router.get("/my-trips", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const trips = user.tripPlans || [];
        
        // Calculate trip analytics
        const analytics = {
            totalTrips: trips.length,
            totalBudget: trips.reduce((sum, trip) => sum + (trip.total || 0), 0),
            averageTripCost: trips.length > 0 ? Math.round(trips.reduce((sum, trip) => sum + (trip.total || 0), 0) / trips.length) : 0,
            upcomingTrips: trips.filter(trip => new Date(trip.startDate) > new Date()).length,
            completedTrips: trips.filter(trip => trip.status === 'completed').length,
            favoriteDestinations: getFavoriteDestinations(trips),
            budgetBreakdown: getBudgetBreakdown(trips)
        };
        
        res.render("tripPlanner/myTrips", {
            title: "My Trips",
            trips: trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            analytics
        });
    } catch (error) {
        console.error('Load trips error:', error);
        req.flash("error", "Failed to load your trips");
        res.redirect("/listings");
    }
});

// Get individual trip details
router.get("/my-trips/:tripId", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const trip = user.tripPlans.find(trip => trip._id.toString() === req.params.tripId);
        
        if (!trip) {
            req.flash("error", "Trip not found");
            return res.redirect("/trip-planner/my-trips");
        }
        
        res.render("tripPlanner/tripDetail", {
            title: `Trip to ${trip.destination}`,
            trip: trip
        });
    } catch (error) {
        console.error('Load trip detail error:', error);
        req.flash("error", "Failed to load trip details");
        res.redirect("/trip-planner/my-trips");
    }
});

function getFavoriteDestinations(trips) {
    const destinations = {};
    trips.forEach(trip => {
        destinations[trip.destination] = (destinations[trip.destination] || 0) + 1;
    });
    return Object.entries(destinations)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([dest, count]) => ({ destination: dest, count }));
}

function getBudgetBreakdown(trips) {
    const breakdown = { budget: 0, moderate: 0, luxury: 0 };
    trips.forEach(trip => {
        if (trip.budgetType) {
            breakdown[trip.budgetType]++;
        }
    });
    return breakdown;
}

// Delete trip
router.delete("/:tripId", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const tripToDelete = user.tripPlans.find(trip => trip._id.toString() === req.params.tripId);
        
        if (tripToDelete) {
            user.tripPlans = user.tripPlans.filter(trip => trip._id.toString() !== req.params.tripId);
            
            // Log activity
            await user.logActivity('trip_deleted', `Deleted trip to ${tripToDelete.destination}`);
            
            await user.save();
            res.json({ success: true, message: "Trip deleted successfully" });
        } else {
            res.status(404).json({ error: "Trip not found" });
        }
    } catch (error) {
        console.error('Delete trip error:', error);
        res.status(500).json({ error: "Failed to delete trip" });
    }
});

// Update trip status
router.patch("/:tripId/status", isLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.user._id);
        const trip = user.tripPlans.find(trip => trip._id.toString() === req.params.tripId);
        
        if (trip) {
            trip.status = status;
            trip.lastUpdated = new Date();
            
            await user.logActivity('trip_updated', `Updated trip to ${trip.destination} status to ${status}`);
            await user.save();
            
            res.json({ success: true, message: "Trip status updated successfully" });
        } else {
            res.status(404).json({ error: "Trip not found" });
        }
    } catch (error) {
        console.error('Update trip status error:', error);
        res.status(500).json({ error: "Failed to update trip status" });
    }
});

// Get trip analytics
router.get("/api/analytics", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const trips = user.tripPlans || [];
        
        const analytics = {
            totalSpent: trips.reduce((sum, trip) => sum + (trip.total || 0), 0),
            averageTripLength: trips.length > 0 ? Math.round(trips.reduce((sum, trip) => {
                const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0) / trips.length) : 0,
            monthlySpending: getMonthlySpending(trips),
            destinationStats: getDestinationStats(trips),
            budgetTypePreference: getBudgetTypePreference(trips)
        };
        
        res.json({ success: true, analytics });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: "Failed to get analytics" });
    }
});

function getMonthlySpending(trips) {
    const monthly = {};
    trips.forEach(trip => {
        const month = new Date(trip.createdAt).toISOString().slice(0, 7);
        monthly[month] = (monthly[month] || 0) + (trip.total || 0);
    });
    return monthly;
}

function getDestinationStats(trips) {
    const stats = {};
    trips.forEach(trip => {
        if (!stats[trip.destination]) {
            stats[trip.destination] = { count: 0, totalSpent: 0 };
        }
        stats[trip.destination].count++;
        stats[trip.destination].totalSpent += trip.total || 0;
    });
    return stats;
}

function getBudgetTypePreference(trips) {
    const preferences = { budget: 0, moderate: 0, luxury: 0 };
    trips.forEach(trip => {
        if (trip.budgetType) {
            preferences[trip.budgetType]++;
        }
    });
    return preferences;
}

// Currency conversion endpoint (mock)
router.get("/api/currency/:from/:to", async (req, res) => {
    try {
        const { from, to } = req.params;
        
        // Mock exchange rates (in production, use real API like exchangerate-api.com)
        const rates = {
            'USD': { 'EUR': 0.85, 'GBP': 0.73, 'INR': 83.12, 'JPY': 149.50 },
            'EUR': { 'USD': 1.18, 'GBP': 0.86, 'INR': 97.89, 'JPY': 176.19 },
            'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 113.87, 'JPY': 204.93 },
            'INR': { 'USD': 0.012, 'EUR': 0.010, 'GBP': 0.0088, 'JPY': 1.80 }
        };
        
        const rate = rates[from]?.[to] || 1;
        
        res.json({
            success: true,
            from,
            to,
            rate,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get exchange rate" });
    }
});

router.get("/mood-fixing", (req, res) => {
  res.render("tripPlanner/moodFixing", {
    title: "Mood Fixing - Travel Tools"
  });
});

module.exports = router;
