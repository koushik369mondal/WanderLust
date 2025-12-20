const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Create indexes for better performance
        mongoose.connection.db.collection("listings").createIndex({ name: "text", description: "text", city: "text", country: "text" });
        mongoose.connection.db.collection("users").createIndex({ email: 1 });
        mongoose.connection.db.collection("listings").createIndex({ category: 1, price: 1 });

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
