const OpenAI = require('openai');
const weatherService = require('./weatherService');

// Check for OpenAI API key
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('⚠️ OPENAI_API_KEY not set! Packing list generation will use fallback.');
}

class PackingListService {
  /**
   * Generate AI-powered packing list
   * @param {Object} tripData - Trip details
   * @param {String} tripData.destination - Destination location
   * @param {Number} tripData.duration - Trip duration in days
   * @param {String} tripData.travelType - Solo/Couple/Family/Group
   * @param {Array} tripData.activities - List of planned activities
   * @param {String} tripData.season - Current season
   * @returns {Object} - Categorized packing list
   */
  static async generatePackingList(tripData) {
    const { destination, duration, travelType, activities, season } = tripData;

    // Get weather data for the destination
    let weatherData = null;
    try {
      weatherData = await weatherService.getWeatherByLocation(destination);
    } catch (error) {
      console.warn('Weather data unavailable for packing list:', error.message);
    }

    // If OpenAI is available, use AI generation
    if (openai) {
      try {
        return await this.generateWithAI(tripData, weatherData);
      } catch (error) {
        console.error('AI packing list generation failed:', error.message);
        return this.generateFallbackList(tripData, weatherData);
      }
    } else {
      return this.generateFallbackList(tripData, weatherData);
    }
  }

