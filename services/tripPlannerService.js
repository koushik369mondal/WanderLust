/**
 * Trip Planner Service
 * Handles external API integrations for flight, hotel, and activity data
 * Currently uses mock data, but can be easily extended to use real APIs
 */

class TripPlannerService {
    constructor() {
        this.apiKeys = {
            skyscanner: process.env.SKYSCANNER_API_KEY,
            booking: process.env.BOOKING_API_KEY,
            amadeus: process.env.AMADEUS_API_KEY,
            viator: process.env.VIATOR_API_KEY
        };
    }

    /**
     * Get flight prices from multiple sources
     * In production, this would call real APIs like Skyscanner, Amadeus, etc.
     */
    async getFlightPrices(origin, destination, departDate, returnDate, passengers = 1) {
        try {
            // Mock implementation - replace with real API calls
            const mockData = await this.mockFlightAPI(origin, destination, departDate, returnDate, passengers);
            
            // In production, you would call multiple APIs and compare prices:
            // const skyscannerData = await this.callSkyscannerAPI(...);
            // const amadeusData = await this.callAmadeusAPI(...);
            // return this.comparePrices([skyscannerData, amadeusData]);
            
            return mockData;
        } catch (error) {
            console.error('Flight API error:', error);
            throw new Error('Failed to fetch flight prices');
        }
    }

    /**
     * Get hotel prices and availability
     * In production, this would call Booking.com, Hotels.com, etc.
     */
    async getHotelPrices(destination, checkIn, checkOut, guests, roomType = 'standard') {
        try {
            // Mock implementation
            const mockData = await this.mockHotelAPI(destination, checkIn, checkOut, guests, roomType);
            
            // In production:
            // const bookingData = await this.callBookingAPI(...);
            // const hotelsData = await this.callHotelsAPI(...);
            // return this.compareHotelPrices([bookingData, hotelsData]);
            
            return mockData;
        } catch (error) {
            console.error('Hotel API error:', error);
            throw new Error('Failed to fetch hotel prices');
        }
    }

    /**
     * Get activity and tour prices
     * In production, this would call GetYourGuide, Viator, etc.
     */
    async getActivityPrices(destination, duration, travelers, interests = []) {
        try {
            // Mock implementation
            const mockData = await this.mockActivityAPI(destination, duration, travelers, interests);
            
            // In production:
            // const viatorData = await this.callViatorAPI(...);
            // const getYourGuideData = await this.callGetYourGuideAPI(...);
            // return this.compareActivityPrices([viatorData, getYourGuideData]);
            
            return mockData;
        } catch (error) {
            console.error('Activity API error:', error);
            throw new Error('Failed to fetch activity prices');
        }
    }

    /**
     * Get currency exchange rates
     * In production, use exchangerate-api.com or similar
     */
    async getExchangeRates(baseCurrency = 'USD') {
        try {
            // Mock rates - replace with real API
            const mockRates = {
                'USD': { 'EUR': 0.85, 'GBP': 0.73, 'INR': 83.12, 'JPY': 149.50 },
                'EUR': { 'USD': 1.18, 'GBP': 0.86, 'INR': 97.89, 'JPY': 176.19 },
                'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 113.87, 'JPY': 204.93 },
                'INR': { 'USD': 0.012, 'EUR': 0.010, 'GBP': 0.0088, 'JPY': 1.80 }
            };

            return mockRates[baseCurrency] || mockRates['USD'];
        } catch (error) {
            console.error('Exchange rate API error:', error);
            return { 'USD': 1 }; // Fallback
        }
    }

    // Mock API implementations (replace with real API calls in production)
    
    async mockFlightAPI(origin, destination, departDate, returnDate, passengers) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const routes = {
            'New York': { 'Paris': 450, 'Tokyo': 800, 'London': 400, 'Dubai': 600, 'Mumbai': 900 },
            'London': { 'Paris': 150, 'Tokyo': 700, 'New York': 400, 'Dubai': 350, 'Mumbai': 500 },
            'Mumbai': { 'Dubai': 200, 'London': 500, 'Paris': 550, 'Tokyo': 400, 'New York': 900 },
            'Delhi': { 'Dubai': 180, 'London': 480, 'Paris': 520, 'Tokyo': 380, 'New York': 850 }
        };
        
        const basePrice = routes[origin]?.[destination] || 500;
        const variation = Math.random() * 0.4 - 0.2; // ±20% variation
        const seasonalMultiplier = this.getSeasonalMultiplier(new Date(departDate).getMonth());
        
