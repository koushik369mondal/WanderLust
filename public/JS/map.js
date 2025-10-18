// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Map.js initializing...');
    
    // Check if mapToken is available
    if (!mapToken) {
        console.error('❌ Mapbox token is not available');
        const mapEl = document.getElementById('map');
        if (mapEl) {
            mapEl.innerHTML = '<div class="alert alert-warning m-3">Map cannot be loaded due to missing token</div>';
        }
        return;
    }
    
    // Check if mapboxgl is loaded
    if (typeof mapboxgl === 'undefined') {
        console.error('❌ Mapbox GL JS library not loaded');
        const mapEl = document.getElementById('map');
        if (mapEl) {
            mapEl.innerHTML = '<div class="alert alert-warning m-3">Map library not loaded</div>';
        }
        return;
    }
    
    console.log('✅ Setting Mapbox access token');
    mapboxgl.accessToken = mapToken;

    // Function to get coordinates
    async function getCoordinates() {
        console.log('🔍 Getting coordinates for listing:', listing.title);
        console.log('📍 Current geometry:', listing.geometry);
        
        // Check if listing has valid geometry coordinates
        if (listing.geometry && 
            listing.geometry.coordinates && 
            Array.isArray(listing.geometry.coordinates) && 
            listing.geometry.coordinates.length === 2 &&
            !isNaN(listing.geometry.coordinates[0]) && 
            !isNaN(listing.geometry.coordinates[1])) {
            console.log('✅ Using stored coordinates:', listing.geometry.coordinates);
            return listing.geometry.coordinates;
        }

        console.log('⚠️ No valid stored coordinates, attempting geocoding...');
        
        // If no valid coordinates, try to geocode the location
        if (listing.location && listing.country) {
            try {
                const query = `${listing.location}, ${listing.country}`;
                console.log('🌍 Geocoding query:', query);
                
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapToken}&limit=1`
                );
                const data = await response.json();
                
                if (data.features && data.features.length > 0) {
                    console.log('✅ Geocoding successful for', query, ':', data.features[0].center);
                    return data.features[0].center;
                } else {
                    console.warn('❌ No geocoding results for:', query);
                }
            } catch (error) {
                console.warn('❌ Geocoding failed:', error);
            }
        }

        // Fallback coordinates based on country
        const countryCoordinates = {
            'United States': [-95.7129, 37.0902],
            'Italy': [12.5674, 41.8719],
            'Mexico': [-102.5528, 23.6345],
            'Switzerland': [8.2275, 46.8182],
            'Tanzania': [34.8888, -6.3690],
            'Netherlands': [5.2913, 52.1326],
            'Fiji': [179.4144, -16.5780],
            'United Kingdom': [-3.4360, 55.3781],
            'Indonesia': [113.9213, -0.7893],
            'Canada': [-106.3468, 56.1304],
            'Thailand': [100.9925, 15.8700],
            'United Arab Emirates': [53.8478, 23.4241],
            'Greece': [21.8243, 39.0742],
            'Costa Rica': [-83.7534, 9.7489],
            'Japan': [138.2529, 36.2048],
            'Maldives': [73.2207, 3.2028]
        };
        
        const coords = countryCoordinates[listing.country] || [77.2090, 28.6139]; // Default to Delhi, India
        console.log('🌏 Using fallback coordinates for', listing.country || 'Unknown Country', ':', coords);
        return coords;
    }

    // Initialize map with coordinates
    getCoordinates().then(coordinates => {
        console.log('🗺️ Final coordinates for map:', coordinates);
        console.log('📍 Map will center on:', coordinates);
        
        const map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coordinates,
            zoom: 9,
        });

        // Add error handling for map load
        map.on('error', (e) => {
            console.error('❌ Mapbox error:', e);
        });

        map.on('load', () => {
            console.log('✅ Map loaded successfully');
        });

        // Create marker
        const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h4>${listing.title}</h4><p>${listing.location || 'Location'}, ${listing.country || ''}</p><p>Exact location will be provided after booking</p>`
                )
            )
            .addTo(map);
            
        console.log('📍 Marker placed at:', coordinates);
    }).catch(error => {
        console.error('❌ Failed to get coordinates:', error);
        const mapEl = document.getElementById('map');
        if (mapEl) {
            mapEl.innerHTML = '<div class="alert alert-warning m-3">Unable to load map for this location</div>';
        }
    });
});