  /**
   * Generate packing list using OpenAI
   */
  static async generateWithAI(tripData, weatherData) {
    const { destination, duration, travelType, activities, season } = tripData;

    // Prepare weather context
    let weatherContext = '';
    if (weatherData) {
      const currentTemp = weatherData.current.temperature;
      const condition = weatherData.current.condition;
      weatherContext = `Current weather: ${currentTemp}°C, ${condition}. `;
      if (weatherData.forecast && weatherData.forecast.length > 0) {
        const avgTemp = Math.round(weatherData.forecast.reduce((sum, day) => sum + day.temperature, 0) / weatherData.forecast.length);
        weatherContext += `Average forecast temperature: ${avgTemp}°C.`;
      }
    }

    const prompt = `Generate a comprehensive packing list for a ${duration}-day trip to ${destination} for ${travelType} travelers planning to do: ${activities.join(', ')}.

${weatherContext}

Please categorize items into these sections:
👕 CLOTHING
🧴 TOILETRIES
🔋 GADGETS
🏕️ ACTIVITY GEAR
🩹 HEALTH & ESSENTIALS

For each category, list specific items with quantities where relevant. Consider:
- Weather conditions and temperature
- Duration of trip
- Type of travel (solo/couple/family/group)
- Planned activities
- Cultural considerations for the destination

Format each item as: "Item Name - Brief reason (quantity if >1)"

Make the list practical and comprehensive but not overwhelming. Focus on essentials first, then activity-specific items.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel assistant specializing in creating personalized packing lists. Be thorough but practical, considering weather, activities, and traveler needs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();

    // Parse AI response into categorized structure
    return this.parseAIResponse(aiResponse, tripData);
  }

  /**
   * Parse AI response into structured categories
   */
  static parseAIResponse(aiResponse, tripData) {
    const categories = {
      clothing: [],
      toiletries: [],
      gadgets: [],
      activityGear: [],
      healthEssentials: []
    };

    const lines = aiResponse.split('\n').filter(line => line.trim());

    let currentCategory = null;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('👕') || lowerLine.includes('clothing')) {
        currentCategory = 'clothing';
      } else if (lowerLine.includes('🧴') || lowerLine.includes('toiletries')) {
        currentCategory = 'toiletries';
      } else if (lowerLine.includes('🔋') || lowerLine.includes('gadgets')) {
        currentCategory = 'gadgets';
      } else if (lowerLine.includes('🏕️') || lowerLine.includes('activity')) {
        currentCategory = 'activityGear';
      } else if (lowerLine.includes('🩹') || lowerLine.includes('health') || lowerLine.includes('essentials')) {
        currentCategory = 'healthEssentials';
      } else if (currentCategory && line.trim() && !line.startsWith('👕') && !line.startsWith('🧴') && !line.startsWith('🔋') && !line.startsWith('🏕️') && !line.startsWith('🩹')) {
        // Clean up the item text
        let item = line.trim();
        item = item.replace(/^[-•*]\s*/, ''); // Remove bullets
        item = item.replace(/\s*\([^)]*\)$/, ''); // Remove trailing parentheses if any
        if (item) {
          categories[currentCategory].push({
            item: item,
            packed: false,
            category: currentCategory
          });
        }
      }
    }

    return {
      destination: tripData.destination,
      duration: tripData.duration,
      travelType: tripData.travelType,
      activities: tripData.activities,
      categories: categories,
      generatedAt: new Date(),
      weatherConsidered: !!tripData.weatherData
    };
  }

  /**
   * Generate fallback packing list when AI is unavailable
   */
  static generateFallbackList(tripData, weatherData) {
    const { destination, duration, travelType, activities } = tripData;

    // Determine weather-based items
    let weatherItems = [];
    if (weatherData) {
      const temp = weatherData.current.temperature;
      if (temp < 10) {
        weatherItems = ['Warm jacket', 'Thermal underwear', 'Gloves', 'Beanie', 'Scarf'];
      } else if (temp < 20) {
        weatherItems = ['Light jacket', 'Long sleeve shirts', 'Sweater'];
      } else if (temp > 30) {
        weatherItems = ['Sunglasses', 'Hat', 'Light clothing', 'Sunscreen'];
      }

      if (weatherData.current.condition.toLowerCase().includes('rain')) {
        weatherItems.push('Rain jacket', 'Umbrella');
      }
    }

    // Activity-specific items
    const activityItems = [];
    if (activities.some(a => a.toLowerCase().includes('beach'))) {
      activityItems.push('Swimsuit', 'Beach towel', 'Flip-flops', 'Sunscreen');
    }
    if (activities.some(a => a.toLowerCase().includes('trek') || a.toLowerCase().includes('hike'))) {
      activityItems.push('Hiking boots', 'Backpack', 'Water bottle', 'Sunscreen');
    }
    if (activities.some(a => a.toLowerCase().includes('business'))) {
      activityItems.push('Formal attire', 'Business cards', 'Laptop');
    }

    const categories = {
      clothing: [
        { item: 'Underwear', packed: false, category: 'clothing' },
        { item: 'Socks', packed: false, category: 'clothing' },
        { item: 'T-shirts', packed: false, category: 'clothing' },
        { item: 'Pants/Shorts', packed: false, category: 'clothing' },
        ...weatherItems.map(item => ({ item, packed: false, category: 'clothing' }))
      ],
      toiletries: [
        { item: 'Toothbrush & toothpaste', packed: false, category: 'toiletries' },
        { item: 'Shampoo & conditioner', packed: false, category: 'toiletries' },
        { item: 'Body wash/soap', packed: false, category: 'toiletries' },
        { item: 'Deodorant', packed: false, category: 'toiletries' },
        { item: 'Skincare products', packed: false, category: 'toiletries' }
      ],
      gadgets: [
        { item: 'Phone & charger', packed: false, category: 'gadgets' },
        { item: 'Power adapter', packed: false, category: 'gadgets' },
        { item: 'Camera (optional)', packed: false, category: 'gadgets' }
      ],
      activityGear: [
        ...activityItems.map(item => ({ item, packed: false, category: 'activityGear' }))
      ],
      healthEssentials: [
        { item: 'Medications', packed: false, category: 'healthEssentials' },
        { item: 'First aid kit', packed: false, category: 'healthEssentials' },
        { item: 'Sunscreen', packed: false, category: 'healthEssentials' },
        { item: 'Insect repellent', packed: false, category: 'healthEssentials' },
        { item: 'Travel insurance documents', packed: false, category: 'healthEssentials' }
      ]
    };

    return {
      destination: tripData.destination,
      duration: tripData.duration,
      travelType: tripData.travelType,
      activities: tripData.activities,
      categories: categories,
      generatedAt: new Date(),
      weatherConsidered: !!weatherData,
      fallback: true
    };
  }

  /**
   * Validate packing list data
   */
  static validateTripData(tripData) {
    const errors = [];

    if (!tripData.destination || tripData.destination.trim().length < 2) {
      errors.push('Destination is required and must be at least 2 characters');
    }

    if (!tripData.duration || tripData.duration < 1 || tripData.duration > 365) {
      errors.push('Duration must be between 1 and 365 days');
    }

    if (!tripData.travelType || !['solo', 'couple', 'family', 'group'].includes(tripData.travelType)) {
      errors.push('Travel type must be one of: solo, couple, family, group');
    }

    if (!tripData.activities || !Array.isArray(tripData.activities) || tripData.activities.length === 0) {
      errors.push('At least one activity must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = PackingListService;
