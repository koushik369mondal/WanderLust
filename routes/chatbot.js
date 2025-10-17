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
function generateEnhancedFallbackResponse(message, userLang = 'en') {
  const q = message.toLowerCase();

  // Check for trip planning requests in fallback
  const tripPlanningKeywords = ['plan', 'trip', 'itinerary', 'book', 'schedule', 'travel to', 'visit', 'holiday', 'कर दो', 'बना दो', 'प्लान'];
  const isTripPlanning = tripPlanningKeywords.some(keyword => q.includes(keyword));

  if (isTripPlanning) {
    // Extract trip parameters from Hindi/English messages
    const destinationMatch = message.match(/(?:plan|trip|visit|go to|कर दो|बना दो|जाऊंगा|जाएंगे?)\s+(.+?)(?:\s+in|\s+for|\s+under|\s+with|\s+में|\s+का|\s+की|$)/i);
    const durationMatch = message.match(/(\d+)\s*(?:day|days|night|nights|week|weeks|दिन|दिवस|सप्ताह)/i);
    const budgetMatch = message.match(/(?:under|below|budget|₹|rs|\$|€|£|हजार|लाख)\s*(\d+(?:,\d+|,\d\d\d)*)/i);

    const destination = destinationMatch ? destinationMatch[1].trim() : null;
    const duration = durationMatch ? parseInt(durationMatch[1]) : null;
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;

    if (destination) {
      let response = '';

      if (destination.toLowerCase().includes('shimla') || destination.toLowerCase().includes('शिमला')) {
        response = `ठीक है! मैं आपके लिए ${duration || 3} दिन का शिमला ट्रिप प्लान बना रहा हूँ।

**शिमला ट्रिप प्लान (दिसंबर में):**

**दिन 1: दिल्ली से शिमला (यात्रा)**
• दिल्ली से शिमला बस/कार: ₹800-1500
• शाम तक पहुँचकर आराम

**दिन 2: शिमला साइटसीइंग**
• मॉल रोड, रिज मैदान, जैकब्स चर्च
• खाना: चाय, मकई, चिवड़ा
• बजट: ₹2000-3000

**दिन 3: आसपास के स्थान**
• कुफरी (मोनाल, हिमालयन वाइल्डलाइफ) या चैल (क्रिकेट ग्राउंड)
• वापसी दिल्ली
• बजट: ₹2000-3000

**कुल बजट: ₹${budget ? budget : '8000-12000'}**
• यात्रा: ₹2000
• होटल: ₹3000-5000 (₹1000-1500/रूम)
• खाना: ₹2000-3000
• अन्य: ₹1000

क्या आप इस प्लान को सेव करना चाहेंगे या कोई बदलाव करना चाहेंगे?`;
      } else if (destination.toLowerCase().includes('goa') || destination.toLowerCase().includes('गोवा')) {
        response = `ठीक है! मैं आपके लिए ${duration || 5} दिन का गोवा ट्रिप प्लान बना रहा हूँ।

**गोवा ट्रिप प्लान:**

**दिन 1-2: उत्तर गोवा (पणजी क्षेत्र)**
• कैलंगुट/बागा बीच
• फोर्ट अगुआडा, सिन्क्वेरिम बीच
• बजट: ₹3000-4000/दिन

**दिन 3-4: दक्षिण गोवा**
• कोलवा बीच, बेनौलिम
• बस्सेलम, मारगाव बाजार
• बजट: ₹3000-4000/दिन

**दिन 5: वापसी**
• अंतिम शॉपिंग, आराम

**कुल बजट: ₹${budget ? budget : '25000-35000'}**
• होटल: ₹8000-12000
• खाना: ₹5000-7000
• ट्रांसपोर्ट: ₹3000-5000
• एक्टिविटीज: ₹2000-3000

क्या आप इस प्लान को सेव करना चाहेंगे?`;
      } else {
        response = `ठीक है! मैं आपके लिए ${destination} का ट्रिप प्लान बना रहा हूँ।

**सामान्य ट्रिप प्लान:**

**दिन 1: यात्रा और पहुँच**
• मुख्य आकर्षण देखें
• बजट: ₹2000-3000

**दिन 2-${duration || 3}: साइटसीइंग**
• लोकल फूड और कल्चर
• बजट: ₹2000-4000/दिन

**अंतिम दिन: वापसी**
• शॉपिंग और आराम

**कुल बजट: ₹${budget ? budget : '10000-20000'}**

क्या आप और डिटेल्स देना चाहेंगे जैसे डेट्स, बजट, या स्पेशल प्रेफरेंस?`;
      }

      return response;
    }
  }

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
  if (q.includes('budget') || q.includes('बजट')) return 'बजट डेस्टिनेशन के हिसाब से बदलता है। दक्षिण एशिया: $20-50/दिन, यूरोप: €50-100/दिन, अमेरिका: $80-150/दिन। हॉस्टल, लोकल फूड और पब्लिक ट्रांसपोर्ट इस्तेमाल करें।';
  if (q.includes('safety') || q.includes('सुरक्षा')) return 'डेस्टिनेशन रिसर्च करें, ट्रेवल इंश्योरेंस लें, डॉक्यूमेंट्स की कॉपी रखें, आसपास से अवेयर रहें, और अपने इंस्टिंक्ट पर भरोसा करें।';
  if (q.includes('packing') || q.includes('पैकिंग')) return 'लाइट पैक करें - वर्सटाइल कपड़े, आरामदायक जूते, जरूरी डॉक्यूमेंट्स, मेडिसिन, चार्जर, और फर्स्ट-एड किट। मौसम और कल्चरल ड्रेस कोड चेक करें।';
  if (q.includes('visa') || q.includes('वीजा')) return '3 महीने पहले वीजा रिक्वायरमेंट चेक करें। कई देशों में e-visa या visa-on-arrival मिलता है। पासपोर्ट वैलिडिटी 6+ महीने होनी चाहिए।';
  if (q.includes('insurance') || q.includes('इंश्योरेंस')) return 'ट्रेवल इंश्योरेंस जरूरी है - मेडिकल इमरजेंसी, ट्रिप कैंसलेशन, और लॉस्ट लगेज के लिए। पॉलिसी और कवरेज लिमिट्स कम्पेयर करें।';
  if (q.includes('currency') || q.includes('करेंसी')) return 'एक्सचेंज रेट रिसर्च करें, बैंकों को ट्रेवल की नोटिफाई करें, कुछ कैश लेकर चलें, और बैकअप पेमेंट ऑप्शंस रखें। एटीएम से बेहतर रेट मिलते हैं।';
  if (q.includes('best place') || q.includes('recommend') || q.includes('सुझाव')) return 'पॉपुलर डेस्टिनेशंस: पेरिस (कल्चर), बाली (बीच), टोक्यो (मॉडर्न), थाईलैंड (बजट-फ्रेंडली), इटली (हिस्ट्री)। आप किस तरह का एक्सपीरियंस चाहते हैं?';
  if (q.includes('when to visit') || q.includes('कब जाएं')) return 'बेस्ट टाइम डेस्टिनेशन और एक्टिविटीज पर डिपेंड करता है। ज्यादातर जगहों के लिए स्प्रिंग/फॉल बेस्ट हैं। समर बीचे के लिए, विंटर स्कीइंग के लिए।';
  if (q.includes('solo travel') || q.includes('अकेले')) return 'सोलो ट्रेवल रिवॉर्डिंग है! सेफ डेस्टिनेशंस चुनें, हॉस्टल में रुकें, ग्रुप टूर्स जॉइन करें, होम से कांटेक्ट में रहें, और अपने इंस्टिंक्ट पर भरोसा करें।';
  if (q.includes('group travel') || q.includes('ग्रुप')) return 'टुगेदर प्लान करें, बजट सेट करें, एक लीडर चुनें, अकॉमोडेशन जल्दी बुक करें, और डिफरेंट प्रेफरेंस के साथ फ्लेक्सिबल रहें।';

  return 'मैं डेस्टिनेशंस, एक्टिविटीज, सीजंस, ट्रांसपोर्ट, अकॉमोडेशन, बजट, सेफ्टी, पैकिंग, वीजा, इंश्योरेंस, और ट्रिप प्लानिंग में हेल्प कर सकता हूँ! आप क्या जानना चाहेंगे?';
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