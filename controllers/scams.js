const ScamReport = require("../models/scamReport");
const User = require("../models/user");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { validationResult } = require('express-validator');

// Get safety alerts feed
module.exports.getSafetyAlerts = async (req, res) => {
  try {
    const {
      category,
      country,
      city,
      verificationStatus = 'trusted',
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'all') filter.category = category;
    if (country && country !== 'all') filter.country = new RegExp(country, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (verificationStatus !== 'all') filter.verificationStatus = verificationStatus;

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'most_upvoted':
        sort = { upvotes: -1 };
        break;
      case 'most_helpful':
        sort = { totalVotes: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Get reports with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reports = await ScamReport.find(filter)
      .populate('reporter', 'username')
      .populate('verifiedBy', 'username')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await ScamReport.countDocuments(filter);

    // Get filter options
    const categories = await ScamReport.distinct('category');
    const countries = await ScamReport.distinct('country');

    res.render("safety/index", {
      reports,
      categories,
      countries,
      filters: {
        category: category || 'all',
        country: country || 'all',
        city: city || '',
        verificationStatus,
        sortBy,
        page: parseInt(page),
        limit: parseInt(limit)
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching safety alerts:', error);
    req.flash('error', 'Failed to load safety alerts');
    res.redirect('/listings');
  }
};

// Show individual scam report
module.exports.showScamReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id)
      .populate('reporter', 'username')
      .populate('verifiedBy', 'username')
      .populate('upvotes.user', 'username')
      .populate('downvotes.user', 'username');

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Increment view count
    report.viewCount += 1;
    await report.save();

    // Check if user has voted
    let userVote = null;
    if (req.user) {
      if (report.hasUserVoted(req.user._id, 'upvote')) userVote = 'upvote';
      else if (report.hasUserVoted(req.user._id, 'downvote')) userVote = 'downvote';
    }

    // Get related reports in same area
    const relatedReports = await ScamReport.find({
      _id: { $ne: report._id },
      location: new RegExp(report.location, 'i'),
      country: report.country,
      verificationStatus: 'trusted',
      isActive: true
    })
    .populate('reporter', 'username')
    .sort({ totalVotes: -1 })
    .limit(3);

    res.render("safety/show", {
      report,
      userVote,
      relatedReports
    });
  } catch (error) {
    console.error('Error showing scam report:', error);
    req.flash('error', 'Failed to load scam report');
    res.redirect('/safety-alerts');
  }
};

// Render new scam report form
module.exports.renderNewForm = (req, res) => {
  res.render("safety/new");
};

// Create new scam report
module.exports.createScamReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('error', errorMessages.join(', '));
      return res.redirect('/safety-alerts/new');
    }

    const {
      title,
      location,
      city,
      country,
      description,
      category,
      severity,
      incidentDate,
      isAnonymous
    } = req.body.scamReport;

    // Create new report
    const newReport = new ScamReport({
      title,
      location,
      city,
      country,
      description,
      category,
      severity,
      incidentDate: new Date(incidentDate),
      reporter: req.user._id,
      isAnonymous: isAnonymous === 'on'
    });

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      newReport.evidence = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
    }

    // Set geometry if coordinates provided (you can add geocoding here)
    // For now, we'll skip geocoding and let it be set later if needed

    // AI moderation placeholder (you can integrate OpenAI/Gemini here)
    // For now, we'll mark as safe
    newReport.aiModerationResult = 'safe';
    newReport.aiModerationScore = 0.9;

    await newReport.save();

    req.flash('success', 'Scam report submitted successfully! It will be reviewed by our moderators.');
    res.redirect('/safety-alerts');
  } catch (error) {
    console.error('Error creating scam report:', error);
    req.flash('error', 'Failed to submit scam report');
    res.redirect('/safety-alerts/new');
  }
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id);

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Check permissions (only reporter or admin can edit)
    if (!req.user.isAdmin && report.reporter.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this report');
      return res.redirect(`/safety-alerts/${id}`);
    }

    res.render("safety/edit", { report });
  } catch (error) {
    console.error('Error rendering edit form:', error);
    req.flash('error', 'Failed to load edit form');
    res.redirect('/safety-alerts');
  }
};

// Update scam report
module.exports.updateScamReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id);

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Check permissions
    if (!req.user.isAdmin && report.reporter.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this report');
      return res.redirect(`/safety-alerts/${id}`);
    }

    const {
      title,
      location,
      city,
      country,
      description,
      category,
      severity,
      incidentDate
    } = req.body.scamReport;

    // Update fields
    report.title = title;
    report.location = location;
    report.city = city;
    report.country = country;
    report.description = description;
    report.category = category;
    report.severity = severity;
    report.incidentDate = new Date(incidentDate);

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newEvidence = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
      report.evidence.push(...newEvidence);
    }

    await report.save();

    req.flash('success', 'Scam report updated successfully!');
    res.redirect(`/safety-alerts/${id}`);
  } catch (error) {
    console.error('Error updating scam report:', error);
    req.flash('error', 'Failed to update scam report');
    res.redirect(`/safety-alerts/${id}/edit`);
  }
};

// Delete scam report
module.exports.deleteScamReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id);

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Check permissions
    if (!req.user.isAdmin && report.reporter.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to delete this report');
      return res.redirect(`/safety-alerts/${id}`);
    }

    await ScamReport.findByIdAndDelete(id);
    req.flash('success', 'Scam report deleted successfully!');
    res.redirect('/safety-alerts');
  } catch (error) {
    console.error('Error deleting scam report:', error);
    req.flash('error', 'Failed to delete scam report');
    res.redirect('/safety-alerts');
  }
};

// Handle upvotes
module.exports.upvoteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const result = report.toggleVote(req.user._id, 'upvote');
    await report.save();

    res.json({
      success: true,
      action: result,
      upvotes: report.upvotes.length,
      downvotes: report.downvotes.length,
      totalVotes: report.totalVotes
    });
  } catch (error) {
    console.error('Error upvoting report:', error);
    res.status(500).json({ success: false, message: 'Failed to upvote report' });
  }
};

// Handle downvotes
module.exports.downvoteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const result = report.toggleVote(req.user._id, 'downvote');
    await report.save();

    res.json({
      success: true,
      action: result,
      upvotes: report.upvotes.length,
      downvotes: report.downvotes.length,
      totalVotes: report.totalVotes
    });
  } catch (error) {
    console.error('Error downvoting report:', error);
    res.status(500).json({ success: false, message: 'Failed to downvote report' });
  }
};

// Admin: Verify report
module.exports.verifyReport = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await ScamReport.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.verificationStatus = status;
    report.verifiedBy = req.user._id;
    report.verifiedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();

    res.json({ success: true, message: 'Report status updated successfully' });
  } catch (error) {
    console.error('Error verifying report:', error);
    res.status(500).json({ success: false, message: 'Failed to update report status' });
  }
};

// Get scam alerts for a specific location (API endpoint)
module.exports.getLocationAlerts = async (req, res) => {
  try {
    const { location, country, limit = 5 } = req.query;

    if (!location || !country) {
      return res.status(400).json({ success: false, message: 'Location and country are required' });
    }

    const alerts = await ScamReport.getAlertsForLocation(location, country, parseInt(limit));

    res.json({
      success: true,
      alerts: alerts.map(alert => ({
        id: alert._id,
        title: alert.title,
        category: alert.category,
        severity: alert.severity,
        alertLevel: alert.alertLevel,
        totalVotes: alert.totalVotes,
        createdAt: alert.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching location alerts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch location alerts' });
  }
};