if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// Suppress util.isArray deprecation warning from lodash
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('util.isArray')) {
        return; // Suppress this specific warning
    }
    console.warn(warning.name + ': ' + warning.message);
});

// Check for environment variables and provide fallbacks for development
// In production, you should always set these environment variables properly
if (!process.env.MAP_TOKEN) {
    console.warn("⚠️ MAP_TOKEN environment variable is not set! Using dummy value for development.");
    console.warn("ℹ️ For production, please set a real Mapbox token in your .env file.");
    process.env.MAP_TOKEN = "pk.dummy_mapbox_token_for_development_only";
}

// Check Cloudinary credentials
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.warn("⚠️ Cloudinary environment variables are missing! Image uploads will not work.");
    console.warn("ℹ️ For production, please set CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET in your .env file.");
    // Set dummy values for development to prevent crashes
    process.env.CLOUD_NAME = process.env.CLOUD_NAME || "dummy_cloud_name";
    process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "dummy_api_key";
    process.env.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "dummy_api_secret";
}

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// Import OAuth strategies
require("./config/passport");
const Listing = require("./models/listing");
require("dotenv").config();
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const newsletterRouter = require("./routes/newsletter.js");
const notificationRouter = require("./routes/notifications.js");

// Check for MongoDB connection string and provide a fallback for development
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
if (!process.env.ATLAS_DB_URL) {
    console.warn("⚠️ ATLAS_DB_URL environment variable is not set! Using local MongoDB fallback.");
    console.warn("ℹ️ Make sure you have MongoDB running locally or set ATLAS_DB_URL in .env file.");
}
const dbUrl = process.env.ATLAS_DB_URL || MONGO_URL;

// Check for session secret
if (!process.env.SECRET) {
    console.warn("⚠️ SECRET environment variable is not set! Using a default secret (not secure for production).");
    process.env.SECRET = "development_fallback_secret_not_secure_for_production";
}

main()
    .then(() => {
        // Connection success message is handled inside main() function
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    try {
        await mongoose.connect(dbUrl, {
            ssl: process.env.ATLAS_DB_URL ? true : false, // Only use SSL for Atlas connections
            tlsAllowInvalidCertificates: true, // Only for development, remove in production
            tlsAllowInvalidHostnames: true,    // Only for development, remove in production
            serverSelectionTimeoutMS: 5000,    // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,            // Close sockets after 45s of inactivity
        });
        console.log('Successfully connected to MongoDB✅');
        
        // Initialize badge system
        const BadgeDefinition = require('./models/badgeDefinition');
        await BadgeDefinition.initializeDefaults();
        console.log('Badge system initialized✅');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Helmet for security headers - protects against malicious script injection
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://api.mapbox.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://api.mapbox.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "http:", "https://api.mapbox.com", "https://*.tiles.mapbox.com", "https://lh3.googleusercontent.com"],
            connectSrc: ["'self'", "https:", "http:", "https://api.mapbox.com", "https://events.mapbox.com", "https://accounts.google.com"],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["'self'", "blob:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Disable for compatibility with external resources
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Add logging for static file requests in development
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        if (req.url.startsWith('/CSS/') || req.url.startsWith('/JS/')) {
            console.log(`Static file requested: ${req.url}`);
        }
        next();
    });
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevents
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.searchQuery = req.query.search || '';
    next();
});

// Initialize notification system with Socket.io
const notificationController = require('./controllers/notifications');
notificationController.setSocketIO(io);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected to notification system:', socket.id);

    // Handle user authentication for notifications
    socket.on('authenticate', (userId) => {
        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined their notification room`);
        }
    });

    // Handle notification read acknowledgment
    socket.on('notification_read', async (data) => {
        try {
            const { notificationId, userId } = data;
            await notificationController.markAsRead({ params: { id: notificationId }, user: { _id: userId } }, {
                json: (response) => {
                    socket.emit('notification_read_response', response);
                }
            });
        } catch (error) {
            console.error('Error handling notification read:', error);
        }
    });

    // Handle request for unread count
    socket.on('get_unread_count', async (userId) => {
        try {
            const Notification = require('./models/notification');
            const unreadCount = await Notification.getUnreadCount(userId);
            socket.emit('unread_count_update', unreadCount);
        } catch (error) {
            console.error('Error getting unread count:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from notification system:', socket.id);
    });
});

// Make io available globally for other parts of the application
global.io = io;

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/newsletter", newsletterRouter);
app.use("/notifications", notificationRouter);

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});



app.get("/privacy", (req, res) => {
  res.render("privacy", { title: "Privacy Policy" });
});

app.get("/terms", (req, res) => {
  res.render("termCondition", { title: "Term & Condition" });
});

app.get('/debug-listings', async (req, res) => {
  const Listing = require('./models/listing');
  const listings = await Listing.find({}, {
    title: 1,
    createdAt: 1,
    isFeatured: 1,
    hasDiscount: 1,
    avgRating: 1,
    hasFeaturedReview: 1,
    discountPrice: 1
  });
  res.json(listings);
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


const { seedListings } = require('./init/data');
server.listen(8080, async () => {
    await seedListings();
    console.log("Server is running on port 8080");
    console.log("Visit: http://localhost:8080/listings");
    console.log("Real-time notifications enabled ✅");
});
