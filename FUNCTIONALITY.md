# 🌍 WanderLust - Functionality Overview

## Table of Contents

1. [Core Features](#core-features)
2. [User Management](#user-management)
3. [Listing Management](#listing-management)
4. [Travel Planning Tools](#travel-planning-tools)
5. [Social Features](#social-features)
6. [AI Features](#ai-features)
7. [Admin & Security](#admin--security)
8. [Technical Stack](#technical-stack)

---

## Core Features

### Browse & Search

- View all travel destinations with filtering (price, category, location, rating)
- Real-time search suggestions
- 11+ categories (Trending, Mountains, Beaches, Castles, Arctic, Domes, Boats, etc.)
- Interactive Mapbox integration with location markers
- Advanced filtering by multiple criteria

### Image Management

- Cloudinary integration for image storage
- Photo upload with automatic optimization
- Gallery-style viewing

---

## User Management

### Authentication

- **Local Auth**: Email/password signup and login with Passport.js
- **OAuth**: Google sign-in integration
- Secure session management with MongoDB store

### User Profile

- Basic info: Username, email, bio, profile picture, location
- Social links: Website, Instagram, Twitter, LinkedIn
- Travel stats: Countries/cities visited, trips, reviews, listings count
- Hobbies, interests, favorite destinations

### Wishlist & Likes

- Save listings to wishlist with personal notes
- Like/unlike destinations
- View all wishlisted and liked items

---

## Listing Management

### CRUD Operations

- **Create**: Add destinations with title, description, images, price, location, category
- **Read**: View listing details with reviews, ratings, and map
- **Update**: Edit own listings (owner-only)
- **Delete**: Remove listings with cascade delete of reviews

### Features

- Featured/discount badges
- Average ratings and review counts
- AI-generated summaries
- Compare 2-3 destinations side-by-side
- Like counter and owner tracking

---

## Travel Planning Tools

### 1. Trip Planner

- Create trips with destination, dates, travelers, budget type
- Cost estimation: Flights, hotels, activities, food, transport, insurance
- Seasonal pricing adjustments
- Save/edit/delete trips
- PDF download and offline access

### 2. AI Packing List Generator

- Destination and duration-based packing lists
- Travel type specific (Adventure, Beach, Business, Cultural, Family, Solo)
- Categories: Clothing, toiletries, electronics, documents, medical, accessories
- Weather-adapted suggestions
- Customization and checklist functionality

### 3. Weather Information

- Real-time current weather and 5-day forecast
- Temperature, humidity, wind, visibility, pressure
- Search by city or coordinates
- 10-minute caching for performance

### 4. Holiday Calendar

- Country-specific holidays (US, India, UK, Canada, Australia, etc.)
- National, federal, bank, religious holidays
- Festival indicators
- Best time to visit recommendations

### 5. Currency Converter

- Real-time exchange rates for 20+ currencies
- Quick conversion with currency symbols and flags
- Reverse conversion support

### 6. Safety Alerts

- Report scams/unsafe areas with evidence upload (up to 5 files)
- Categories: Overpricing, fraud, theft, transportation/accommodation scams
- Severity levels: Low/Medium/High/Critical
- Community voting and filtering

---

## Social Features

### Reviews & Ratings

- 1-5 star rating system with written reviews
- Edit/delete own reviews
- Average ratings and chronological display

### Achievements & Badges

- **Explorer**: First Trip, 5/10/20 Countries, World Traveler
- **Reviewer**: First Review, 10/50 Reviews, Review Master
- **Host**: First Listing, 5 Listings, Popular Host
- **Social**: Social Butterfly, Helpful Reviewer
- **Milestone**: Early Adopter, Veteran Traveler
- Auto-award with display on profile

### Leaderboard

- Global rankings by points, countries visited, reviews, listings, trips, badges
- Top 50 display with user position

### Travel Journal

- Document memories with title, date, location, description, photos, tags
- Edit/delete entries with chronological sorting
- Privacy controls and export functionality

### Travel Goals

- Set goals (visit countries, complete trips, write reviews, earn badges)
- Progress tracking with target dates
- Mark as completed or delete

### Vacation Planner

- Track annual leave balance
- Monitor used/planned/available days
- Optimal trip timing suggestions

---

## AI Features

### AI Travel Chatbot

- Natural language chat in 20+ languages
- Destination recommendations, travel advice, trip planning help
- Weather queries, cost estimates, activity suggestions
- Voice input/output with text-to-speech
- Context-aware personalized responses

### AI Summaries

- Auto-generated listing summaries from reviews
- Key highlights, pros/cons, target audience identification

### Smart Recommendations

- Personalized suggestions based on user preferences
- "Similar listings" feature
- Trending and seasonal recommendations

### Phrase Assistant

- Translation for 20+ languages
- Travel phrases by category (greetings, directions, food, shopping, emergencies)
- Pronunciation guide with audio playback
- Save favorites for offline access

---

## Admin & Security

### Admin Dashboard

- User growth analytics and demographics
- Listing/review analytics and metrics
- Top destinations and category distribution
- Revenue tracking and performance metrics

### Content Moderation

- Review flagged content (reviews, users, listings)
- User management: View, suspend, delete users, assign roles
- Feature/remove listings with bulk actions

### Security

- Bcrypt password hashing with salt rounds
- CSRF and XSS protection via Helmet.js
- Content Security Policy (CSP) implementation
- Joi and Express Validator for input validation
- Route protection middleware (isLoggedIn, isOwner, isAdmin)

### Performance

- Weather and session caching
- Cloudinary image optimization
- Database indexes and aggregation
- Async/await for non-blocking operations
- Gzip compression

### Notifications

- Real-time Socket.io notifications
- Types: Trip reminders, review responses, achievements, price drops
- Scheduled notifications (daily reminders at 9 AM)
- Mark as read/delete functionality

### Other Utilities

- Newsletter subscription with admin stats
- Search logging for analytics
- Flash messages for user feedback
- Offline PWA features with service workers

---

## Technical Stack

### Backend

- Node.js (v18+), Express.js, MongoDB with Mongoose
- Passport.js (Local & Google OAuth)
- Session: connect-mongo

### Frontend

- EJS templates with ejs-mate
- Bootstrap 5 + Tailwind CSS
- Vanilla JS + jQuery, Font Awesome, Chart.js

### External APIs

- Mapbox (maps), Cloudinary (images), Weather API
- Calendarific (holidays), Exchange Rate API
- OpenAI GPT (optional), Google Translate API (optional)

### Internationalization

- 20+ languages supported (English, Hindi, Bengali, Spanish, French, German, Japanese, Chinese, etc.)
- i18n module with JSON locale files
- Language switcher with cookie persistence
- Locale-specific date/number formats

---

## Environment Variables

- `ATLAS_DB_URL` - MongoDB connection
- `SECRET` - Session secret
- `MAP_TOKEN` - Mapbox API
- `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` - Cloudinary
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- `OPENAI_API_KEY`, `GOOGLE_TRANSLATE_API_KEY`, `HOLIDAY_API_KEY` - Optional APIs
- `PORT` - Server port (default: 8080)

---

**License**: MIT  
**Author**: Kaushik Mandal  
**Project**: GirlScript Summer of Code (GSSoC) 2025
