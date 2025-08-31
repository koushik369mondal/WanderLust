const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Check if required environment variables are set
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.warn("⚠️ Cloudinary environment variables are missing in cloudConfig.js.");
    console.warn("ℹ️ Image uploads will not work properly without valid Cloudinary credentials.");
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "dummy_cloud_name",
    api_key: process.env.CLOUD_API_KEY || "dummy_api_key", 
    api_secret: process.env.CLOUD_API_SECRET || "dummy_api_secret",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});

module.exports = {
    cloudinary,
    storage,
}