        return {
            price: Math.round(basePrice * (1 + variation) * seasonalMultiplier),
            airline: ['Emirates', 'British Airways', 'Lufthansa', 'Air India', 'Qatar Airways'][Math.floor(Math.random() * 5)],
            duration: `${Math.floor(Math.random() * 10) + 5}h ${Math.floor(Math.random() * 60)}m`,
            stops: Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 2) + 1,
            availability: Math.random() > 0.2,
            bookingClass: ['Economy', 'Premium Economy', 'Business'][Math.floor(Math.random() * 3)],
            baggage: '23kg included',
            refundable: Math.random() > 0.5
        };
    }

    async mockHotelAPI(destination, checkIn, checkOut, guests, roomType) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const hotelTypes = {
            'budget': { 
                name: 'Budget Inn', 
                rating: 2.5, 
                amenities: ['WiFi', 'Breakfast'],
                basePrice: 60
            },
            'standard': { 
                name: 'Comfort Hotel', 
                rating: 4.0, 
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
                basePrice: 120
            },
            'luxury': { 
                name: 'Grand Resort', 
                rating: 4.8, 
                amenities: ['WiFi', 'Spa', 'Pool', 'Concierge', 'Fine Dining'],
                basePrice: 280
            }
        };
        
        const hotel = hotelTypes[roomType] || hotelTypes['standard'];
        const variation = Math.random() * 0.3 - 0.15;
        const destinationMultiplier = this.getDestinationMultiplier(destination);
        
        return {
            pricePerNight: Math.round(hotel.basePrice * (1 + variation) * destinationMultiplier),
            hotelName: hotel.name,
            rating: hotel.rating,
            amenities: hotel.amenities,
            availability: Math.random() > 0.15,
            cancellation: roomType !== 'budget',
            breakfast: hotel.amenities.includes('Breakfast'),
            wifi: true,
            location: 'City Center'
        };
    }

    async mockActivityAPI(destination, duration, travelers, interests) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const activities = {
            'cultural': ['Museum Tour', 'Historical Walk', 'Art Gallery Visit', 'Cultural Show'],
            'adventure': ['Hiking Tour', 'Water Sports', 'Rock Climbing', 'Zip Lining'],
            'food': ['Food Tour', 'Cooking Class', 'Wine Tasting', 'Street Food Walk'],
            'nature': ['Nature Walk', 'Wildlife Safari', 'Botanical Garden', 'Beach Day'],
            'default': ['City Tour', 'Sightseeing', 'Local Experience', 'Photography Walk']
        };
        
        const activityType = interests.length > 0 ? interests[0] : 'default';
        const availableActivities = activities[activityType] || activities['default'];
        
        return {
            averagePrice: Math.round(25 + Math.random() * 75), // $25-100 per activity
            recommendedActivities: availableActivities.slice(0, Math.min(duration, 4)),
            totalActivities: Math.min(duration * 2, 10),
            bookingRequired: Math.random() > 0.3,
            groupDiscount: travelers > 4,
            cancellationPolicy: '24 hours free cancellation'
        };
    }

    getSeasonalMultiplier(month) {
        // Peak season months (summer and winter holidays)
        const peakMonths = [5, 6, 7, 8, 11]; // Jun-Sep, Dec
        return peakMonths.includes(month) ? 1.3 : 0.9;
    }

    getDestinationMultiplier(destination) {
        const multipliers = {
            'Tokyo': 1.4,
            'Paris': 1.3,
            'London': 1.2,
            'Dubai': 1.1,
            'New York': 1.2,
            'Mumbai': 0.6,
            'Delhi': 0.5,
            'Bangkok': 0.7,
            'Singapore': 1.1
        };
        
        return multipliers[destination] || 1.0;
    }

    /**
     * Generate smart recommendations based on trip data
     */
    generateRecommendations(destination, budgetType, month, duration, travelers) {
        const recommendations = [];
        
        // Budget-specific recommendations
        if (budgetType === 'budget') {
            recommendations.push('🏠 Consider hostels or budget hotels for accommodation');
            recommendations.push('🚌 Use public transportation to save on travel costs');
            recommendations.push('🚶 Look for free walking tours and city attractions');
            recommendations.push('🍜 Try local street food for authentic and affordable meals');
        } else if (budgetType === 'luxury') {
            recommendations.push('✈️ Book flights 2-3 months in advance for better deals');
            recommendations.push('🏨 Consider package deals for flights + hotels');
            recommendations.push('🍾 Look for hotel packages that include breakfast and amenities');
        }
        
        // Duration-specific recommendations
        if (duration > 7) {
            recommendations.push('📅 Book longer stays for potential accommodation discounts');
            recommendations.push('🎫 Consider weekly transport passes for better value');
            recommendations.push('🗓️ Plan rest days to avoid burnout and extra costs');
        }
        
        // Seasonal recommendations
        const peakMonths = [5, 6, 7, 8, 11];
        if (peakMonths.includes(month)) {
            recommendations.push('📈 This is peak season - book early for better prices');
            recommendations.push('📉 Consider shoulder season for 20-30% savings');
            recommendations.push('🎪 Expect crowds at popular attractions');
        } else {
            recommendations.push('💰 Great choice! Off-peak season offers better value');
            recommendations.push('🌤️ Weather might be less predictable, pack accordingly');
        }
        
        // Group size recommendations
        if (travelers > 4) {
            recommendations.push('👥 Look for group discounts on activities and tours');
            recommendations.push('🏠 Consider vacation rentals for larger groups');
        }
        
        return recommendations;
    }

    /**
     * Generate money-saving tips
     */
    generateSavingTips(budgetType, duration, seasonalMultiplier, destination) {
        const tips = [];
        
        if (seasonalMultiplier > 1.2) {
            tips.push('💡 Travel in shoulder season to save 20-30%');
            tips.push('💡 Book accommodations with free cancellation for flexibility');
        }
        
        if (budgetType === 'luxury') {
            tips.push('💡 Use travel reward credit cards for points and perks');
            tips.push('💡 Book directly with hotels for potential upgrades');
        }
        
        if (duration > 5) {
            tips.push('💡 Look for weekly accommodation rates');
            tips.push('💡 Cook some meals to reduce food costs');
            tips.push('💡 Use city tourism cards for attraction discounts');
        }
        
        // Universal tips
        tips.push('💡 Compare prices across multiple booking platforms');
        tips.push('💡 Set price alerts for flights and hotels');
        tips.push('💡 Consider travel insurance for peace of mind');
        tips.push('💡 Download offline maps to avoid roaming charges');
        
        return tips;
    }
}

module.exports = new TripPlannerService();