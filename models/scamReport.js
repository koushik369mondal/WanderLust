const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scamReportSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['Overpricing', 'Fake Guide', 'Fraud', 'Theft', 'Unsafe Area', 'Transportation Scam', 'Accommodation Scam', 'Tour Scam', 'Other'],
    default: 'Other'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  incidentDate: {
    type: Date,
    required: true
  },
  evidence: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reporter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'trusted', 'false_report', 'spam'],
    default: 'pending'
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  verifiedAt: {
    type: Date
  },
  upvotes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  downvotes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  relatedListings: [{
    type: Schema.Types.ObjectId,
    ref: "Listing"
  }],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  aiModerationScore: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  aiModerationResult: {
    type: String,
    enum: ['safe', 'suspicious', 'spam', 'hate_speech'],
    default: null
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
scamReportSchema.index({ location: 1, country: 1 });
scamReportSchema.index({ category: 1 });
scamReportSchema.index({ verificationStatus: 1 });
scamReportSchema.index({ geometry: "2dsphere" });
scamReportSchema.index({ createdAt: -1 });
scamReportSchema.index({ upvotes: 1 });
scamReportSchema.index({ reporter: 1 });

// Virtual for total votes
scamReportSchema.virtual('totalVotes').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for alert level based on severity and votes
scamReportSchema.virtual('alertLevel').get(function() {
  if (this.verificationStatus === 'trusted') {
    if (this.severity === 'critical' || this.totalVotes > 10) return 'danger';
    if (this.severity === 'high' || this.totalVotes > 5) return 'warning';
    return 'caution';
  }
  return 'info';
});

// Method to check if user has voted
scamReportSchema.methods.hasUserVoted = function(userId, voteType) {
  if (voteType === 'upvote') {
    return this.upvotes.some(vote => vote.user.toString() === userId.toString());
  } else if (voteType === 'downvote') {
    return this.downvotes.some(vote => vote.user.toString() === userId.toString());
  }
  return false;
};

// Method to add/remove vote
scamReportSchema.methods.toggleVote = function(userId, voteType) {
  const userIdStr = userId.toString();

  if (voteType === 'upvote') {
    const existingUpvoteIndex = this.upvotes.findIndex(vote => vote.user.toString() === userIdStr);
    const existingDownvoteIndex = this.downvotes.findIndex(vote => vote.user.toString() === userIdStr);

    if (existingUpvoteIndex > -1) {
      // Remove upvote
      this.upvotes.splice(existingUpvoteIndex, 1);
      return 'removed';
    } else {
      // Add upvote, remove downvote if exists
      this.upvotes.push({ user: userId });
      if (existingDownvoteIndex > -1) {
        this.downvotes.splice(existingDownvoteIndex, 1);
      }
      return 'upvoted';
    }
  } else if (voteType === 'downvote') {
    const existingDownvoteIndex = this.downvotes.findIndex(vote => vote.user.toString() === userIdStr);
    const existingUpvoteIndex = this.upvotes.findIndex(vote => vote.user.toString() === userIdStr);

    if (existingDownvoteIndex > -1) {
      // Remove downvote
      this.downvotes.splice(existingDownvoteIndex, 1);
      return 'removed';
    } else {
      // Add downvote, remove upvote if exists
      this.downvotes.push({ user: userId });
      if (existingUpvoteIndex > -1) {
        this.upvotes.splice(existingUpvoteIndex, 1);
      }
      return 'downvoted';
    }
  }
};

// Static method to get scam alerts for a location
scamReportSchema.statics.getAlertsForLocation = function(location, country, limit = 5) {
  return this.find({
    location: new RegExp(location, 'i'),
    country: new RegExp(country, 'i'),
    verificationStatus: 'trusted',
    isActive: true
  })
  .populate('reporter', 'username')
  .sort({ totalVotes: -1, createdAt: -1 })
  .limit(limit);
};

const ScamReport = mongoose.model("ScamReport", scamReportSchema);
module.exports = ScamReport;