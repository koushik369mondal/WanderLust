// Weather widget functionality for listings
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

// Weather page functionality
class WeatherPage {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
        this.init();
    }

    init() {
        const searchInput = document.getElementById('weatherSearchInput');
        const searchBtn = document.getElementById('weatherSearchBtn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Add some popular destinations for quick access
            this.addPopularDestinations();
        }
    }

    async performSearch() {
        const searchInput = document.getElementById('weatherSearchInput');
        const location = searchInput.value.trim();

        if (!location) {
            this.showError('Please enter a location name');
            return;
        }

        this.showLoading();
        await this.searchWeather(location);
    }

    async searchWeather(location) {
        const cacheKey = `search_${location.toLowerCase()}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            this.displayWeatherData(cached.data);
            return;
        }

        try {
            const response = await fetch(`/weather/search/${encodeURIComponent(location)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather data');
            }

            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            this.displayWeatherData(data);
        } catch (error) {
            console.error('Weather search error:', error);
            this.showError(error.message || 'Unable to fetch weather data. Please try again.');
        }
    }

    displayWeatherData(data) {
        this.hideLoading();
        this.hideError();

        const resultsDiv = document.getElementById('weatherResults');
        resultsDiv.style.display = 'block';

        // Update location info
        document.getElementById('locationName').textContent = data.location.name;
        document.getElementById('locationCountry').textContent = data.location.country;

        // Update current weather
        const current = data.current;
        document.getElementById('currentTemp').textContent = `${current.temperature}°C`;
        document.getElementById('currentCondition').textContent = current.description;
        document.getElementById('currentWeatherIcon').textContent = this.getWeatherEmoji(current.icon);

        // Update details
        document.getElementById('feelsLike').textContent = `${current.feelsLike}°C`;
        document.getElementById('humidity').textContent = `${current.humidity}%`;
        document.getElementById('windSpeed').textContent = `${(current.windSpeed * 3.6).toFixed(1)} km/h`;

        // Mock additional data (in real implementation, get from API)
        document.getElementById('visibility').textContent = '10+ km';
        document.getElementById('pressure').textContent = '1013 hPa';
        document.getElementById('uvIndex').textContent = this.getUVIndex(current.temperature);

        // Update forecast
        this.updateForecast(data.forecast);

        // Update best time to visit
        document.getElementById('bestTimeToVisit').textContent = data.bestTimeToVisit;
    }

    updateForecast(forecast) {
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';

        forecast.forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-icon">${this.getWeatherEmoji(day.icon)}</div>
                <div class="forecast-temp">${day.temperature}°C</div>
                <div class="forecast-condition">${day.description}</div>
            `;
            forecastGrid.appendChild(forecastItem);
        });
    }

    getWeatherEmoji(iconCode) {
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

    getUVIndex(temperature) {
        // Simple UV index estimation based on temperature
        if (temperature >= 30) return 'High (8-10)';
        if (temperature >= 25) return 'Moderate (5-7)';
        if (temperature >= 20) return 'Low (3-4)';
        return 'Very Low (1-2)';
    }

    addPopularDestinations() {
        const popularDestinations = ['Paris', 'Tokyo', 'New York', 'London', 'Dubai', 'Sydney', 'Rome', 'Bangkok'];
        const searchInput = document.getElementById('weatherSearchInput');

        if (searchInput) {
            // Add datalist for autocomplete
            const datalist = document.createElement('datalist');
            datalist.id = 'popularDestinations';

            popularDestinations.forEach(dest => {
                const option = document.createElement('option');
                option.value = dest;
                datalist.appendChild(option);
            });

            searchInput.setAttribute('list', 'popularDestinations');
            searchInput.parentNode.appendChild(datalist);
        }
    }

    showLoading() {
        const loadingDiv = document.getElementById('weatherLoading');
        const errorDiv = document.getElementById('weatherError');
        const resultsDiv = document.getElementById('weatherResults');

        if (loadingDiv) loadingDiv.style.display = 'block';
        if (errorDiv) errorDiv.style.display = 'none';
        if (resultsDiv) resultsDiv.style.display = 'none';
    }

    hideLoading() {
        const loadingDiv = document.getElementById('weatherLoading');
        if (loadingDiv) loadingDiv.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        const resultsDiv = document.getElementById('weatherResults');
        const errorDiv = document.getElementById('weatherError');

        if (resultsDiv) resultsDiv.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'block';
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) errorMessage.textContent = message;
        }
    }

    hideError() {
        const errorDiv = document.getElementById('weatherError');
        if (errorDiv) errorDiv.style.display = 'none';
    }
}

// Initialize weather widget for listings
const weatherWidget = new WeatherWidget();

// Initialize weather page functionality
const weatherPage = new WeatherPage();

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
