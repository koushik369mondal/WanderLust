mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [89.0418, 26.7995], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker()
.setLngLat([12.554729, 55.70651]) //Listing.geometry.coordinates
.addTo(map);