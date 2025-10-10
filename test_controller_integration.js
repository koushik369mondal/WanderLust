// Test script for controller integration with AI Summarization
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const AISummarizationService = require('./services/aiSummarizationService');

async function testControllerIntegration() {
  console.log('🧪 Testing Controller Integration...\n');

  try {
    // Connect to MongoDB (using the same connection as the app)
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
      ssl: false,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Find a listing with reviews
    const listing = await Listing.findOne({ 'reviews.0': { $exists: true } }).populate('reviews.author');
    if (!listing) {
      console.log('❌ No listing with reviews found. Let\'s create a test listing with reviews...');

      // Create a test listing
      const testListing = new Listing({
        title: 'Test Mountain Resort',
        description: 'A beautiful test resort for AI summary testing',
        price: 5000,
        location: 'Test Mountains',
        country: 'Test Country',
        category: 'Mountain Resort',
        bestSeason: 'Winter',
        travelTip: 'Bring warm clothes',
        owner: null, // We'll set this later if needed
        reviews: [
          {
            comment: 'Amazing experience! The location was perfect and the facilities were top-notch.',
            rating: 5,
            author: null // We'll handle this in the controller
          },
          {
            comment: 'Great place to stay. Clean, comfortable, and great value for money.',
            rating: 4,
            author: null
          },
          {
            comment: 'Absolutely loved it! The views were breathtaking and the staff was incredibly helpful.',
            rating: 5,
            author: null
          }
        ]
      });

      await testListing.save();
      console.log('✅ Created test listing with reviews');

      // Test summary generation for this listing
      const summary = await AISummarizationService.generateSummary(testListing.reviews, testListing.title);
      console.log('📄 Generated summary:', summary);

      // Test updating the listing with the summary
      testListing.aiSummary = summary;
      testListing.aiSummaryLastUpdated = new Date();
      await testListing.save();
      console.log('✅ Updated listing with AI summary');

      // Verify the summary was saved
      const updatedListing = await Listing.findById(testListing._id);
      console.log('📄 Saved summary:', updatedListing.aiSummary);

      // Clean up
      await Listing.findByIdAndDelete(testListing._id);
      console.log('🧹 Cleaned up test data');

    } else {
      console.log('📝 Found existing listing with reviews:', listing.title);
      console.log('📊 Reviews count:', listing.reviews.length);

      // Test summary generation
      const summary = await AISummarizationService.generateSummary(listing.reviews, listing.title);
      console.log('📄 Generated summary:', summary);
    }

  } catch (error) {
    console.error('❌ Controller integration test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testControllerIntegration();
