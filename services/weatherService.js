// Using built-in fetch instead of axios

class WeatherService {
    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY || 'demo_key';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }

    async getCurrentWeather(lat, lon) {
        const cacheKey = `current_${lat}_${lon}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            const weatherData = {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                windSpeed: data.wind?.speed || 0
            };

            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });

            return weatherData;
        } catch (error) {
            console.error('Weather API error:', error.message);
            return this.getFallbackWeather();
        }
    }

    async getForecast(lat, lon) {
        const cacheKey = `forecast_${lat}_${lon}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            const forecast = data.list.slice(0, 7).map(item => ({
                date: new Date(item.dt * 1000).toLocaleDateString(),
                temperature: Math.round(item.main.temp),
                condition: item.weather[0].main,
                icon: item.weather[0].icon,
                description: item.weather[0].description
            }));

            this.cache.set(cacheKey, {
                data: forecast,
                timestamp: Date.now()
            });

            return forecast;
        } catch (error) {
            console.error('Forecast API error:', error.message);
            return [];
        }
    }

    async getWeatherByLocation(location) {
        try {
            // First, geocode the location to get coordinates
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.apiKey}`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            if (!geocodeData || geocodeData.length === 0) {
                throw new Error('Location not found');
            }

            const { lat, lon, name, country } = geocodeData[0];

            // Get current weather for the coordinates
            const weatherData = await this.getCurrentWeather(lat, lon);
            const forecastData = await this.getForecast(lat, lon);

            return {
                location: {
                    name,
                    country,
                    lat,
                    lon
                },
                current: weatherData,
                forecast: forecastData,
                bestTimeToVisit: this.getBestTimeToVisit(name, country)
            };
        } catch (error) {
            console.error('Weather by location error:', error.message);
            throw error;
        }
    }

    getBestTimeToVisit(location, country) {
        const seasonalData = {
            'italy': 'Spring (Apr-Jun) & Fall (Sep-Oct)',
            'france': 'Spring (Apr-Jun) & Fall (Sep-Nov)',
            'japan': 'Spring (Mar-May) & Fall (Sep-Nov)',
            'thailand': 'Cool Season (Nov-Feb)',
            'india': 'Winter (Oct-Mar)',
            'greece': 'Spring (Apr-Jun) & Fall (Sep-Oct)',
            'spain': 'Spring (Mar-May) & Fall (Sep-Nov)',
            'united states': 'Varies by region - Spring & Fall generally best',
            'canada': 'Summer (Jun-Aug)',
            'australia': 'Spring (Sep-Nov) & Fall (Mar-May)',
            'default': 'Spring & Fall seasons typically ideal'
        };

        const countryKey = country?.toLowerCase() || 'default';
        return seasonalData[countryKey] || seasonalData['default'];
    }

    getFallbackWeather() {
        return {
            temperature: 22,
            feelsLike: 24,
            humidity: 65,
            condition: 'Clear',
            description: 'clear sky',
            icon: '01d',
            windSpeed: 3.5
        };
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌤️';
    }
}

module.exports = new WeatherService();