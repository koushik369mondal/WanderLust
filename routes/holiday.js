const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isLoggedIn } = require("../middleware");

// Holiday Calendar page
router.get("/", (req, res) => {
    res.render("holiday/calendar", { title: "Holiday Calendar" });
});

// API endpoint to fetch holidays
router.get("/api/:country/:year?", async (req, res) => {
    try {
        const { country, year } = req.params;
        console.error('DEBUG: Country param:', country);
        console.error('DEBUG: Year param:', year);
        const selectedYear = year || new Date().getFullYear();
        
        // Using Calendarific API (free tier allows 1000 requests/month)
        const apiKey = process.env.HOLIDAY_API_KEY;
        console.error('DEBUG: API Key exists:', !!apiKey);
        
        if (!apiKey) {
            // Enhanced fallback data with more holidays, dynamic by year
            const getFallbackHolidays = (countryCode, year) => {
                console.error('DEBUG: Using fallback for countryCode:', countryCode);
                const holidays = {
                    US: [
                        { name: "New Year's Day", date: `${year}-01-01`, type: "National", category: "National", isFestival: false },
                        { name: "Martin Luther King Jr. Day", date: `${year}-01-15`, type: "Federal", category: "National", isFestival: false },
                        { name: "Presidents' Day", date: `${year}-02-19`, type: "Federal", category: "National", isFestival: false },
                        { name: "Memorial Day", date: `${year}-05-27`, type: "Federal", category: "National", isFestival: false },
                        { name: "Independence Day", date: `${year}-07-04`, type: "National", category: "National", isFestival: true },
                        { name: "Labor Day", date: `${year}-09-02`, type: "Federal", category: "National", isFestival: false },
                        { name: "Columbus Day", date: `${year}-10-14`, type: "Federal", category: "National", isFestival: false },
                        { name: "Veterans Day", date: `${year}-11-11`, type: "Federal", category: "National", isFestival: false },
                        { name: "Thanksgiving", date: `${year}-11-28`, type: "National", category: "National", isFestival: true },
                        { name: "Christmas Day", date: `${year}-12-25`, type: "National", category: "Religious", isFestival: true }
                    ],
                    IN: [
                        { name: "New Year's Day", date: `${year}-01-01`, type: "National", category: "National", isFestival: false },
                        { name: "Republic Day", date: `${year}-01-26`, type: "National", category: "National", isFestival: true },
                        { name: "Holi", date: `${year}-03-13`, type: "Religious", category: "Religious", isFestival: true },
                        { name: "Good Friday", date: `${year}-03-29`, type: "Religious", category: "Religious", isFestival: false },
                        { name: "Ram Navami", date: `${year}-04-17`, type: "Religious", category: "Religious", isFestival: true },
                        { name: "Independence Day", date: `${year}-08-15`, type: "National", category: "National", isFestival: true },
                        { name: "Janmashtami", date: `${year}-08-26`, type: "Religious", category: "Religious", isFestival: true },
                        { name: "Gandhi Jayanti", date: `${year}-10-02`, type: "National", category: "National", isFestival: false },
                        { name: "Dussehra", date: `${year}-10-24`, type: "Religious", category: "Religious", isFestival: true },
                        { name: "Diwali", date: `${year}-11-12`, type: "Religious", category: "Religious", isFestival: true },
                        { name: "Christmas Day", date: `${year}-12-25`, type: "National", category: "Religious", isFestival: true }
                    ],
                    GB: [
                        { name: "New Year's Day", date: `${year}-01-01`, type: "Bank", category: "National", isFestival: false },
                        { name: "Good Friday", date: `${year}-03-29`, type: "Bank", category: "Religious", isFestival: false },
                        { name: "Easter Monday", date: `${year}-04-01`, type: "Bank", category: "Religious", isFestival: false },
                        { name: "Early May Bank Holiday", date: `${year}-05-06`, type: "Bank", category: "National", isFestival: false },
                        { name: "Spring Bank Holiday", date: `${year}-05-27`, type: "Bank", category: "National", isFestival: false },
                        { name: "Summer Bank Holiday", date: `${year}-08-26`, type: "Bank", category: "National", isFestival: false },
                        { name: "Christmas Day", date: `${year}-12-25`, type: "Bank", category: "Religious", isFestival: true },
                        { name: "Boxing Day", date: `${year}-12-26`, type: "Bank", category: "Religious", isFestival: false }
                    ],
                    CA: [
                        { name: "New Year's Day", date: `${year}-01-01`, type: "Federal", category: "National", isFestival: false },
                        { name: "Family Day", date: `${year}-02-19`, type: "Provincial", category: "National", isFestival: false },
                        { name: "Good Friday", date: `${year}-03-29`, type: "Federal", category: "Religious", isFestival: false },
                        { name: "Victoria Day", date: `${year}-05-20`, type: "Federal", category: "National", isFestival: false },
                        { name: "Canada Day", date: `${year}-07-01`, type: "National", category: "National", isFestival: true },
                        { name: "Civic Holiday", date: `${year}-08-05`, type: "Provincial", category: "National", isFestival: false },
                        { name: "Labour Day", date: `${year}-09-02`, type: "Federal", category: "National", isFestival: false },
                        { name: "Thanksgiving", date: `${year}-10-14`, type: "Federal", category: "National", isFestival: true },
                        { name: "Remembrance Day", date: `${year}-11-11`, type: "Federal", category: "National", isFestival: false },
                        { name: "Christmas Day", date: `${year}-12-25`, type: "Federal", category: "Religious", isFestival: true },
                        { name: "Boxing Day", date: `${year}-12-26`, type: "Federal", category: "Religious", isFestival: false }
                    ],
                    AU: [
                        { name: "New Year's Day", date: `${year}-01-01`, type: "Public", category: "National", isFestival: false },
                        { name: "Australia Day", date: `${year}-01-26`, type: "National", category: "National", isFestival: true },
                        { name: "Good Friday", date: `${year}-03-29`, type: "Public", category: "Religious", isFestival: false },
                        { name: "Easter Monday", date: `${year}-04-01`, type: "Public", category: "Religious", isFestival: false },
                        { name: "ANZAC Day", date: `${year}-04-25`, type: "National", category: "National", isFestival: true },
                        { name: "Queen's Birthday", date: `${year}-06-10`, type: "Public", category: "National", isFestival: false },
                        { name: "Labour Day", date: `${year}-10-07`, type: "Public", category: "National", isFestival: false },
                        { name: "Christmas Day", date: `${year}-12-25`, type: "Public", category: "Religious", isFestival: true },
                        { name: "Boxing Day", date: `${year}-12-26`, type: "Public", category: "Religious", isFestival: false }
                    ]
                };
                return holidays[countryCode] || [];
            };

            const countryHolidays = getFallbackHolidays(country.toUpperCase(), selectedYear);
            console.error('DEBUG: Fallback holidays length:', countryHolidays.length);
            return res.json({
                holidays: countryHolidays.sort((a, b) => new Date(a.date) - new Date(b.date)),
                country: country.toUpperCase(),
                year: selectedYear,
                total: countryHolidays.length
            });
        }

        const response = await axios.get(`https://calendarific.com/api/v2/holidays`, {
            params: {
                api_key: apiKey,
                country: country,
                year: selectedYear,
                type: 'national,local,religious'
            }
        });

        const holidays = response.data.response.holidays.map(holiday => {
            const type = holiday.type[0] || 'National';
            const category = type.toLowerCase().includes('religious') ? 'Religious' :
                           type.toLowerCase().includes('national') ? 'National' :
                           type.toLowerCase().includes('local') ? 'Regional' : 'National';
            const isFestival = holiday.name.toLowerCase().includes('christmas') ||
                             holiday.name.toLowerCase().includes('diwali') ||
                             holiday.name.toLowerCase().includes('holi') ||
                             holiday.name.toLowerCase().includes('eid') ||
                             holiday.name.toLowerCase().includes('festival') ||
                             category === 'Religious';

            return {
                name: holiday.name,
                date: holiday.date.iso,
                type: type,
                category: category,
                isFestival: isFestival,
                description: holiday.description
            };
        });

        res.json({ holidays, country: country.toUpperCase(), year: selectedYear });
    } catch (error) {
        console.error("Holiday API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch holidays" });
    }
});

