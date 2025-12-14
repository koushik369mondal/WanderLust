# 🌍 WanderLust - Complete Functionality Documentation

## Table of Contents

1. [Core Features](#core-features)
2. [User Management](#user-management)
3. [Listing Management](#listing-management)
4. [Travel Planning Tools](#travel-planning-tools)
5. [Social & Community Features](#social--community-features)
6. [AI-Powered Features](#ai-powered-features)
7. [Utility Features](#utility-features)
8. [Admin Features](#admin-features)
9. [Security & Performance](#security--performance)
10. [Internationalization](#internationalization)

---

## Core Features

### 1. Browse & Search Destinations

- **Browse Listings**: View all travel destinations with detailed information
- **Search Functionality**: Search destinations by name, location, or keywords
- **Search Suggestions**: Real-time search suggestions as you type
- **Advanced Filtering**: Filter listings by:
  - Price range
  - Category (Trending, Mountains, Beaches, Castles, etc.)
  - Location/Country
  - Rating
  - Featured status
- **Category-Based Navigation**: 11+ categories including:
  - Trending
  - Iconic Cities
  - Mountains
  - Amazing Pools
  - Camping
  - Farms
  - Arctic
  - Domes
  - Boats
  - Castles
  - Rooms

### 2. Interactive Maps

- **Mapbox Integration**: Interactive maps showing destination locations
- **Precise Location Markers**: Visual pins on map for each listing
- **Geolocation Support**: Coordinate-based location tracking
- **Map Controls**: Zoom, pan, and explore destinations geographically

### 3. Image Management

- **Cloudinary Integration**: Professional cloud-based image storage
- **Photo Uploads**: Upload high-quality destination images
- **Image Optimization**: Automatic image compression and optimization
- **Multiple Image Support**: Gallery-style image viewing

---

## User Management

### Authentication & Authorization

#### Local Authentication

- **User Registration**: Email and password-based signup
- **Secure Login**: Passport.js-based authentication
- **Password Security**: Encrypted password storage
- **Session Management**: Persistent login sessions with MongoDB store
- **Logout Functionality**: Secure session termination

#### OAuth Integration

- **Google OAuth**: Sign in/up with Google account
- **Social Profile Sync**: Automatic profile picture and name import
- **Seamless Integration**: One-click social authentication

### User Profile Management

#### Basic Profile

- **Username & Email**: Primary account information
- **Display Name**: Customizable display name
- **Profile Picture**: Upload or use OAuth profile image
- **Bio**: Personal description (500 characters max)
- **Location**: Current location information
- **Join Date**: Account creation timestamp

#### Extended Profile

- **Hobbies**: List personal hobbies
- **Interests**: Travel interests and preferences
- **Social Links**: Connect multiple platforms:
  - Website
  - Instagram
  - Twitter
  - LinkedIn
- **Favorite Destinations**: Curated list of preferred locations

#### Travel Statistics

- **Countries Visited**: Counter for countries explored
- **Cities Visited**: Total cities traveled to
- **Total Trips**: Number of completed trips
- **Total Reviews**: Reviews written count
- **Total Listings**: Destinations shared count

### Wishlist System

- **Add to Wishlist**: Save listings for future reference
- **Personal Notes**: Add notes to wishlist items (200 characters)
- **Added Date**: Track when items were wishlisted
- **Remove from Wishlist**: Manage wishlist items
- **View Wishlist**: Dedicated wishlist page with all saved items

### Like System

- **Like Listings**: Express interest in destinations
- **Unlike Functionality**: Remove likes
- **View Liked Listings**: See all liked destinations
- **Like Counter**: Track total likes per listing

---

## Listing Management

### Create Listings

- **Add New Destination**: Share travel experiences
- **Required Information**:
  - Title
  - Description
  - Image upload
  - Price
  - Location
  - Country
  - Category
- **Optional Information**:
  - Best season to visit
  - Travel tips
  - Coordinates (for map placement)
- **Image Upload**: Single or multiple images via Cloudinary
- **Owner Tracking**: Automatic association with creator

### Edit Listings

- **Owner-Only Editing**: Only listing owner can modify
- **Update Information**: Change any listing details
- **Image Replacement**: Upload new images
- **Validation**: Server-side validation with Joi schema

### Delete Listings

- **Owner-Only Deletion**: Authorized deletion controls
- **Cascade Delete**: Automatically removes associated reviews
- **Confirmation Required**: Prevent accidental deletions

### Listing Features

- **Featured Listings**: Premium highlighted destinations
- **Discount System**:
  - Mark listings as discounted
  - Display discount price
  - Special badges for discounts
- **Average Rating Display**: Calculated from reviews
- **Review Count**: Show number of reviews
- **Created Date**: Track listing age
- **AI Summary**: AI-generated destination summary (optional)

### Comparison Tool

- **Compare Destinations**: Side-by-side comparison of 2-3 listings
- **Comparison Metrics**:
  - Price (including tax)
  - Average rating
  - Number of reviews
  - Amenities
  - Features
  - Location
- **Visual Comparison**: Easy-to-read comparison table

---

## Travel Planning Tools

### 1. Trip Planner

#### Trip Creation

- **Destination Selection**: Choose from available listings
- **Date Range**: Set start and end dates
- **Traveler Count**: Specify number of travelers
- **Budget Type**: Select budget level (Budget/Moderate/Luxury)
- **Departure City**: Specify origin for accurate cost estimates

#### Cost Estimation

- **Flight Prices**: Estimated airfare costs
- **Hotel Prices**: Accommodation cost estimates by budget type
- **Activity Prices**: Based on trip type and duration
- **Food & Dining**: Daily meal cost estimates
- **Local Transport**: Transportation cost calculations
- **Travel Insurance**: Insurance cost estimates
- **Seasonal Pricing**: Dynamic pricing based on travel season
- **Total Cost Breakdown**: Comprehensive expense summary

#### Trip Management

- **Save Trips**: Store trip plans in user account
- **My Trips**: View all saved trip plans
- **Trip Status**: Planned/In Progress/Completed tracking
- **Edit Trips**: Modify trip details
- **Delete Trips**: Remove trip plans
- **PDF Generation**: Download trip itinerary as PDF
- **Offline Access**: Save trips for offline viewing

### 2. AI-Powered Packing List Generator

#### Smart Packing Lists

- **Destination-Based**: Customized for specific locations
- **Duration-Aware**: Adjusted for trip length
- **Travel Type Specific**: Different lists for:
  - Adventure
  - Beach
  - Business
  - Cultural
  - Family
  - Solo
- **Activity-Based**: Tailored to planned activities
- **Weather Integration**: Adapts to destination weather

#### Packing Categories

- **Clothing**: Season and activity-appropriate clothes
- **Toiletries**: Essential personal care items
- **Electronics**: Devices and accessories
- **Documents**: Required papers and IDs
- **Medical**: First aid and medications
- **Accessories**: Travel accessories and gear

#### Packing List Features

- **AI Generation**: Intelligent list creation
- **Customization**: Add/remove items
- **Save to Trip**: Attach list to trip plans
- **Print/Download**: Export packing list
- **Checklist Functionality**: Mark items as packed

### 3. Weather Information System

#### Weather Data

- **Current Weather**: Real-time weather conditions
- **Temperature**: Current and feels-like temperature
- **Weather Conditions**: Clear, cloudy, rainy, etc.
- **Humidity**: Moisture level percentage
- **Wind Speed**: Wind velocity information
- **Visibility**: Atmospheric visibility range
- **Pressure**: Atmospheric pressure data

#### Forecast System

- **5-Day Forecast**: Extended weather predictions
- **Hourly Forecasts**: Detailed hourly breakdowns
- **High/Low Temperatures**: Daily temperature ranges
- **Precipitation**: Rain/snow probability
- **Weather Icons**: Visual weather representations

#### Location Features

- **Search by City**: Find weather for any destination
- **Coordinate-Based**: Weather by latitude/longitude
- **Destination List**: Quick access to popular locations
- **Weather Caching**: 10-minute cache for performance

### 4. Holiday Calendar

#### Holiday Information

- **Country-Specific**: Holidays for multiple countries
- **Year Selection**: View any year's holidays
- **Holiday Types**:
  - National holidays
  - Federal holidays
  - Bank holidays
  - Religious holidays
  - Provincial/State holidays
- **Festival Indicators**: Mark special celebrations

#### Supported Countries

- United States
- India
- United Kingdom
- Canada
- Australia
- France
- Germany
- Spain
- Italy
- Japan
- And more...

#### Planning Features

- **Best Time to Visit**: Identify ideal travel periods
- **Avoid Crowds**: Plan around major holidays
- **Festival Tourism**: Find cultural celebrations
- **Calendar View**: Visual monthly calendar
- **Event Details**: Holiday descriptions and significance

### 5. Currency Converter

#### Currency Features

- **Real-Time Rates**: Live exchange rate data
- **20+ Currencies**: Major world currencies including:
  - USD, EUR, GBP, INR, JPY
  - CAD, AUD, CHF, CNY, KRW
  - BRL, MXN, SGD, HKD, NZD
  - SEK, NOK, DKK, PLN, CZK
- **Quick Conversion**: Instant calculation
- **Rate Display**: Show current exchange rates
- **Amount Input**: Convert any amount
- **Reverse Conversion**: Swap currencies easily

#### Currency Information

- **Currency Symbols**: Display proper symbols
- **Country Flags**: Visual country identification
- **Full Currency Names**: Detailed currency information
- **Historical Context**: Rate timestamps

### 6. Safety Alerts & Scam Reports

#### Report System

- **Create Reports**: Submit safety alerts
- **Report Categories**:
  - Overpricing
  - Fake Guide
  - Fraud
  - Theft
  - Unsafe Area
  - Transportation Scam
  - Accommodation Scam
  - Tour Scam
  - Other
- **Severity Levels**: Low/Medium/High/Critical
- **Evidence Upload**: Attach up to 5 photos/documents
- **Location Details**: Specific location and country
- **Incident Date**: When the incident occurred

#### Community Safety

- **View All Reports**: Browse safety alerts
- **Filter by Location**: Find reports for destinations
- **Severity Filtering**: Sort by danger level
- **Date Filtering**: Recent vs. older reports
- **Edit Reports**: Update your submissions
- **Delete Reports**: Remove resolved alerts
- **Community Votes**: Vote on report validity

#### Validation

- **Title Length**: 5-200 characters
- **Description**: 20-2000 characters
- **Date Limits**: Last 1 year only
- **Future Date Prevention**: No future dates
- **Required Fields**: Ensure complete reports

---

## Social & Community Features

### 1. Reviews & Ratings System

#### Create Reviews

- **Star Ratings**: 1-5 star system
- **Written Reviews**: Detailed text feedback
- **Timestamp**: Automatic date tracking
- **Author Attribution**: Linked to user profile
- **Listing Association**: Connected to specific destinations

#### Review Management

- **Edit Reviews**: Modify your reviews
- **Delete Reviews**: Remove reviews
- **Owner Restrictions**: Can't review own listings
- **Login Required**: Authentication for reviews

#### Review Display

- **Average Rating**: Calculated aggregate score
- **Review Count**: Total number of reviews
- **Individual Reviews**: All reviews listed
- **Newest First**: Chronological ordering
- **User Info**: Reviewer name and join date

### 2. Achievements & Badges System

#### Badge Categories

- **Explorer Badges**: Travel milestones
  - First Trip
  - 5 Countries
  - 10 Countries
  - 20 Countries
  - World Traveler
- **Reviewer Badges**: Review contributions
  - First Review
  - 10 Reviews
  - 50 Reviews
  - Review Master
- **Host Badges**: Listing creation
  - First Listing
  - 5 Listings
  - Popular Host
- **Social Badges**: Community engagement
  - Social Butterfly
  - Helpful Reviewer
- **Milestone Badges**: Special achievements
  - Early Adopter
  - Veteran Traveler

#### Badge Features

- **Auto-Award**: Automatic badge earning
- **Badge Display**: Show on profile
- **Earned Date**: Track when awarded
- **Badge Icons**: Visual representations
- **Badge Descriptions**: Achievement details

### 3. Leaderboard System

#### Ranking Metrics

- **Total Points**: Comprehensive scoring
- **Countries Visited**: Travel breadth
- **Total Reviews**: Contribution count
- **Total Listings**: Host activity
- **Total Trips**: Trip planning usage
- **Badge Count**: Achievement collection

#### Leaderboard Features

- **Global Ranking**: See top travelers
- **User Position**: Your rank
- **Top 50 Display**: Leading users
- **Real-Time Updates**: Dynamic rankings
- **Profile Links**: View top users' profiles

### 4. Travel Journal

#### Memory Creation

- **Add Memories**: Document travel experiences
- **Title & Date**: Memory identification
- **Location**: Where memory occurred
- **Description**: Detailed story (2000 characters)
- **Photo Upload**: Visual memories
- **Tags**: Categorize memories

#### Journal Management

- **View All Memories**: Personal travel diary
- **Edit Memories**: Update entries
- **Delete Memories**: Remove entries
- **Chronological Order**: Time-based sorting
- **Search Memories**: Find specific entries

#### Sharing

- **Privacy Controls**: Public/private memories
- **Share with Friends**: Social sharing
- **Export Journal**: Download memories

### 5. Travel Goals System

#### Goal Setting

- **Create Goals**: Set travel objectives
- **Goal Types**:
  - Visit specific countries
  - Complete trips
  - Write reviews
  - Create listings
  - Earn badges
- **Target Date**: Goal deadline
- **Progress Tracking**: Completion percentage

#### Goal Management

- **View Goals**: See all active goals
- **Complete Goals**: Mark as achieved
- **Delete Goals**: Remove goals
- **Goal Statistics**: Success metrics

### 6. Vacation Slots Planner

#### Time Management

- **Annual Leave Tracking**: Monitor available vacation days
- **Leave Balance**: Current days remaining
- **Used Days**: Track consumed vacation
- **Planned Days**: Reserved for trips
- **Available Days**: Calculate remaining leave

#### Planning Features

- **Optimal Trip Timing**: Suggest best dates
- **Leave Requests**: Plan around work
- **Public Holidays**: Maximize long weekends
- **Travel Windows**: Identify available periods

---

## AI-Powered Features

### 1. AI Travel Chatbot

#### Conversational AI

- **Natural Language**: Chat in plain language
- **Multi-Language Support**: 20+ languages
- **Context Awareness**: Remember conversation
- **Personalized Responses**: Based on user history

#### Chatbot Capabilities

- **Destination Recommendations**: Suggest places
- **Travel Advice**: Answer travel questions
- **Trip Planning Help**: Assist with itineraries
- **Local Information**: Culture, customs, tips
- **Weather Queries**: Current conditions
- **Cost Estimates**: Budget calculations
- **Activity Suggestions**: Based on preferences
- **Restaurant Recommendations**: Food suggestions
- **Transportation Advice**: Getting around tips
- **Safety Information**: Travel warnings

#### Voice Features

- **Voice Input**: Speak your questions
- **Text-to-Speech**: Hear responses
- **Voice Commands**: Hands-free interaction
- **Multi-Language Voice**: Various accents

#### Knowledge Base

- **Destination Database**: Comprehensive info
- **Activity Categories**: Adventure, culture, food, etc.
- **Seasonal Advice**: Best times to visit
- **Transport Options**: Flights, trains, buses, cars
- **Accommodation Types**: Hotels, hostels, Airbnb, resorts
- **Budget Guidance**: All price ranges
- **Cultural Tips**: Local customs and etiquette

### 2. AI Listing Summaries

#### Auto-Generated Summaries

- **Review Analysis**: Synthesize user feedback
- **Key Highlights**: Extract main features
- **Pros & Cons**: Balanced overview
- **Best For**: Target audience identification
- **Updated Summaries**: Refresh with new reviews

### 3. Smart Recommendations

#### Personalized Suggestions

- **User Preference Learning**: Adapt to tastes
- **Similar Listings**: "You might also like"
- **Based on History**: Past searches and bookings
- **Trending Destinations**: Popular locations
- **Seasonal Recommendations**: Time-appropriate suggestions

### 4. Phrase Assistant (Translation)

#### Language Translation

- **20+ Languages**: Extensive language support
- **Travel Phrases**: Essential expressions
- **Context-Aware**: Situation-specific phrases
- **Pronunciation Guide**: How to say phrases
- **Audio Playback**: Hear correct pronunciation

#### Phrase Categories

- **Greetings**: Hello, goodbye, etc.
- **Directions**: Getting around
- **Food & Dining**: Restaurant phrases
- **Shopping**: Bargaining and purchases
- **Emergencies**: Help, police, hospital
- **Accommodation**: Hotel phrases
- **Transportation**: Taxi, bus, train
- **Numbers & Time**: Essential counting

#### Features

- **Save Favorites**: Store useful phrases
- **Offline Access**: Download for offline use
- **Copy to Clipboard**: Easy sharing
- **Phrase History**: Recently used phrases

---

## Utility Features

### 1. Notification System

#### Real-Time Notifications

- **Socket.io Integration**: Live updates
- **Instant Delivery**: No page refresh needed
- **User-Specific**: Personal notification rooms
- **Badge Counter**: Unread count display

#### Notification Types

- **Trip Reminders**: Upcoming trip alerts
- **Review Responses**: Replies to your reviews
- **Listing Updates**: Changes to wishlisted items
- **Achievement Unlocks**: New badges earned
- **System Announcements**: Platform updates
- **Friendship Requests**: Social connections
- **Price Drops**: Wishlist item discounts

#### Notification Management

- **View All**: Notification center
- **Mark as Read**: Individual or bulk
- **Delete Notifications**: Remove old items
- **Notification Preferences**: Customize alerts
- **Email Notifications**: Optional email alerts

#### Scheduled Notifications

- **Daily Reminders**: 9 AM cron job
- **Pre-Trip Reminders**: 1 week before
- **Post-Trip Follow-ups**: Review requests
- **Goal Deadlines**: Approaching targets

### 2. Newsletter System

#### Subscription Management

- **Email Subscription**: Join mailing list
- **Unsubscribe**: One-click opt-out
- **Preference Center**: Choose content types
- **Double Opt-in**: Confirm subscriptions

#### Newsletter Features

- **Travel Tips**: Expert advice emails
- **Destination Highlights**: Featured locations
- **Special Offers**: Exclusive deals
- **Community Stories**: User experiences
- **New Features**: Platform updates

#### Admin Features

- **Subscriber Stats**: Total subscribers
- **Engagement Metrics**: Open rates, clicks
- **Campaign Management**: Send newsletters
- **Segmentation**: Targeted emails

### 3. Search Logging

#### Analytics

- **Search Tracking**: Log all searches
- **Popular Queries**: Trending searches
- **No Results Tracking**: Failed searches
- **Improvement Data**: Enhance search algorithm

### 4. Flash Messages

#### User Feedback

- **Success Messages**: Confirm actions
- **Error Messages**: Explain failures
- **Warning Messages**: Caution users
- **Info Messages**: General information
- **Auto-Dismiss**: Temporary display
- **Styled Alerts**: Bootstrap integration

### 5. Offline Features

#### Progressive Web App (PWA)

- **Offline Access**: View cached content
- **Trip PDF Download**: Save for offline
- **Local Storage**: Store trip data
- **Service Workers**: Background sync

---

## Admin Features

### 1. Admin Dashboard

#### Access Control

- **Admin Role**: Special user flag (isAdmin)
- **Protected Routes**: Admin-only access
- **Dashboard View**: Comprehensive overview
- **Analytics Display**: Charts and graphs

### 2. Analytics & Metrics

#### User Analytics

- **User Growth**: Monthly registration trends
- **Total Users**: Current user count
- **Active Users**: Recently active
- **User Demographics**: Location data
- **User Engagement**: Activity metrics

#### Listing Analytics

- **Total Listings**: Platform inventory
- **New Listings**: Recent additions
- **Top Destinations**: Most popular locations
- **Category Distribution**: Listing breakdown
- **Price Ranges**: Pricing analytics
- **Featured Listings**: Premium count

#### Review Analytics

- **Total Reviews**: Platform reviews
- **Average Rating**: Overall platform rating
- **Review Distribution**: Star rating breakdown
- **Top Reviewers**: Most active users
- **Recent Reviews**: Latest feedback

#### Revenue & Performance

- **Booking Metrics**: Conversion rates
- **Revenue Tracking**: Financial overview
- **Popular Seasons**: Peak times
- **Geographic Trends**: Location performance

### 3. Content Moderation

#### Report Review

- **Review Reports**: Flagged content
- **User Reports**: Suspicious accounts
- **Listing Reports**: Problematic listings
- **Moderation Actions**: Approve/reject/delete

#### User Management

- **View All Users**: User directory
- **Edit User Roles**: Assign admin rights
- **Suspend Users**: Temporary bans
- **Delete Users**: Remove accounts
- **Reset Passwords**: Admin password resets

#### Listing Management

- **Feature Listings**: Promote destinations
- **Remove Listings**: Delete violations
- **Edit Any Listing**: Admin privileges
- **Bulk Actions**: Mass operations

### 4. System Management

#### Configuration

- **Platform Settings**: Global configurations
- **Feature Flags**: Enable/disable features
- **API Management**: External service keys
- **Maintenance Mode**: Temporary shutdown

#### Database Tools

- **Direct Admin Access**: Special route (/direct-admin)
- **Test Login**: Authentication testing
- **Data Export**: Backup functionality
- **Data Import**: Bulk data upload

---

## Security & Performance

### 1. Security Features

#### Authentication Security

- **Password Hashing**: Bcrypt encryption
- **Salt Rounds**: Secure password storage
- **Session Encryption**: Encrypted session data
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Helmet.js integration

#### Content Security Policy (CSP)

- **Script Sources**: Whitelisted origins
- **Style Sources**: Approved stylesheets
- **Image Sources**: Allowed domains
- **Font Sources**: Trusted font providers
- **Connection Sources**: API endpoints

#### Input Validation

- **Joi Schemas**: Server-side validation
- **Express Validator**: Field validation
- **Sanitization**: Clean user input
- **Length Limits**: Prevent overflow
- **Type Checking**: Ensure data types

#### Route Protection

- **isLoggedIn Middleware**: Authentication check
- **isOwner Middleware**: Authorization check
- **isAdmin Middleware**: Admin verification
- **saveRedirectUrl**: Post-login redirect

### 2. Performance Optimization

#### Caching

- **Weather Cache**: 10-minute cache duration
- **Session Store**: MongoDB session caching
- **Static Assets**: Express static file serving
- **Browser Caching**: Client-side caching headers

#### Database Optimization

- **Mongoose ODM**: Optimized queries
- **Indexes**: Fast lookups
- **Aggregation**: Efficient data processing
- **Populate**: Selective field loading
- **Lean Queries**: Minimal overhead

#### Image Optimization

- **Cloudinary**: Automatic compression
- **Responsive Images**: Multiple sizes
- **Lazy Loading**: On-demand loading
- **Format Conversion**: WebP support

#### Code Optimization

- **Async/Await**: Non-blocking operations
- **Error Handling**: Graceful failures
- **Connection Pooling**: Database efficiency
- **Compression**: Gzip responses

### 3. Error Handling

#### Custom Error Pages

- **404 Page**: Not found errors
- **500 Page**: Server errors
- **Custom Messages**: User-friendly errors
- **Error Logging**: Console tracking

#### Error Middleware

- **ExpressError Class**: Custom error handling
- **wrapAsync**: Async error catching
- **Global Handler**: Catch all errors
- **Stack Traces**: Development debugging

---

## Internationalization

### 1. Multi-Language Support

#### Supported Languages

- **English** (en) 🇺🇸
- **Hindi** (hi) 🇮🇳
- **Bengali** (bn) 🇧🇩
- **Telugu** (te) 🇮🇳
- **Marathi** (mr) 🇮🇳
- **Tamil** (ta) 🇮🇳
- **Gujarati** (gu) 🇮🇳
- **Kannada** (kn) 🇮🇳
- **Malayalam** (ml) 🇮🇳
- **Punjabi** (pa) 🇮🇳
- **Odia** (or) 🇮🇳
- **Assamese** (as) 🇮🇳
- **Urdu** (ur) 🇮🇳
- **Spanish** (es) 🇪🇸
- **French** (fr) 🇫🇷
- **German** (de) 🇩🇪
- **Japanese** (ja) 🇯🇵
- **Chinese** (zh) 🇨🇳
- **Italian** (it) 🇮🇹
- **Portuguese** (pt) 🇵🇹

### 2. i18n Features

#### Translation System

- **i18n Module**: Node.js internationalization
- **JSON Locale Files**: Translation storage
- **Auto-Reload**: Dynamic translation updates
- **Query Parameter**: ?lang=xx for language switch
- **Cookie Storage**: Remember language preference
- **Default Locale**: English fallback

#### Language Switcher

- **Dropdown Menu**: Easy language selection
- **Flag Icons**: Visual language identification
- **Native Names**: Languages in native script
- **Persistent Selection**: Cookie-based memory

#### Translated Content

- **UI Elements**: All interface text
- **Navigation**: Menu items
- **Forms**: Labels and placeholders
- **Buttons**: Action labels
- **Messages**: Success/error notifications
- **Static Pages**: About, Privacy, Terms

### 3. Localization

#### Regional Settings

- **Date Formats**: Locale-specific dates
- **Number Formats**: Regional number display
- **Currency Symbols**: Local currency
- **Time Zones**: User timezone support

---

## Technical Architecture

### 1. Technology Stack

#### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Session Store**: connect-mongo
- **Authentication**: Passport.js (Local & OAuth)

#### Frontend

- **Template Engine**: EJS with ejs-mate
- **CSS Framework**: Bootstrap 5 + Tailwind CSS
- **JavaScript**: Vanilla JS + jQuery
- **Icons**: Font Awesome
- **Charts**: Chart.js

#### External Services

- **Maps**: Mapbox API
- **Images**: Cloudinary
- **Weather**: Weather API
- **Holidays**: Calendarific API
- **Currency**: Exchange Rate API
- **AI**: OpenAI GPT (optional)
- **Translation**: Google Translate API (optional)

### 2. Project Structure

```
WanderLust/
├── controllers/        # Route controllers
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   ├── notifications.js
│   ├── newsletter.js
│   ├── phraseAssistant.js
│   └── scams.js
├── models/            # MongoDB schemas
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   ├── notification.js
│   ├── newsletter.js
│   ├── phrase.js
│   ├── scamReport.js
│   ├── searchLog.js
│   ├── wishlist.js
│   └── badgeDefinition.js
├── routes/            # Route definitions
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   ├── admin.js
│   ├── chatbot.js
│   ├── compare.js
│   ├── currency.js
│   ├── holiday.js
│   ├── notifications.js
│   ├── newsletter.js
│   ├── packingList.js
│   ├── phraseAssistant.js
│   ├── safety.js
│   ├── tripPlanner.js
│   └── weather.js
├── views/             # EJS templates
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   ├── users/
│   ├── admin/
│   └── [other views]
├── public/            # Static assets
│   ├── CSS/
│   ├── JS/
│   └── images/
├── utils/             # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
├── services/          # Business logic
│   ├── tripPlannerService.js
│   ├── weatherService.js
│   ├── packingListService.js
│   └── notificationServiceNew.js
├── middleware.js      # Custom middleware
├── schema.js          # Joi validation schemas
├── cloudConfig.js     # Cloudinary configuration
├── app.js             # Application entry point
└── package.json       # Dependencies
```

### 3. Environment Variables

Required environment variables:

- `ATLAS_DB_URL`: MongoDB connection string
- `SECRET`: Session secret key
- `MAP_TOKEN`: Mapbox API token
- `CLOUD_NAME`: Cloudinary cloud name
- `CLOUD_API_KEY`: Cloudinary API key
- `CLOUD_API_SECRET`: Cloudinary API secret
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `OPENAI_API_KEY`: OpenAI API key (optional)
- `GOOGLE_TRANSLATE_API_KEY`: Google Translate API (optional)
- `HOLIDAY_API_KEY`: Calendarific API key (optional)
- `PORT`: Server port (default: 8080)

---

## API Endpoints Summary

### Public Routes

- `GET /` - Homepage (redirects to listings)
- `GET /listings` - Browse all destinations
- `GET /listings/:id` - View destination details
- `GET /about` - About page
- `GET /privacy` - Privacy policy
- `GET /terms` - Terms & conditions

### Authentication Routes

- `GET /signup` - Registration form
- `POST /signup` - Create account
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Sign out
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback

### User Profile Routes

- `GET /profile` - View profile
- `PUT /profile` - Update profile
- `GET /profile/wishlist` - View wishlist
- `POST /profile/wishlist/:listingId` - Add to wishlist
- `DELETE /profile/wishlist/:listingId` - Remove from wishlist
- `GET /profile/likes` - View liked listings
- `GET /profile/travel-journal` - View travel memories
- `POST /profile/travel-journal` - Add memory
- `GET /achievements` - View badges
- `GET /leaderboard` - View rankings

### Listing Routes

- `GET /listings/new` - New listing form
- `POST /listings` - Create listing
- `GET /listings/:id/edit` - Edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `POST /listings/:id/like` - Like listing
- `POST /listings/:id/unlike` - Unlike listing
- `GET /listings/compare` - Compare destinations

### Review Routes

- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Travel Planning Routes

- `GET /trip-planner` - Trip planner page
- `POST /trip-planner/api/estimate` - Cost estimation
- `GET /trip-planner/my-trips` - View saved trips
- `GET /weather` - Weather information
- `GET /weather/search/:location` - Search weather
- `GET /holiday` - Holiday calendar
- `GET /holiday/api/:country/:year` - Get holidays
- `GET /packing-list` - Packing list generator
- `POST /packing-list/generate` - Generate list

### Utility Routes

- `GET /currency` - Currency converter
- `GET /currency/api/convert` - Convert currency
- `GET /chatbot` - AI chatbot
- `POST /chatbot/chat` - Chat with AI
- `GET /phrase-assistant` - Translation tool
- `POST /phrase-assistant/api/translate` - Translate phrase

### Safety Routes

- `GET /safety-alerts` - View safety reports
- `GET /safety-alerts/new` - New report form
- `POST /safety-alerts` - Create report
- `GET /safety-alerts/:id` - View report
- `PUT /safety-alerts/:id` - Update report
- `DELETE /safety-alerts/:id` - Delete report

### Admin Routes

- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/api/analytics/user-growth` - User stats
- `GET /admin/api/analytics/top-destinations` - Popular destinations

### Newsletter Routes

- `POST /newsletter/subscribe` - Subscribe
- `POST /newsletter/unsubscribe` - Unsubscribe
- `GET /newsletter/stats` - Subscriber statistics

### Notification Routes

- `GET /trip-planner/api/notifications` - Get notifications
- `PATCH /trip-planner/api/notifications/:id/read` - Mark as read
- `DELETE /trip-planner/api/notifications/:id` - Delete notification

---

## Future Enhancements

### Planned Features

1. **Social Features**

   - Friend system
   - Follow/unfollow users
   - Share trips
   - Group travel planning

2. **Booking Integration**

   - Flight booking
   - Hotel reservations
   - Activity bookings
   - Payment gateway

3. **Enhanced AI**

   - Image recognition for destinations
   - Personalized itinerary generation
   - Chatbot improvements
   - Sentiment analysis on reviews

4. **Mobile App**

   - Native iOS app
   - Native Android app
   - Push notifications
   - GPS features

5. **Gamification**
   - More badges
   - Challenges
   - Competitions
   - Rewards program

---

## Contributing

Contributions are welcome! This project is part of **GirlScript Summer of Code (GSSoC) 2025**.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Follow coding standards
6. Add tests for new features

---

## License

This project is licensed under the MIT License.

---

## Credits

- **Author**: Kaushik Mandal
- **Contributors**: GSSoC 2025 participants
- **Community**: WanderLust users worldwide

---

_Last Updated: December 14, 2025_
