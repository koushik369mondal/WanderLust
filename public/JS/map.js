// Check if mapToken is available
if (!mapToken) {
    console.error('Mapbox token is not available');
    document.getElementById('map').innerHTML = '<p>Map cannot be loaded due to missing token</p>';
} else {
    mapboxgl.accessToken = mapToken;

    // Function to get coordinates
    async function getCoordinates() {
        // Check if listing has valid geometry coordinates
        if (listing.geometry && 
            listing.geometry.coordinates && 
            Array.isArray(listing.geometry.coordinates) && 
            listing.geometry.coordinates.length === 2 &&
            !isNaN(listing.geometry.coordinates[0]) && 
            !isNaN(listing.geometry.coordinates[1])) {
            return listing.geometry.coordinates;
        }

        // If no valid coordinates, try to geocode the location
        if (listing.location) {
            try {
                const geocodingClient = mapboxgl.accessToken ? 
                    mapboxgl.accessToken : null;
                
                if (geocodingClient) {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(listing.location + ', ' + (listing.country || ''))}.json?access_token=${mapToken}&limit=1`
                    );
                    const data = await response.json();
                    
                    if (data.features && data.features.length > 0) {
                        return data.features[0].center;
                    }
                }
            } catch (error) {
                console.warn('Geocoding failed:', error);
            }
        }

        // Default to a central location if all else fails
        return [77.2090, 28.6139]; // Delhi, India coordinates
    }

    // Initialize map with coordinates
    getCoordinates().then(coordinates => {
        const map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coordinates,
            zoom: 9,
        });

        // Add error handling for map load
        map.on('error', (e) => {
            console.error('Mapbox error:', e);
        });

        map.on('load', () => {
            console.log('Map loaded successfully');
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
    }).catch(error => {
        console.error('Failed to get coordinates:', error);
        document.getElementById('map').innerHTML = 
            '<p>Unable to load map for this location</p>';
    });
}
