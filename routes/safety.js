const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const scamsController = require("../controllers/scams.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Validation middleware
const { body } = require('express-validator');

// Validation rules for scam report
const validateScamReport = [
  body('scamReport.title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('scamReport.location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('scamReport.country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country is required'),
  body('scamReport.description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('scamReport.category')
    .isIn(['Overpricing', 'Fake Guide', 'Fraud', 'Theft', 'Unsafe Area', 'Transportation Scam', 'Accommodation Scam', 'Tour Scam', 'Other'])
    .withMessage('Please select a valid category'),
  body('scamReport.severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Please select a valid severity level'),
  body('scamReport.incidentDate')
    .isISO8601()
    .withMessage('Please provide a valid incident date')
    .custom((value) => {
      const incidentDate = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      if (incidentDate > now) {
        throw new Error('Incident date cannot be in the future');
      }
      if (incidentDate < oneYearAgo) {
        throw new Error('Incident date cannot be more than 1 year ago');
      }
      return true;
    })
];

// Routes
router
  .route("/")
  .get(wrapAsync(scamsController.getSafetyAlerts)) // Safety alerts feed
  .post(
    isLoggedIn,
    upload.array("evidence", 5), // Allow up to 5 evidence files
    validateScamReport,
    wrapAsync(scamsController.createScamReport)
  );

// New report form
router.get("/new", isLoggedIn, scamsController.renderNewForm);

// Individual report routes
router
  .route("/:id")
  .get(wrapAsync(scamsController.showScamReport))
  .put(
    isLoggedIn,
    upload.array("evidence", 5),
    validateScamReport,
    wrapAsync(scamsController.updateScamReport)
  )
  .delete(isLoggedIn, wrapAsync(scamsController.deleteScamReport));

// Edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(scamsController.renderEditForm));

// Voting routes
router.post("/:id/upvote", isLoggedIn, wrapAsync(scamsController.upvoteReport));
router.post("/:id/downvote", isLoggedIn, wrapAsync(scamsController.downvoteReport));

// Admin routes - TODO: Implement admin verification UI
// router.put("/:id/verify", isLoggedIn, isAdmin, wrapAsync(scamsController.verifyReport));

// API routes
router.get("/api/location-alerts", wrapAsync(scamsController.getLocationAlerts));

module.exports = router;
