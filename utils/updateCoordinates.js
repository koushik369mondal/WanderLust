const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

// MongoDB connection
const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function updateListingCoordinates() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        // Find all listings that might need coordinate updates
        const listings = await Listing.find({});
        console.log(`Found ${listings.length} listings to check`);

        let updatedCount = 0;

        for (const listing of listings) {
            try {
                // Check if listing has valid coordinates
                const hasValidCoords = listing.geometry && 
                    listing.geometry.coordinates && 
                    Array.isArray(listing.geometry.coordinates) && 
                    listing.geometry.coordinates.length === 2 &&
                    !isNaN(listing.geometry.coordinates[0]) && 
                    !isNaN(listing.geometry.coordinates[1]) &&
                    // Check if it's not the default NYC coordinates (indicating it was set as fallback)
                    !(listing.geometry.coordinates[0] === -74.006 && listing.geometry.coordinates[1] === 40.7128);

                if (!hasValidCoords && listing.location && geocodingClient) {
                    console.log(`Updating coordinates for: ${listing.title} (${listing.location})`);
                    
                    try {
                        const response = await geocodingClient
                            .forwardGeocode({
                                query: `${listing.location}, ${listing.country || ''}`,
                                limit: 1,
                            })
                            .send();

                        if (response.body.features && response.body.features.length > 0) {
                            listing.geometry = response.body.features[0].geometry;
                            await listing.save();
                            updatedCount++;
                            console.log(`✅ Updated ${listing.title} with coordinates: ${listing.geometry.coordinates}`);
                        } else {
                            console.log(`❌ No coordinates found for ${listing.title} (${listing.location})`);
                        }
                    } catch (geocodeError) {
                        console.log(`❌ Geocoding failed for ${listing.title}: ${geocodeError.message}`);
                    }
                } else if (hasValidCoords) {
                    console.log(`✅ ${listing.title} already has valid coordinates`);
                } else {
                    console.log(`⚠️ ${listing.title} has no location data or geocoding client unavailable`);
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`Error processing ${listing.title}:`, error.message);
            }
        }

        console.log(`\n🎉 Update complete! Updated ${updatedCount} out of ${listings.length} listings.`);
        
    } catch (error) {
        console.error("Error updating coordinates:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

// Run the update script
if (require.main === module) {
    updateListingCoordinates();
}

module.exports = updateListingCoordinates;