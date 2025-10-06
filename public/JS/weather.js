// Weather widget functionality
class WeatherWidget {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }

    async loadWeatherForListing(listingId, lat, lon) {
        const cacheKey = `${lat}_${lon}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            this.displayWeather(cached.data, listingId);
            return;
        }

        try {
            const response = await fetch(`/weather/current/${lat}/${lon}`);
            const weatherData = await response.json();
            
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            
            this.displayWeather(weatherData, listingId);
        } catch (error) {
            console.error('Weather loading error:', error);
            this.displayFallbackWeather(listingId);
        }
    }

    displayWeather(weather, listingId) {
        const container = document.querySelector(`[data-listing-id="${listingId}"] .weather-widget`);
        if (!container) return;

        const icon = this.getWeatherEmoji(weather.condition);
        
        container.innerHTML = `
            <div class="weather-mini">
                <div class="weather-icon">${icon}</div>
                <div class="weather-temp">${weather.temperature}°C</div>
                <div class="weather-desc">${weather.description}</div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    displayFallbackWeather(listingId) {
        const container = document.querySelector(`[data-listing-id="${listingId}"] .weather-widget`);
        if (!container) return;

        container.innerHTML = `
            <div class="weather-mini">
                <div class="weather-icon">🌤️</div>
                <div class="weather-temp">--°C</div>
                <div class="weather-desc">Weather unavailable</div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    getWeatherEmoji(condition) {
        const conditionMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };
        return conditionMap[condition] || '🌤️';
    }
}

// Initialize weather widget
const weatherWidget = new WeatherWidget();

// Auto-load weather for listings on page load
document.addEventListener('DOMContentLoaded', () => {
    const weatherContainers = document.querySelectorAll('.weather-widget');
    weatherContainers.forEach(container => {
        const listingCard = container.closest('[data-listing-id]');
        if (listingCard) {
            const listingId = listingCard.dataset.listingId;
            const lat = listingCard.dataset.lat;
            const lon = listingCard.dataset.lon;
            
            if (lat && lon) {
                weatherWidget.loadWeatherForListing(listingId, lat, lon);
            }
        }
    });
});