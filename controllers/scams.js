const ScamReport = require("../models/scamReport.js");
const User = require("../models/user");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { validationResult } = require('express-validator');
const escapeStringRegexp = require('escape-string-regexp');

// Get safety alerts feed
module.exports.getSafetyAlerts = async (req, res) => {
  try {
    const rawCategory = req.query.category;
    const rawCountry = req.query.country;
    const rawCity = req.query.city;
    const rawVerificationStatus = req.query.verificationStatus;
    const rawSortBy = req.query.sortBy;
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;

    const category = typeof rawCategory === 'string' ? rawCategory : (rawCategory ? String(rawCategory) : '');
    const country = typeof rawCountry === 'string' ? rawCountry : (rawCountry ? String(rawCountry) : '');
    const city = typeof rawCity === 'string' ? rawCity : (rawCity ? String(rawCity) : '');
    const verificationStatus = typeof rawVerificationStatus === 'string' ? rawVerificationStatus : 'trusted';
    const sortBy = typeof rawSortBy === 'string' ? rawSortBy : 'newest';
    const pageNum = parseInt(String(rawPage || 1), 10) || 1;
    const limitNum = parseInt(String(rawLimit || 12), 10) || 12;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'all') filter.category = { $eq: category };
    if (country && country !== 'all') filter.country = new RegExp(escapeStringRegexp(country), 'i');
    if (city && city.trim()) filter.city = new RegExp(escapeStringRegexp(city.trim()), 'i');
    if (verificationStatus && verificationStatus !== 'all') filter.verificationStatus = { $eq: verificationStatus };

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
    const skip = (pageNum - 1) * limitNum;
    const reports = await ScamReport.find(filter)
      .populate('reporter', 'username')
      .populate('verifiedBy', 'username')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

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
        page: pageNum,
        limit: limitNum
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNext: skip + limitNum < totalCount,
        hasPrev: pageNum > 1
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
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');

    const report = await ScamReport.findOne({ _id: { $eq: id } })
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
      location: new RegExp(escapeStringRegexp(String(report.location || '')), 'i'),
      country: { $eq: String(report.country || '') },
      verificationStatus: 'trusted',
      isActive: true
    })
      .populate('reporter', 'username')
      .sort({ totalVotes: -1 })
      .limit(3)
      .lean();

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

    const scamReportData = req.body.scamReport || {};
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
    } = scamReportData;

    // Create new report
    const newReport = new ScamReport({
      title: typeof title === 'string' ? title : String(title || ''),
      location: typeof location === 'string' ? location : String(location || ''),
      city: typeof city === 'string' ? city : String(city || ''),
      country: typeof country === 'string' ? country : String(country || ''),
      description: typeof description === 'string' ? description : String(description || ''),
      category: typeof category === 'string' ? category : String(category || ''),
      severity: typeof severity === 'string' ? severity : String(severity || ''),
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
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const report = await ScamReport.findOne({ _id: { $eq: id } });

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
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const report = await ScamReport.findOne({ _id: { $eq: id } });

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Check permissions
    if (!req.user.isAdmin && report.reporter.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this report');
      return res.redirect(`/safety-alerts/${id}`);
    }

    const scamReportData = req.body.scamReport || {};
    const {
      title,
      location,
      city,
      country,
      description,
      category,
      severity,
      incidentDate
    } = scamReportData;

    // Update fields
    report.title = typeof title === 'string' ? title : String(title || '');
    report.location = typeof location === 'string' ? location : String(location || '');
    report.city = typeof city === 'string' ? city : String(city || '');
    report.country = typeof country === 'string' ? country : String(country || '');
    report.description = typeof description === 'string' ? description : String(description || '');
    report.category = typeof category === 'string' ? category : String(category || '');
    report.severity = typeof severity === 'string' ? severity : String(severity || '');
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
    res.redirect(`/safety-alerts/${req.params.id}/edit`);
  }
};

// Delete scam report
module.exports.deleteScamReport = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const report = await ScamReport.findOne({ _id: { $eq: id } });

    if (!report) {
      req.flash('error', 'Scam report not found');
      return res.redirect('/safety-alerts');
    }

    // Check permissions
    if (!req.user.isAdmin && report.reporter.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to delete this report');
      return res.redirect(`/safety-alerts/${id}`);
    }

    await ScamReport.findOneAndDelete({ _id: { $eq: id } });
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
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const report = await ScamReport.findOne({ _id: { $eq: id } });

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
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const report = await ScamReport.findOne({ _id: { $eq: id } });

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

    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : String(rawId || '');
    const { status, adminNotes } = req.body;

    const report = await ScamReport.findOne({ _id: { $eq: id } });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.verificationStatus = typeof status === 'string' ? status : String(status || '');
    report.verifiedBy = req.user._id;
    report.verifiedAt = new Date();
    if (adminNotes) report.adminNotes = typeof adminNotes === 'string' ? adminNotes : String(adminNotes);

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
    const rawLocation = req.query.location;
    const rawCountry = req.query.country;
    const rawLimit = req.query.limit;

    const location = typeof rawLocation === 'string' ? rawLocation : (rawLocation ? String(rawLocation) : '');
    const country = typeof rawCountry === 'string' ? rawCountry : (rawCountry ? String(rawCountry) : '');
    const limitNum = parseInt(String(rawLimit || 5), 10) || 5;

    if (!location || !country) {
      return res.status(400).json({ success: false, message: 'Location and country are required' });
    }

    const alerts = await ScamReport.getAlertsForLocation(location, country, limitNum);

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