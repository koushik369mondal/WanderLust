const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badgeDefinitionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['explorer', 'reviewer', 'host', 'social', 'milestone'],
        required: true
    },
    criteria: {
        type: {
            type: String,
            enum: ['listing_count', 'review_count', 'destination_count', 'profile_completion', 'social_engagement', 'time_based'],
            required: true
        },
        threshold: {
            type: Number,
            required: true
        }
    },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define default badges
const defaultBadges = [
    {
        name: "Welcome Traveler",
        description: "Complete your profile",
        icon: "fa-user-check",
        category: "milestone",
        criteria: { type: "profile_completion", threshold: 80 },
        rarity: "common"
    },
    {
        name: "First Steps",
        description: "Create your first listing",
        icon: "fa-home",
        category: "host",
        criteria: { type: "listing_count", threshold: 1 },
        rarity: "common"
    },
    {
        name: "Rising Host",
        description: "Create 5 listings",
        icon: "fa-building",
        category: "host",
        criteria: { type: "listing_count", threshold: 5 },
        rarity: "rare"
    },
    {
        name: "Property Mogul",
        description: "Create 20 listings",
        icon: "fa-city",
        category: "host",
        criteria: { type: "listing_count", threshold: 20 },
        rarity: "epic"
    },
    {
        name: "Review Rookie",
        description: "Write your first review",
        icon: "fa-star",
        category: "reviewer",
        criteria: { type: "review_count", threshold: 1 },
        rarity: "common"
    },
    {
        name: "Seasoned Critic",
        description: "Write 10 reviews",
        icon: "fa-edit",
        category: "reviewer",
        criteria: { type: "review_count", threshold: 10 },
        rarity: "rare"
    },
    {
        name: "Review Master",
        description: "Write 50 reviews",
        icon: "fa-award",
        category: "reviewer",
        criteria: { type: "review_count", threshold: 50 },
        rarity: "epic"
    },
    {
        name: "Globe Trotter",
        description: "Add 10 favorite destinations",
        icon: "fa-globe",
        category: "explorer",
        criteria: { type: "destination_count", threshold: 10 },
        rarity: "rare"
    },
    {
        name: "World Explorer",
        description: "Add 25 favorite destinations",
        icon: "fa-map",
        category: "explorer",
        criteria: { type: "destination_count", threshold: 25 },
        rarity: "epic"
    },
    {
        name: "Travel Legend",
        description: "Add 50 favorite destinations",
        icon: "fa-compass",
        category: "explorer",
        criteria: { type: "destination_count", threshold: 50 },
        rarity: "legendary"
    },
    {
        name: "Social Butterfly",
        description: "Complete all social links",
        icon: "fa-users",
        category: "social",
        criteria: { type: "social_engagement", threshold: 4 },
        rarity: "rare"
    },
    {
        name: "Veteran Member",
        description: "Member for 1 year",
        icon: "fa-calendar-alt",
        category: "milestone",
        criteria: { type: "time_based", threshold: 365 },
        rarity: "epic"
    }
];

// Static method to initialize default badges
badgeDefinitionSchema.statics.initializeDefaults = async function() {
    for (const badge of defaultBadges) {
        await this.findOneAndUpdate(
            { name: badge.name },
            badge,
            { upsert: true, new: true }
        );
    }
};

module.exports = mongoose.model("BadgeDefinition", badgeDefinitionSchema);