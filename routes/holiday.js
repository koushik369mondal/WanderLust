const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isLoggedIn } = require("../middleware");

// Holiday Calendar page
router.get("/", (req, res) => {
    res.render("holiday/calendar", { title: "Holiday Calendar" });
});

// API endpoint to fetch holidays
router.get("/api/:country", async (req, res) => {
    try {
        const { country } = req.params;
        const year = new Date().getFullYear();
        
        // Using Calendarific API (free tier allows 1000 requests/month)
        const apiKey = process.env.HOLIDAY_API_KEY;
        
        if (!apiKey) {
            // Enhanced fallback data with more holidays
            const fallbackHolidays = {
                US: [
                    { name: "New Year's Day", date: `${year}-01-01`, type: "National holiday" },
                    { name: "Martin Luther King Jr. Day", date: `${year}-01-15`, type: "Federal holiday" },
                    { name: "Presidents' Day", date: `${year}-02-19`, type: "Federal holiday" },
                    { name: "Memorial Day", date: `${year}-05-27`, type: "Federal holiday" },
                    { name: "Independence Day", date: `${year}-07-04`, type: "National holiday" },
                    { name: "Labor Day", date: `${year}-09-02`, type: "Federal holiday" },
                    { name: "Columbus Day", date: `${year}-10-14`, type: "Federal holiday" },
                    { name: "Veterans Day", date: `${year}-11-11`, type: "Federal holiday" },
                    { name: "Thanksgiving", date: `${year}-11-28`, type: "National holiday" },
                    { name: "Christmas Day", date: `${year}-12-25`, type: "National holiday" }
                ],
                IN: [
                    { name: "New Year's Day", date: `${year}-01-01`, type: "National holiday" },
                    { name: "Republic Day", date: `${year}-01-26`, type: "National holiday" },
                    { name: "Holi", date: `${year}-03-13`, type: "Religious festival" },
                    { name: "Good Friday", date: `${year}-03-29`, type: "Religious holiday" },
                    { name: "Ram Navami", date: `${year}-04-17`, type: "Religious festival" },
                    { name: "Independence Day", date: `${year}-08-15`, type: "National holiday" },
                    { name: "Janmashtami", date: `${year}-08-26`, type: "Religious festival" },
                    { name: "Gandhi Jayanti", date: `${year}-10-02`, type: "National holiday" },
                    { name: "Dussehra", date: `${year}-10-24`, type: "Religious festival" },
                    { name: "Diwali", date: `${year}-11-12`, type: "Religious festival" },
                    { name: "Christmas Day", date: `${year}-12-25`, type: "National holiday" }
                ],
                GB: [
                    { name: "New Year's Day", date: `${year}-01-01`, type: "Bank holiday" },
                    { name: "Good Friday", date: `${year}-03-29`, type: "Bank holiday" },
                    { name: "Easter Monday", date: `${year}-04-01`, type: "Bank holiday" },
                    { name: "Early May Bank Holiday", date: `${year}-05-06`, type: "Bank holiday" },
                    { name: "Spring Bank Holiday", date: `${year}-05-27`, type: "Bank holiday" },
                    { name: "Summer Bank Holiday", date: `${year}-08-26`, type: "Bank holiday" },
                    { name: "Christmas Day", date: `${year}-12-25`, type: "Bank holiday" },
                    { name: "Boxing Day", date: `${year}-12-26`, type: "Bank holiday" }
                ],
                CA: [
                    { name: "New Year's Day", date: `${year}-01-01`, type: "Federal holiday" },
                    { name: "Family Day", date: `${year}-02-19`, type: "Provincial holiday" },
                    { name: "Good Friday", date: `${year}-03-29`, type: "Federal holiday" },
                    { name: "Victoria Day", date: `${year}-05-20`, type: "Federal holiday" },
                    { name: "Canada Day", date: `${year}-07-01`, type: "National holiday" },
                    { name: "Civic Holiday", date: `${year}-08-05`, type: "Provincial holiday" },
                    { name: "Labour Day", date: `${year}-09-02`, type: "Federal holiday" },
                    { name: "Thanksgiving", date: `${year}-10-14`, type: "Federal holiday" },
                    { name: "Remembrance Day", date: `${year}-11-11`, type: "Federal holiday" },
                    { name: "Christmas Day", date: `${year}-12-25`, type: "Federal holiday" },
                    { name: "Boxing Day", date: `${year}-12-26`, type: "Federal holiday" }
                ],
                AU: [
                    { name: "New Year's Day", date: `${year}-01-01`, type: "Public holiday" },
                    { name: "Australia Day", date: `${year}-01-26`, type: "National holiday" },
                    { name: "Good Friday", date: `${year}-03-29`, type: "Public holiday" },
                    { name: "Easter Monday", date: `${year}-04-01`, type: "Public holiday" },
                    { name: "ANZAC Day", date: `${year}-04-25`, type: "National holiday" },
                    { name: "Queen's Birthday", date: `${year}-06-10`, type: "Public holiday" },
                    { name: "Labour Day", date: `${year}-10-07`, type: "Public holiday" },
                    { name: "Christmas Day", date: `${year}-12-25`, type: "Public holiday" },
                    { name: "Boxing Day", date: `${year}-12-26`, type: "Public holiday" }
                ]
            };
            
            const countryHolidays = fallbackHolidays[country.toUpperCase()] || [];
            return res.json({
                holidays: countryHolidays.sort((a, b) => new Date(a.date) - new Date(b.date)),
                country: country.toUpperCase(),
                year,
                total: countryHolidays.length
            });
        }

        const response = await axios.get(`https://calendarific.com/api/v2/holidays`, {
            params: {
                api_key: apiKey,
                country: country,
                year: year,
                type: 'national,local,religious'
            }
        });

        const holidays = response.data.response.holidays.map(holiday => ({
            name: holiday.name,
            date: holiday.date.iso,
            type: holiday.type[0],
            description: holiday.description
        }));

        res.json({ holidays, country: country.toUpperCase(), year });
    } catch (error) {
        console.error("Holiday API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch holidays" });
    }
});

// Add vacation slot to user profile
router.post("/vacation-slot", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Please login to save vacation slots" });
    }
    try {

        const { holidayName, date, country, holidayType } = req.body;
        console.log('=== SAVING VACATION SLOT ===');
        console.log('Request body:', req.body);
        console.log('User ID:', req.user ? req.user._id : 'No user');
        console.log('Data:', { holidayName, date, country, holidayType });
        
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
        console.log('=== VACATION SLOT SAVED ===');
        console.log('User ID:', req.user._id);
        console.log('Total vacation slots:', user.vacationSlots.length);
        res.json({ success: true, message: "Vacation slot saved successfully" });
    } catch (error) {
        console.error("Error saving vacation slot:", error);
        res.status(500).json({ error: "Failed to save vacation slot" });
    }
});

// Remove vacation slot
router.delete("/vacation-slot/:date", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Please login to remove vacation slots" });
    }
    try {

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
    if (!req.user) {
        return res.json({ vacationSlots: [] });
    }
    try {
        const User = require("../models/user");
        const user = await User.findById(req.user._id);
        
        console.log('User vacation slots:', user.vacationSlots); // Debug log
        res.json({ vacationSlots: user.vacationSlots || [] });
    } catch (error) {
        console.error('Error fetching vacation slots:', error);
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