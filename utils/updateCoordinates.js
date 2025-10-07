const mongoose = require('mongoose');
const Listing = require('../models/listing');

// Country-based coordinate mappings
const countryCoordinates = {
  'india': [77.2090, 28.6139],
  'united states': [-95.7129, 37.0902],
  'usa': [-95.7129, 37.0902],
  'italy': [12.5674, 41.8719],
  'mexico': [-102.5528, 23.6345],
  'switzerland': [8.2275, 46.8182],
  'tanzania': [34.8888, -6.3690],
  'netherlands': [5.2913, 52.1326],
  'fiji': [179.4144, -16.5780],
  'united kingdom': [-3.4360, 55.3781],
  'uk': [-3.4360, 55.3781],
  'indonesia': [113.9213, -0.7893],
  'canada': [-106.3468, 56.1304],
  'thailand': [100.9925, 15.8700],
  'united arab emirates': [53.8478, 23.4241],
  'greece': [21.8243, 39.0742],
  'costa rica': [-83.7534, 9.7489],
  'japan': [138.2529, 36.2048],
  'maldives': [73.2207, 3.2028]
};

// City-specific coordinates for better accuracy
const cityCoordinates = {
  'new york city': [-74.006, 40.7128],
  'malibu': [-118.7798, 34.0259],
  'aspen': [-106.8175, 39.1911],
  'florence': [11.2558, 43.7696],
  'portland': [-122.6784, 45.5152],
  'cancun': [-86.8515, 21.1619],
  'lake tahoe': [-120.0324, 39.0968],
  'los angeles': [-118.2437, 34.0522],
  'verbier': [7.2284, 46.0963],
  'serengeti national park': [34.8333, -2.3333],
  'amsterdam': [4.9041, 52.3676],
  'fiji': [179.4144, -16.5780],
  'cotswolds': [-1.8094, 51.8330],
  'boston': [-71.0589, 42.3601],
  'bali': [115.0920, -8.4095],
  'banff': [-115.5708, 51.1784],
  'miami': [-80.1918, 25.7617],
  'phuket': [98.3923, 7.8804],
  'scottish highlands': [-4.2026, 57.2707],
  'dubai': [55.2708, 25.2048],
  'montana': [-110.3626, 46.9219],
  'mykonos': [25.3289, 37.4467],
  'costa rica': [-83.7534, 9.7489],
  'charleston': [-79.9311, 32.7765],
  'tokyo': [139.6917, 35.6895],
  'new hampshire': [-71.5376, 43.4525],
  'maldives': [73.2207, 3.2028]
};

async function updateListingCoordinates() {
  try {
    const listings = await Listing.find({});
    let updateCount = 0;

    for (const listing of listings) {
      let coordinates = [77.2090, 28.6139]; // Default Delhi
      
      // Try city-specific coordinates first
      const locationKey = (listing.location || '').toLowerCase();
      if (cityCoordinates[locationKey]) {
        coordinates = cityCoordinates[locationKey];
      } else {
        // Fall back to country coordinates
        const countryKey = (listing.country || '').toLowerCase();
        if (countryCoordinates[countryKey]) {
          coordinates = countryCoordinates[countryKey];
        }
      }

      // Update the listing
      await Listing.findByIdAndUpdate(listing._id, {
        geometry: {
          type: 'Point',
          coordinates: coordinates
        }
      });
      
      updateCount++;
    }

    console.log(`✅ Updated coordinates for ${updateCount} listings`);
  } catch (error) {
    console.error('❌ Error updating coordinates:', error);
  }
}

module.exports = { updateListingCoordinates };