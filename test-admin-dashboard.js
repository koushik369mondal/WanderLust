const mongoose = require('mongoose');
const User = require('./models/user');
const Listing = require('./models/listing');
const Review = require('./models/review');

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

async function testAdminDashboard() {
    try {
        await mongoose.connect(dbUrl);
        console.log('🔗 Connected to MongoDB');

        // Test 1: Check if admin user exists
        console.log('\n📋 Test 1: Admin User Check');
        const admin = await User.findOne({ username: 'admin' });
        if (admin && admin.isAdmin) {
            console.log('✅ Admin user exists and has admin privileges');
            console.log(`   Username: ${admin.username}`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Admin Status: ${admin.isAdmin}`);
        } else {
            console.log('❌ Admin user not found or lacks admin privileges');
            console.log('   Run: node createAdmin.js to create admin user');
        }

        // Test 2: Check data availability for analytics
        console.log('\n📊 Test 2: Data Availability Check');
        
        const userCount = await User.countDocuments();
        const listingCount = await Listing.countDocuments();
        const reviewCount = await Review.countDocuments();
        
        console.log(`   Total Users: ${userCount}`);
        console.log(`   Total Listings: ${listingCount}`);
        console.log(`   Total Reviews: ${reviewCount}`);
        
        if (userCount > 0 && listingCount > 0) {
            console.log('✅ Sufficient data available for analytics');
        } else {
            console.log('⚠️  Limited data - some charts may be empty');
            console.log('   Consider running: npm start to seed initial data');
        }

        // Test 3: Test aggregation queries
        console.log('\n🔍 Test 3: Analytics Query Test');
        
        try {
            // Test user growth query
            const userGrowth = await User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$joinDate" },
                            month: { $month: "$joinDate" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                { $limit: 3 }
            ]);
            
            if (userGrowth.length > 0) {
                console.log('✅ User growth aggregation working');
                console.log(`   Sample data: ${JSON.stringify(userGrowth[0])}`);
            } else {
                console.log('⚠️  User growth query returned no results');
            }
        } catch (error) {
            console.log('❌ User growth aggregation failed:', error.message);
        }

        try {
            // Test top contributors query
            const topContributors = await User.aggregate([
                {
                    $lookup: {
                        from: "listings",
                        localField: "_id",
                        foreignField: "owner",
                        as: "listings"
                    }
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "author",
                        as: "reviews"
                    }
                },
                {
                    $project: {
                        username: 1,
                        listingCount: { $size: "$listings" },
                        reviewCount: { $size: "$reviews" },
                        totalContributions: { $add: [{ $size: "$listings" }, { $size: "$reviews" }] }
                    }
                },
                { $sort: { totalContributions: -1 } },
                { $limit: 3 }
            ]);
            
            if (topContributors.length > 0) {
                console.log('✅ Top contributors aggregation working');
                console.log(`   Top contributor: ${topContributors[0].username} (${topContributors[0].totalContributions} contributions)`);
            } else {
                console.log('⚠️  Top contributors query returned no results');
            }
        } catch (error) {
            console.log('❌ Top contributors aggregation failed:', error.message);
        }

        // Test 4: Check recent activity
        console.log('\n⏰ Test 4: Recent Activity Check');
        
        const recentUsers = await User.countDocuments({ 
            joinDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        });
        
        const recentListings = await Listing.countDocuments({ 
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        });
        
        console.log(`   New users (last 30 days): ${recentUsers}`);
        console.log(`   New listings (last 30 days): ${recentListings}`);
        
        if (recentUsers > 0 || recentListings > 0) {
            console.log('✅ Recent activity detected');
        } else {
            console.log('⚠️  No recent activity - growth indicators will show zero');
        }

        // Test 5: Check average rating calculation
        console.log('\n⭐ Test 5: Rating Calculation Test');
        
        try {
            const avgRatingResult = await Review.aggregate([
                { $group: { _id: null, avg: { $avg: "$rating" } } }
            ]);
            
            const avgRating = avgRatingResult[0]?.avg || 0;
            console.log(`   Platform average rating: ${Math.round(avgRating * 10) / 10}/5`);
            
            if (avgRating > 0) {
                console.log('✅ Rating calculation working');
            } else {
                console.log('⚠️  No ratings found - average will show 0');
            }
        } catch (error) {
            console.log('❌ Rating calculation failed:', error.message);
        }

        // Test 6: Dashboard URL accessibility
        console.log('\n🌐 Test 6: Dashboard Access Information');
        console.log('   Dashboard URL: http://localhost:8080/admin/dashboard');
        console.log('   Direct Admin Access: http://localhost:8080/direct-admin');
        console.log('   Login Credentials:');
        console.log('     Username: admin');
        console.log('     Password: admin123');

        // Summary
        console.log('\n📋 Test Summary');
        console.log('✅ Admin Dashboard Test Complete');
        console.log('');
        console.log('🚀 Next Steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Navigate to: http://localhost:8080/admin/dashboard');
        console.log('3. Login with admin credentials');
        console.log('4. Verify all charts are loading correctly');
        console.log('');
        console.log('📊 Expected Dashboard Features:');
        console.log('• 6 stat cards with real-time metrics');
        console.log('• 6 interactive charts with Chart.js');
        console.log('• Auto-refresh every 5 minutes');
        console.log('• Responsive design for all devices');
        console.log('• Professional admin interface');

        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
console.log('🧪 WanderLust Admin Dashboard Test Suite');
console.log('==========================================');
testAdminDashboard();