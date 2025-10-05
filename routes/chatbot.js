const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Comprehensive travel guidance system
const travelKnowledge = {
  destinations: {
    'paris': 'Paris offers the Eiffel Tower, Louvre Museum, and charming cafes. Best visited in spring/fall. Budget: €80-150/day.',
    'tokyo': 'Tokyo combines modern tech with traditional culture. Visit temples, try sushi, explore districts. Budget: $100-200/day.',
    'bali': 'Bali has beautiful beaches, temples, and rice terraces. Great for relaxation and adventure. Budget: $30-80/day.',
    'london': 'London features Big Ben, museums, and royal palaces. Rich history and culture. Budget: £70-120/day.',
    'thailand': 'Thailand offers beaches, temples, street food, and friendly locals. Very budget-friendly. Budget: $25-60/day.',
    'india': 'India has diverse culture, spices, monuments like Taj Mahal. Very affordable. Budget: $15-40/day.',
    'italy': 'Italy has Rome, Venice, Florence with art, food, and history. Budget: €60-120/day.',
    'spain': 'Spain offers Barcelona, Madrid, beaches, and vibrant nightlife. Budget: €50-100/day.'
  },
  activities: {
    'adventure': 'Try hiking, bungee jumping, scuba diving, rock climbing, or zip-lining for thrills!',
    'cultural': 'Visit museums, temples, local markets, attend festivals, and interact with locals.',
    'beach': 'Enjoy swimming, surfing, snorkeling, beach volleyball, or simply relaxing by the ocean.',
    'food': 'Take cooking classes, food tours, visit local markets, and try street food.',
    'nightlife': 'Explore bars, clubs, night markets, and evening entertainment districts.'
  },
  seasons: {
    'summer': 'Great for beaches, festivals, and outdoor activities. Pack light, breathable clothes.',
    'winter': 'Perfect for skiing, Christmas markets, and cozy indoor experiences. Pack warm clothes.',
    'spring': 'Ideal for sightseeing with mild weather and blooming flowers. Pack layers.',
    'fall': 'Beautiful autumn colors, harvest festivals, and comfortable temperatures. Pack layers.'
  },
  transport: {
    'flight': 'Book in advance, compare prices, consider budget airlines, and check baggage policies.',
    'train': 'Scenic and comfortable. Consider rail passes for multiple destinations.',
    'bus': 'Most budget-friendly option. Good for short distances and meeting locals.',
    'car': 'Offers flexibility and freedom. Check international driving permits and insurance.'
  },
  accommodation: {
    'hotel': 'Comfortable with services. Book early for better rates. Check reviews and location.',
    'hostel': 'Budget-friendly and social. Great for meeting travelers. Book dorms or private rooms.',
    'airbnb': 'Local experience with kitchen facilities. Read reviews and check host ratings.',
    'resort': 'All-inclusive luxury. Perfect for relaxation. Compare packages and amenities.'
  }
};

// Enhanced response generator
function generateResponse(query) {
  const q = query.toLowerCase();
  
  // Destination queries
  for (const [dest, info] of Object.entries(travelKnowledge.destinations)) {
    if (q.includes(dest)) return info;
  }
  
  // Activity queries
  for (const [activity, info] of Object.entries(travelKnowledge.activities)) {
    if (q.includes(activity)) return info;
  }
  
  // Season queries
  for (const [season, info] of Object.entries(travelKnowledge.seasons)) {
    if (q.includes(season)) return info;
  }
  
  // Transport queries
  for (const [transport, info] of Object.entries(travelKnowledge.transport)) {
    if (q.includes(transport)) return info;
  }
  
  // Accommodation queries
  for (const [acc, info] of Object.entries(travelKnowledge.accommodation)) {
    if (q.includes(acc)) return info;
  }
  
  // Specific travel topics
  if (q.includes('budget')) return 'Budget varies by destination. Southeast Asia: $20-50/day, Europe: €50-100/day, USA: $80-150/day. Use hostels, local food, and public transport to save.';
  if (q.includes('safety')) return 'Research your destination, get travel insurance, keep copies of documents, stay aware of surroundings, and trust your instincts.';
  if (q.includes('packing')) return 'Pack light with versatile clothes, comfortable shoes, essential documents, medications, chargers, and a first-aid kit. Check weather and cultural dress codes.';
  if (q.includes('visa')) return 'Check visa requirements 2-3 months before travel. Many countries offer e-visas or visa-on-arrival. Ensure passport validity of 6+ months.';
  if (q.includes('insurance')) return 'Travel insurance is essential for medical emergencies, trip cancellations, and lost luggage. Compare policies and coverage limits.';
  if (q.includes('currency')) return 'Research exchange rates, notify banks of travel, carry some cash, and have backup payment methods. Use ATMs for better rates.';
  if (q.includes('best place') || q.includes('recommend')) return 'Popular destinations: Paris (culture), Bali (beaches), Tokyo (modern), Thailand (budget-friendly), Italy (history). What type of experience do you want?';
  if (q.includes('when to visit')) return 'Best time depends on destination and activities. Spring/fall are generally ideal for most places. Summer for beaches, winter for skiing.';
  if (q.includes('solo travel')) return 'Solo travel is rewarding! Choose safe destinations, stay in hostels, join group tours, keep in touch with home, and trust your instincts.';
  if (q.includes('group travel')) return 'Plan together, set a budget, choose a leader, book accommodations early, and be flexible with different preferences.';
  
  return 'I can help with destinations, activities, seasons, transport, accommodation, budget, safety, packing, visas, insurance, and more! What would you like to know?';
}

// Chat endpoint with database integration
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const query = message.toLowerCase();
    
    // Try to find relevant listings from database
    if (query.includes('listing') || query.includes('place') || query.includes('destination')) {
      try {
        const listings = await Listing.find({})
          .limit(3)
          .select('title location country price category');
        
        if (listings.length > 0) {
          const listingInfo = listings.map(l => 
            `${l.title} in ${l.location}, ${l.country} (${l.category}) - ₹${l.price}/night`
          ).join('; ');
          
          return res.json({ 
            response: `Here are some popular destinations from our platform: ${listingInfo}. Visit /listings to see more!` 
          });
        }
      } catch (dbError) {
        console.log('Database query failed, using static response');
      }
    }
    
    const response = generateResponse(query);
    res.json({ response });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({ response: 'Sorry, I encountered an error. Please try again!' });
  }
});

module.exports = router;