const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');
const tripPlannerService = require('../services/tripPlannerService');
const weatherService = require('../services/weatherService');
const { Translate } = require('@google-cloud/translate').v2;
const OpenAI = require('openai');

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

// Conversation context storage (in production, use Redis or database)
const conversationContexts = new Map();

// Comprehensive travel guidance system (fallback)
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

// Language detection and translation
async function detectLanguage(text) {
  try {
    const [detection] = await translate.detect(text);
    return detection.language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}

async function translateText(text, targetLang) {
  try {
    if (targetLang === 'en') return text;
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

// AI-powered response generator
async function generateAIResponse(message, userLang = 'en', userId = null, context = []) {
  try {
    // Get user context if available
    let userContext = '';
    if (userId) {
      const user = await User.findById(userId).select('tripPlans travelStats');
      if (user && user.tripPlans && user.tripPlans.length > 0) {
        const recentTrips = user.tripPlans.slice(-3);
        userContext = `User has ${user.tripPlans.length} saved trips. Recent destinations: ${recentTrips.map(t => t.destination).join(', ')}. Travel stats: ${JSON.stringify(user.travelStats)}`;
      }
    }

    // Check for trip planning intents
    const tripPlanningKeywords = ['plan', 'trip', 'itinerary', 'book', 'schedule', 'travel to', 'visit', 'holiday'];
    const isTripPlanning = tripPlanningKeywords.some(keyword => message.toLowerCase().includes(keyword));

    let systemPrompt = `You are an AI Travel Assistant for WanderLust, a comprehensive travel platform. You help users plan trips, find destinations, book accommodations, and get travel advice.

Key capabilities:
- Plan complete trips with itineraries, budgets, and recommendations
- Provide destination information and travel tips
- Help with booking suggestions (flights, hotels, activities)
- Give weather updates and safety information
- Support multiple languages and natural conversation
- Integrate with user's travel history and preferences

${userContext ? `User context: ${userContext}` : ''}

Guidelines:
- Be conversational and helpful
- Provide specific, actionable advice
- Use emojis occasionally to make responses engaging
- For trip planning, ask for key details: destination, duration, budget, travelers, dates
- Suggest alternatives when appropriate
- Keep responses concise but informative
- If planning a trip, structure the response with clear sections

Current user language: ${userLang}`;

    if (isTripPlanning) {
      systemPrompt += `

For trip planning requests:
- Extract key parameters: destination, duration, budget, dates, travelers
- Provide cost estimates using current market rates
- Suggest optimal seasons and activities
- Include accommodation and transport recommendations
- Offer to save the trip plan for the user`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Enhanced fallback that handles trip planning
    return generateEnhancedFallbackResponse(message, userLang);
  }
}

// Enhanced fallback response generator with trip planning
async function generateEnhancedFallbackResponse(message, userLang = 'en') {
  const q = message.toLowerCase();

  // Check for trip planning requests in fallback
  const tripPlanningKeywords = ['plan', 'trip', 'itinerary', 'book', 'schedule', 'travel to', 'visit', 'holiday', 'कर दो', 'बना दो', 'प्लान'];
  const isTripPlanning = tripPlanningKeywords.some(keyword => q.includes(keyword));

  let response = '';

  if (isTripPlanning) {
    // Extract trip parameters from messages
    const destinationMatch = message.match(/(?:plan|trip|visit|go to|कर दो|बना दो|जाऊंगा|जाएंगे?)\s+(.+?)(?:\s+in|\s+for|\s+under|\s+with|\s+में|\s+का|\s+की|$)/i);
    const durationMatch = message.match(/(\d+)\s*(?:day|days|night|nights|week|weeks|दिन|दिवस|सप्ताह)/i);
    const budgetMatch = message.match(/(?:under|below|budget|₹|rs|\$|€|£|हजार|लाख)\s*(\d+(?:,\d+|,\d\d\d)*)/i);

    const destination = destinationMatch ? destinationMatch[1].trim() : null;
    const duration = durationMatch ? parseInt(durationMatch[1]) : null;
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;

    if (destination) {
      if (destination.toLowerCase().includes('shimla') || destination.toLowerCase().includes('शिमला')) {
        response = `Alright! I'm creating a ${duration || 3}-day trip plan for Shimla.

**Shimla Trip Plan (in December):**

**Day 1: Travel from Delhi to Shimla**
• Delhi to Shimla bus/car: ₹800-1500
• Arrive by evening and relax

**Day 2: Sightseeing in Shimla**
• Mall Road, Ridge, St. Michael's Church
• Food: Tea, corn, chivda
• Budget: ₹2000-3000

**Day 3: Nearby places**
• Kufri (monal, Himalayan wildlife) or Chail (cricket ground)
• Return to Delhi
• Budget: ₹2000-3000

**Total Budget: ₹${budget ? budget : '8000-12000'}**
• Travel: ₹2000
• Hotel: ₹3000-5000 (₹1000-1500/room)
• Food: ₹2000-3000
• Other: ₹1000

Would you like to save this plan or make changes?`;
      } else if (destination.toLowerCase().includes('goa') || destination.toLowerCase().includes('गोवा')) {
        response = `Alright! I'm creating a ${duration || 5}-day trip plan for Goa.

**Goa Trip Plan:**

**Days 1-2: North Goa (Panjim area)**
• Calangute/Baga beach
• Fort Aguada, Sinquerim beach
• Budget: ₹3000-4000/day

**Days 3-4: South Goa**
• Colva beach, Benaulim
• Palolem, Margao market
• Budget: ₹3000-4000/day

**Day 5: Return**
• Final shopping, relax

**Total Budget: ₹${budget ? budget : '25000-35000'}**
• Hotel: ₹8000-12000
• Food: ₹5000-7000
• Transport: ₹3000-5000
• Activities: ₹2000-3000

Would you like to save this plan?`;
      } else {
        response = `Alright! I'm creating a trip plan for ${destination}.

**General Trip Plan:**

**Day 1: Travel and arrival**
• Visit main attractions
• Budget: ₹2000-3000

**Days 2-${duration || 3}: Sightseeing**
• Local food and culture
• Budget: ₹2000-4000/day

**Last day: Return**
• Shopping and relax

**Total Budget: ₹${budget ? budget : '10000-20000'}**

Would you like more details like dates, budget, or special preferences?`;
      }
    }
  }

  if (!response) {
    // Destination queries
    for (const [dest, info] of Object.entries(travelKnowledge.destinations)) {
      if (q.includes(dest)) {
        response = info;
        break;
      }
    }

    // Activity queries
    if (!response) {
      for (const [activity, info] of Object.entries(travelKnowledge.activities)) {
        if (q.includes(activity)) {
          response = info;
          break;
        }
      }
    }

    // Season queries
    if (!response) {
      for (const [season, info] of Object.entries(travelKnowledge.seasons)) {
        if (q.includes(season)) {
          response = info;
          break;
        }
      }
    }

    // Transport queries
    if (!response) {
      for (const [transport, info] of Object.entries(travelKnowledge.transport)) {
        if (q.includes(transport)) {
          response = info;
          break;
        }
      }
    }

    // Accommodation queries
    if (!response) {
      for (const [acc, info] of Object.entries(travelKnowledge.accommodation)) {
        if (q.includes(acc)) {
          response = info;
          break;
        }
      }
    }

    // Specific travel topics
    if (!response) {
      if (q.includes('budget') || q.includes('बजट')) {
        response = 'Budget varies by destination. South Asia: $20-50/day, Europe: €50-100/day, America: $80-150/day. Use hostels, local food, and public transport.';
      } else if (q.includes('safety') || q.includes('सुरक्षा')) {
        response = 'Research your destination, get travel insurance, keep copies of documents, stay aware of surroundings, and trust your instincts.';
      } else if (q.includes('packing') || q.includes('पैकिंग')) {
        response = 'Pack light - versatile clothes, comfortable shoes, essential documents, medicine, chargers, and first-aid kit. Check weather and cultural dress codes.';
      } else if (q.includes('visa') || q.includes('वीजा')) {
        response = 'Check visa requirements 3 months before. Many countries have e-visa or visa-on-arrival. Passport validity should be 6+ months.';
      } else if (q.includes('insurance') || q.includes('इंश्योरेंस')) {
        response = 'Travel insurance is essential - for medical emergencies, trip cancellation, and lost luggage. Compare policies and coverage limits.';
      } else if (q.includes('currency') || q.includes('करेंसी')) {
        response = 'Research exchange rates, notify banks of travel, carry some cash, and have backup payment options. ATMs offer better rates.';
      } else if (q.includes('best place') || q.includes('recommend') || q.includes('सुझाव')) {
        response = 'Popular destinations: Paris (culture), Bali (beach), Tokyo (modern), Thailand (budget-friendly), Italy (history). What type of experience do you want?';
      } else if (q.includes('when to visit') || q.includes('कब जाएं')) {
        response = 'Best time depends on destination and activities. Spring/fall are best for most places. Summer for beaches, winter for skiing.';
      } else if (q.includes('solo travel') || q.includes('अकेले')) {
        response = 'Solo travel is rewarding! Choose safe destinations, stay in hostels, join group tours, keep in touch with home, and trust your instincts.';
      } else if (q.includes('group travel') || q.includes('ग्रुप')) {
        response = 'Plan together, set a budget, choose a leader, book accommodations early, and be flexible with different preferences.';
      } else {
        response = 'I can help with destinations, activities, seasons, transport, accommodation, budget, safety, packing, visas, insurance, and trip planning! What would you like to know?';
      }
    }
  }

  // Translate response to user's language if not English
  if (userLang !== 'en' && response) {
    try {
      response = await translateText(response, userLang);
    } catch (error) {
      console.error('Translation error in fallback:', error);
      // Keep original response if translation fails
    }
  }

  return response;
}

// Fallback response generator (static)
function generateFallbackResponse(query) {
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

  return 'I can help with destinations, activities, seasons, transport, accommodation, budget, safety, packing, visas, insurance, and trip planning! What would you like to know?';
}

// Trip planning helper
async function handleTripPlanning(message, userId = null) {
  try {
    // Extract trip parameters from message using regex and AI
    const destinationMatch = message.match(/(?:plan|trip|visit|go to)\s+(.+?)(?:\s+in|\s+for|\s+under|\s+with|$)/i);
    const durationMatch = message.match(/(\d+)\s*(?:day|days|night|nights|week|weeks)/i);
    const budgetMatch = message.match(/(?:under|below|budget|₹|rs|\$|€|£)\s*(\d+(?:,\d+)*)/i);
    const travelersMatch = message.match(/(\d+)\s*(?:person|people|travelers?|travellers?)/i);

    const destination = destinationMatch ? destinationMatch[1].trim() : null;
    const duration = durationMatch ? parseInt(durationMatch[1]) : null;
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;
    const travelers = travelersMatch ? parseInt(travelersMatch[1]) : 1;

    if (destination && duration) {
      // Use trip planner service to generate estimate
      const estimateData = {
        destination,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        endDate: new Date(Date.now() + (30 + duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelers: travelers || 1,
        budgetType: budget ? (budget < 20000 ? 'budget' : budget < 50000 ? 'moderate' : 'luxury') : 'moderate',
        departureCity: 'Delhi' // Default, can be made dynamic
      };

      const estimate = await tripPlannerService.getFlightPrices(
        estimateData.departureCity,
        destination,
        estimateData.startDate,
        estimateData.endDate,
        estimateData.travelers
      );

      return `I'll help you plan a ${duration}-day trip to ${destination}! 

Based on current estimates:
• Flights: ₹${estimate.price || '15,000-25,000'} per person
• Duration: ${duration} days
• Travelers: ${travelers || 1}

Would you like me to create a detailed itinerary with hotels, activities, and cost breakdown? Just let me know your preferred dates and budget!`;
    }

    return "I'd love to help you plan a trip! Could you tell me: 1) Where do you want to go? 2) How many days? 3) What's your budget? 4) How many people are traveling?";
  } catch (error) {
    console.error('Trip planning error:', error);
    return "I can help you plan your trip! Please share details like destination, duration, and budget.";
  }
}

// Enhanced chat endpoint with AI and multi-language support
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user._id : null;
    const userLang = req.getLocale ? req.getLocale() : 'en';

    // Get or create conversation context
    let context = [];
    if (sessionId && conversationContexts.has(sessionId)) {
      context = conversationContexts.get(sessionId);
    }

    // Detect message language if different from user preference
    const detectedLang = await detectLanguage(message);
    let processedMessage = message;

    // Translate to English for processing if needed
    if (detectedLang !== 'en') {
      processedMessage = await translateText(message, 'en');
    }

    let response = '';

    // Check for trip planning requests first
    const tripPlanningKeywords = ['plan', 'trip', 'itinerary', 'book', 'schedule', 'travel to', 'visit', 'holiday'];
    const isTripPlanning = tripPlanningKeywords.some(keyword => processedMessage.toLowerCase().includes(keyword));

    if (isTripPlanning) {
      // Use AI for trip planning
      response = await generateAIResponse(processedMessage, userLang, userId, context);
    } else {
      // Try to find relevant listings from database for accommodation queries
      const query = processedMessage.toLowerCase();
      if (query.includes('listing') || query.includes('place') || query.includes('destination') || query.includes('hotel') || query.includes('stay')) {
        try {
          const listings = await Listing.find({})
            .limit(3)
            .select('title location country price category');

          if (listings.length > 0) {
            const listingInfo = listings.map(l =>
              `${l.title} in ${l.location}, ${l.country} (${l.category}) - ₹${l.price}/night`
            ).join('; ');

            response = `Here are some popular destinations from our platform: ${listingInfo}. Visit /listings to see more!`;
          } else {
            response = await generateAIResponse(processedMessage, userLang, userId, context);
          }
        } catch (dbError) {
          console.log('Database query failed, using AI response');
          response = await generateAIResponse(processedMessage, userLang, userId, context);
        }
      } else {
        // Use AI for general queries
        response = await generateAIResponse(processedMessage, userLang, userId, context);
      }
    }

    // Translate response back to user's language if needed
    if (detectedLang !== 'en' && userLang !== 'en') {
      response = await translateText(response, userLang);
    }

    // Update conversation context
    context.push({ role: 'user', content: processedMessage });
    context.push({ role: 'assistant', content: response });

    // Store context (keep only last 20 messages)
    if (context.length > 20) {
      context = context.slice(-20);
    }

    if (sessionId) {
      conversationContexts.set(sessionId, context);
    }

    res.json({
      response,
      sessionId: sessionId || Date.now().toString(),
      language: userLang,
      detectedLanguage: detectedLang
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      response: 'Sorry, I encountered an error. Please try again!',
      error: true
    });
  }
});

// Trip planning endpoint
router.post('/plan-trip', async (req, res) => {
  try {
    const { destination, duration, budget, travelers, startDate, preferences } = req.body;
    const userId = req.user ? req.user._id : null;

    // Use trip planner service to generate comprehensive plan
    const tripPlan = await tripPlannerService.generateTripPlan({
      destination,
      duration: parseInt(duration),
      budget: parseInt(budget),
      travelers: parseInt(travelers) || 1,
      startDate,
      preferences: preferences || {}
    });

    // Save to user's trip plans if logged in
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.tripPlans.push({
          ...tripPlan,
          createdAt: new Date(),
          status: 'planned'
        });
        await user.save();
      }
    }

    res.json({
      success: true,
      tripPlan,
      saved: !!userId
    });

  } catch (error) {
    console.error('Trip planning error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate trip plan'
    });
  }
});

// Weather endpoint
router.get('/weather/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    // For now, return a mock weather response since we need coordinates
    const mockWeather = {
      temperature: 22,
      condition: 'Sunny',
      description: 'Clear skies',
      humidity: 65,
      windSpeed: 5
    };
    res.json({ success: true, weather: mockWeather });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ success: false, error: 'Failed to get weather' });
  }
});

module.exports = router;