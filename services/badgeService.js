const BadgeDefinition = require('../models/badgeDefinition');
const User = require('../models/user');
const Listing = require('../models/listing');
const Review = require('../models/review');

class BadgeService {
    static async checkAndAwardBadges(userId) {
        try {
            const user = await User.findById(userId).populate('badges');
            if (!user) return false;

            const badges = await BadgeDefinition.find({ isActive: true });
            let newBadgesAwarded = [];

            for (const badgeDefinition of badges) {
                // Check if user already has this badge
                const hasBadge = user.badges.some(badge => badge.name === badgeDefinition.name);
                if (hasBadge) continue;

                const meetsRequirement = await this.checkBadgeRequirement(user, badgeDefinition);
                if (meetsRequirement) {
                    await user.awardBadge({
                        name: badgeDefinition.name,
                        description: badgeDefinition.description,
                        icon: badgeDefinition.icon,
                        category: badgeDefinition.category
                    });
                    newBadgesAwarded.push(badgeDefinition.name);
                    
                    // Send badge earned notification
                    try {
                        const NotificationService = require('./notificationService');
                        const notificationService = new NotificationService(global.io);
                        await notificationService.createBadgeEarnedNotification(
                            userId,
                            badgeDefinition.name,
                            badgeDefinition.icon
                        );
                    } catch (notificationError) {
                        console.error('Error sending badge notification:', notificationError);
                    }
                }
            }

            return newBadgesAwarded;
        } catch (error) {
            console.error('Error checking badges:', error);
            return false;
        }
    }

    static async checkBadgeRequirement(user, badgeDefinition) {
        const { criteria } = badgeDefinition;

        switch (criteria.type) {
            case 'profile_completion':
                return user.profileCompletion >= criteria.threshold;

            case 'listing_count':
                const listingCount = await Listing.countDocuments({ owner: user._id });
                return listingCount >= criteria.threshold;

            case 'review_count':
                const reviewCount = await Review.countDocuments({ author: user._id });
                return reviewCount >= criteria.threshold;

            case 'destination_count':
                return user.favoriteDestinations.length >= criteria.threshold;

            case 'social_engagement':
                const socialLinks = user.socialLinks;
                const filledLinks = Object.values(socialLinks).filter(link => link && link.trim() !== '').length;
                return filledLinks >= criteria.threshold;

            case 'time_based':
                const daysSinceJoin = Math.floor((new Date() - user.joinDate) / (1000 * 60 * 60 * 24));
                return daysSinceJoin >= criteria.threshold;

            default:
                return false;
        }
    }

    static async updateUserStats(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) return false;

            // Count user's listings and reviews
            const [listingCount, reviewCount] = await Promise.all([
                Listing.countDocuments({ owner: userId }),
                Review.countDocuments({ author: userId })
            ]);

            // Update stats
            user.travelStats.totalListings = listingCount;
            user.travelStats.totalReviews = reviewCount;
            user.travelStats.countriesVisited = user.favoriteDestinations.length;

            await user.save();
            return true;
        } catch (error) {
            console.error('Error updating user stats:', error);
            return false;
        }
    }

    static getBadgeRarityColor(rarity) {
        const colors = {
            common: '#6c757d',
            rare: '#17a2b8',
            epic: '#6f42c1',
            legendary: '#fd7e14'
        };
        return colors[rarity] || colors.common;
    }

    static getBadgeRarityGradient(rarity) {
        const gradients = {
            common: 'linear-gradient(135deg, #6c757d, #adb5bd)',
            rare: 'linear-gradient(135deg, #17a2b8, #20c997)',
            epic: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
            legendary: 'linear-gradient(135deg, #fd7e14, #ffc107)'
        };
        return gradients[rarity] || gradients.common;
    }
}

module.exports = BadgeService;