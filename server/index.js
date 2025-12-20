require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const bookingRoutes = require("./routes/bookings");
const tripRoutes = require("./routes/trips");
const journalRoutes = require("./routes/journal");
const goalRoutes = require("./routes/goals");
const safetyRoutes = require("./routes/safety");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");
const weatherRoutes = require("./routes/weather");
const currencyRoutes = require("./routes/currency");
const holidayRoutes = require("./routes/holidays");
const aiRoutes = require("./routes/ai");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

// Database connection
connectDB();

// Middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                connectSrc: ["'self'", "https://api.mapbox.com", "https:"],
                fontSrc: ["'self'", "https:", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'self'"]
            }
        }
    })
);

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "wanderlust-secret-key-2025",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            touchAfter: 24 * 3600 // lazy session update
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        }
    })
);

// Passport initialization
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Socket.io initialization
initializeSocket(io);
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for real-time connections`);
});
