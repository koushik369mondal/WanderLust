require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const destinationRoutes = require("./routes/destinations");
const bookingRoutes = require("./routes/bookings");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/destinations", destinationRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
