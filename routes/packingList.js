const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const PackingListService = require('../services/packingListService');
const User = require('../models/user');

// GET /packing-list - Show packing list input form
router.get('/', isLoggedIn, (req, res) => {
  res.render('packingList/form', {
    title: 'AI-Powered Packing List Generator',
    user: req.user
  });
});

// POST /packing-list/generate - Generate packing list using AI
router.post('/generate', isLoggedIn, async (req, res) => {
  try {
    const { destination, duration, travelType, activities } = req.body;

    // Validate inputs
    const tripData = {
      destination: destination.trim(),
      duration: parseInt(duration),
      travelType: travelType.toLowerCase(),
      activities: Array.isArray(activities) ? activities : [activities]
    };

    const validation = PackingListService.validateTripData(tripData);
    if (!validation.isValid) {
      return res.status(400).render('packingList/form', {
        title: 'AI-Powered Packing List Generator',
        errors: validation.errors,
        formData: req.body
      });
    }

    // Generate packing list
    const packingList = await PackingListService.generatePackingList(tripData);

    res.render('packingList/result', {
      title: 'Your Personalized Packing List',
      packingList,
      user: req.user
    });
  } catch (error) {
    console.error('Packing list generation error:', error);
    res.status(500).render('packingList/form', {
      title: 'AI-Powered Packing List Generator',
      errors: ['Failed to generate packing list. Please try again later.'],
      formData: req.body
    });
  }
});

// POST /packing-list/save - Save packing list to user's trip plans
router.post('/save', isLoggedIn, async (req, res) => {
  try {
    const { packingList, tripDetails } = req.body;

    if (!packingList || !tripDetails) {
      return res.status(400).json({ error: 'Missing packing list or trip details' });
    }

    const user = await User.findById(req.user._id);

    if (!user.tripPlans) {
      user.tripPlans = [];
    }

    // Add packing list to trip plan
    const newTripPlan = {
      destination: tripDetails.destination,
      startDate: tripDetails.startDate ? new Date(tripDetails.startDate) : new Date(),
      endDate: tripDetails.endDate ? new Date(tripDetails.endDate) : new Date(),
      travelers: tripDetails.travelers || 1,
      budgetType: tripDetails.budgetType || 'moderate',
      packingList: JSON.parse(packingList),
      total: tripDetails.total || 0,
      status: 'planned',
      createdAt: new Date()
    };

    user.tripPlans.push(newTripPlan);
    await user.save();

    res.json({ success: true, message: 'Packing list saved to your trips!' });
  } catch (error) {
    console.error('Save packing list error:', error);
    res.status(500).json({ error: 'Failed to save packing list' });
  }
});

module.exports = router;
