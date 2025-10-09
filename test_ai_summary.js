// Test script for AI Summarization Service
const AISummarizationService = require('./services/aiSummarizationService');

async function testAISummary() {
  console.log('🧪 Testing AI Summarization Service...\n');

  // Test data - sample reviews
  const sampleReviews = [
    {
      rating: 5,
      comment: "Amazing experience! The location was perfect and the facilities were top-notch. Highly recommend!"
    },
    {
      rating: 4,
      comment: "Great place to stay. Clean, comfortable, and great value for money. Only minor issue was parking."
    },
    {
      rating: 5,
      comment: "Absolutely loved it! The views were breathtaking and the staff was incredibly helpful."
    }
  ];

  const listingTitle = "Beautiful Mountain Resort";

  try {
    console.log('📝 Generating summary for:', listingTitle);
    console.log('📊 Reviews count:', sampleReviews.length);
    console.log('⭐ Average rating:', (sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length).toFixed(1));

    const summary = await AISummarizationService.generateSummary(sampleReviews, listingTitle);

    console.log('\n✅ Summary generated successfully!');
    console.log('📄 Summary:', summary);

    // Test needsUpdate function
    const needsUpdate = AISummarizationService.needsUpdate(null, sampleReviews.length);
    console.log('\n🔄 Needs update (no previous update):', needsUpdate);

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const needsUpdate2 = AISummarizationService.needsUpdate(yesterday, sampleReviews.length);
    console.log('🔄 Needs update (24h old):', needsUpdate2);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test with no reviews
async function testNoReviews() {
  console.log('\n🧪 Testing with no reviews...');

  try {
    const summary = await AISummarizationService.generateSummary([], "Test Listing");
    console.log('📄 Summary for no reviews:', summary);
  } catch (error) {
    console.error('❌ No reviews test failed:', error.message);
  }
}

// Test with single review
async function testSingleReview() {
  console.log('\n🧪 Testing with single review...');

  const singleReview = [{
    rating: 5,
    comment: "Wonderful place!"
  }];

  try {
    const summary = await AISummarizationService.generateSummary(singleReview, "Test Listing");
    console.log('📄 Summary for single review:', summary);
  } catch (error) {
    console.error('❌ Single review test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAISummary();
  await testNoReviews();
  await testSingleReview();
  console.log('\n🎉 All tests completed!');
}

runAllTests();