// Add vacation slot to user profile
router.post("/vacation-slot", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Please login to save vacation slots" });
        }

        const { holidayName, date, country, holidayType } = req.body;
        const User = require("../models/user");
        
        const user = await User.findById(req.user._id);
        
        // Check if already exists
        const existingSlot = user.vacationSlots.find(slot => slot.date === date);
        if (existingSlot) {
            return res.status(400).json({ error: "Holiday already marked as vacation slot" });
        }
        
        user.vacationSlots.push({
            holidayName,
            date,
            country,
            holidayType,
            markedAt: new Date()
        });
        
        await user.save();
        res.json({ success: true, message: "Vacation slot saved successfully" });
    } catch (error) {
        console.error("Error saving vacation slot:", error);
        res.status(500).json({ error: "Failed to save vacation slot" });
    }
});

// Remove vacation slot
router.delete("/vacation-slot/:date", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Please login" });
        }

        const { date } = req.params;
        const User = require("../models/user");
        
        const user = await User.findById(req.user._id);
        user.vacationSlots = user.vacationSlots.filter(slot => slot.date !== date);
        
        await user.save();
        res.json({ success: true, message: "Vacation slot removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove vacation slot" });
    }
});

// Get user's vacation slots
router.get("/vacation-slots", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Please login" });
        }

        const User = require("../models/user");
        const user = await User.findById(req.user._id);
        
        res.json({ vacationSlots: user.vacationSlots || [] });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch vacation slots" });
    }
});

// Get popular destinations for specific dates from actual listings
router.get("/destinations/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const month = new Date(date).getMonth() + 1;
        
        const Listing = require("../models/listing");
        
        // Get random popular listings from database
        const listings = await Listing.aggregate([
            { $match: { avgRating: { $gte: 4.0 } } }, // High rated listings
            { $sample: { size: 6 } }, // Random 6 listings
            { $project: { title: 1, location: 1, country: 1 } }
        ]);
        
        // If no high-rated listings, get any random listings
        if (listings.length === 0) {
            const fallbackListings = await Listing.aggregate([
                { $sample: { size: 6 } },
                { $project: { title: 1, location: 1, country: 1 } }
            ]);
            
            const destinations = fallbackListings.map(listing => 
                listing.location || listing.title
            );
            
            return res.json({
                destinations: destinations.slice(0, 4),
                season: month >= 3 && month <= 5 ? "Spring" : 
                       month >= 6 && month <= 8 ? "Summer" :
                       month >= 9 && month <= 11 ? "Fall" : "Winter"
            });
        }
        
        const destinations = listings.map(listing => 
            listing.location || listing.title
        );

        res.json({
            destinations: destinations.slice(0, 4),
            season: month >= 3 && month <= 5 ? "Spring" : 
                   month >= 6 && month <= 8 ? "Summer" :
                   month >= 9 && month <= 11 ? "Fall" : "Winter"
        });
    } catch (error) {
        console.error("Error fetching destinations:", error);
        res.status(500).json({ error: "Failed to fetch destinations" });
    }
});

module.exports = router;