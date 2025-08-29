// Check if mapToken is available
/*if (!mapToken) {
    console.error('Mapbox token is not available');
    document.getElementById('map').innerHTML = '<p>Map cannot be loaded due to missing token</p>';
} else {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map", // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // map style
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9, // starting zoom
    });

    // Add error handling for map load
    map.on('error', (e) => {
        console.error('Mapbox error:', e);
    });

    map.on('load', () => {
        console.log('Map loaded successfully');
    });

    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
            )
        )
        .addTo(map);
}*/
