# 🌍 Wanderlust - Travel Experience Sharing Platform

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/koushik369mondal/WanderLust)

> A full-stack web application to explore, share, and review travel destinations. Built with **MongoDB**, **Express.js**, **Node.js**, and **EJS**.

**🔗 [Live Preview](https://wanderlust-fofm.onrender.com/listings)**

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=00C853&center=true&vCenter=true&width=900&lines=Thanks+for+visiting+WanderLust!+🙌;Star+the+repo+✅;Share+it+with+others+🌍;Contribute+and+grow+🛠️;Happy+Coding+✨!" alt="Thanks Banner Typing SVG" />
</div>

## 📊 Project Insights

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Closed PRs</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/koushik369mondal/WanderLust?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/koushik369mondal/WanderLust?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/koushik369mondal/WanderLust?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/koushik369mondal/WanderLust?style=flat&logo=github"/></td>
            <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/koushik369mondal/WanderLust?style=flat&color=critical&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/koushik369mondal/WanderLust?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/koushik369mondal/WanderLust?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

## 🚀 Features

### Core Features
- 🌐 **Browse Destinations** - Explore amazing travel locations with detailed information
- 📝 **Add New Places** - Share your favorite destinations with photos and descriptions
- ⭐ **Reviews & Ratings** - Rate and review places you've visited (1-5 stars)
- 🗺️ **Interactive Maps** - Powered by Mapbox with precise location markers
- 📸 **Photo Uploads** - Upload multiple images via Cloudinary integration
- 📱 **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- 🔐 **User Authentication** - Secure login/signup system with Passport.js
- ✏️ **Full CRUD Operations** - Create, Read, Update, Delete listings and reviews

### Advanced Features
- 🌤️ **Real-Time Weather Integration** - Live weather data for all destinations
- 📅 **Holiday Calendar & Travel Planner** - Smart vacation planning with global holidays
- 🎯 **Best Time to Visit Recommendations** - Country-specific travel season suggestions
- 🔍 **Smart Search & Filters** - Find destinations by location, price, or features
- 💾 **Data Caching** - Optimized performance with 10-minute weather caching
- 🌍 **Multi-Country Support** - Global destinations with localized information

## 🌟 GSSoC 2025 Participation

![GSSoC Logo](./public/images/gssoc_logo.png)

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow WanderLust together!

👩‍💻 GSSoC is one of India's **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects while learning, collaborating, and growing together.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Bootstrap
- **Database:** MongoDB (Mongoose ODM)
- **Cloud Storage:** Cloudinary (for image uploads)
- **Maps:** Mapbox API
- **Authentication:** Passport.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas account)
- [Git](https://git-scm.com/)

## 🔧 Environment Variables Setup

This project requires several external services. Follow this guide to set up all required environment variables:

### Step 1: Create your `.env` file

```bash
cp .env.example .env
```

### ☁️ Cloudinary Setup (Image Upload Service)

1. **Create Account:** Go to [Cloudinary](https://cloudinary.com/) and sign up for free
2. **Get Your Credentials:** After login, go to your Dashboard and find the Account Details section
3. **Add to `.env`:**
   ```env
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

### 🗺️ Mapbox Setup (Maps Service)

1. **Create Account:** Go to [Mapbox](https://account.mapbox.com/) and sign up for free
2. **Get Access Token:** Go to Account → Access Tokens and copy your Default Public Token
3. **Add to `.env`:**
   ```env
   MAP_TOKEN=your_mapbox_access_token
   ```

### 🗄️ MongoDB Atlas Setup (Database Service)

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for free
2. **Create Cluster:** Choose the Free Tier (M0 Sandbox)
3. **Create Database User:** Set up username and password with read/write permissions
4. **Allow Network Access:** Add your IP address or allow access from anywhere for development
5. **Get Connection String:** Replace username and password in the connection string
6. **Add to `.env`:**
   ```env
   ATLAS_DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

### 🌤️ OpenWeatherMap API Setup (Weather Service)

1. **Create Account:** Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up for free
2. **Get API Key:** After login, go to API Keys section and copy your key
3. **Add to `.env`:**
   ```env
   WEATHER_API_KEY=your_openweathermap_api_key
   ```

### 📅 Holiday API Setup (Optional - for Holiday Calendar)

1. **Create Account:** Go to [Calendarific](https://calendarific.com/) for holiday data
2. **Get API Key:** Copy your API key from dashboard
3. **Add to `.env`:**
   ```env
   HOLIDAY_API_KEY=your_holiday_api_key
   ```

### 🔐 Session Secret Setup

Generate a strong random string for session encryption:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:

```env
SECRET=your_super_secret_session_key_here_make_it_long_and_random
```

### Final `.env` Example:

```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=pk.eyJ1IjoieW91cl91c2VybmFtZSIsImEiOiJjbTls...

ATLAS_DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

WEATHER_API_KEY=your_openweathermap_api_key
HOLIDAY_API_KEY=your_holiday_api_key

SECRET=your_super_secret_session_key_here_make_it_long_and_random
```

**⚠️ Security Notes:**

- Never commit your `.env` file to GitHub
- Keep all credentials private and secure
- The `.env` file is already in `.gitignore`

## 📂 Installation & Setup

### 1. Fork & Clone

1. **Fork** this repository by clicking the "Fork" button at the top right
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/WanderLust.git
   cd WanderLust
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Follow the environment variables setup guide above.

### 4. Run the Project

```bash
# Development mode (with nodemon)
npm run dev

# Or standard mode
npm start
```

🎉 Your app should now be running at: [`http://localhost:8080`](http://localhost:8080)

## 📁 Project Structure

```bash
WanderLust/
├── models/          # Database models (Listing, Review, User)
├── routes/          # Express routes
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── middleware/      # Custom middleware functions
├── utils/           # Utility functions
├── init/            # Database initialization
├── .env.example     # Environment variables template
└── app.js           # Main application file
```

## 📝 Available Scripts

```bash
npm start          # Start the application
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests (if available)
```

## 🤝 Contributing

We welcome contributions! Follow these steps:

### 🏷️ Understanding Our Auto-Labeling System

Before contributing, please read our **[Labeling Guide](LABELING_GUIDE.md)** to understand how Issues and Pull Requests are automatically assigned complexity levels:

- 🌱 **Level1**: Beginner-friendly (documentation, typos, simple styling)
- 🔧 **Level2**: Intermediate (features, UI/UX, components)  
- ⚡ **Level3**: Advanced (bugs, backend, security, performance)

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, well-commented code
- Follow existing code style and conventions
- Test your changes locally
- Consider the complexity level when creating Issues/PRs

### 3. Commit Your Changes

```bash
git add .
git commit -m "Add: brief description of your changes"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Provide a clear title and description
4. Submit the PR 🎉

## 🌤️ Weather Integration Details

### Real-Time Weather Display
**Location:** Appears on listing detail pages above the map section

**What You'll See:**
- 🌡️ **Current Temperature** - Live temperature in Celsius (e.g., "24°C")
- 🌤️ **Weather Condition** - Clear description with emoji (☀️ sunny, 🌧️ rainy, ☁️ cloudy)
- 💨 **Wind Speed** - Current wind speed in m/s
- 💧 **Humidity** - Percentage humidity level
- 🌡️ **Feels Like** - Perceived temperature

### Weather Icon System
- ☀️ **Clear/Sunny** - Perfect weather conditions
- ☁️ **Cloudy** - Overcast conditions
- 🌧️ **Rain/Drizzle** - Wet weather conditions
- ⛈️ **Thunderstorms** - Severe weather alerts
- ❄️ **Snow** - Winter conditions
- 🌫️ **Mist/Fog** - Low visibility conditions
- 🌤️ **Mixed** - Partly cloudy/default conditions

### Best Time to Visit Recommendations
**Country-Specific Travel Seasons:**
- 🇮🇹 **Italy:** Spring (Apr-Jun) & Fall (Sep-Oct)
- 🇯🇵 **Japan:** Spring (Mar-May) & Fall (Sep-Nov) - Cherry blossoms & autumn colors
- 🇹🇭 **Thailand:** Cool Season (Nov-Feb) - Dry and comfortable
- 🇮🇳 **India:** Winter (Oct-Mar) - Pleasant temperatures
- 🇺🇸 **USA:** Varies by region - Spring & Fall generally ideal
- 🌍 **Default:** Spring & Fall seasons typically perfect for travel

### Performance Optimization
- ⚡ **10-minute caching** - Weather data cached for faster loading
- 🔄 **Auto-refresh** - Data updates every 10 minutes automatically
- 📱 **Fallback system** - Backup weather data when API is unavailable

## 📅 Holiday Calendar & Travel Planner

### Smart Vacation Planning
**Access:** Available in navbar dropdown under "Travel Tools" 🛠️

### Holiday Calendar Features
- 🗓️ **Global Holidays** - Public holidays for 200+ countries
- 🎉 **Long Weekends** - Automatic detection of extended holiday periods
- 🏖️ **Vacation Slots** - Mark ideal travel periods
- 📊 **Peak vs Off-Peak** - Travel season indicators
- 🎯 **Destination Suggestions** - Popular places during specific holidays

### How It Works
1. **Select Country** - Choose your home country or destination
2. **View Calendar** - See upcoming holidays and long weekends
3. **Plan Trips** - Mark holidays as "ideal vacation slots"
4. **Get Suggestions** - Discover trending destinations for those dates
5. **Smart Recommendations** - Combine with weather data for perfect timing

### Holiday Types Covered
- 🏛️ **National Holidays** - Official government holidays
- 🎊 **Religious Festivals** - Major religious celebrations
- 🎭 **Cultural Events** - Local festivals and celebrations
- 🏖️ **School Holidays** - Academic calendar breaks
- 💼 **Bank Holidays** - Financial sector closures

### Travel Planning Benefits
- 💰 **Cost Optimization** - Avoid peak pricing periods
- 🎯 **Perfect Timing** - Travel during ideal weather + holidays
- 📈 **Trend Analysis** - See popular destinations by season
- 🗓️ **Calendar Integration** - Export to Google Calendar/iCal
- 🌍 **Multi-Country Planning** - Compare holidays across regions

## 🐛 Common Issues & Solutions

| Issue                       | Solution                                |
| --------------------------- | --------------------------------------- |
| "Cannot find module" errors | Run `npm install`                       |
| Database connection failed  | Check your `ATLAS_DB_URL` in `.env`     |
| Images not uploading        | Verify Cloudinary credentials in `.env` |
| Maps not loading            | Check your `MAP_TOKEN` in `.env`        |
| Weather not displaying      | Verify `WEATHER_API_KEY` in `.env`      |
| Holiday calendar empty      | Check `HOLIDAY_API_KEY` in `.env`       |
| Slow loading times          | Weather caching active - wait 10 mins   |

## 📜 Code of Conduct

Please refer to the [Code of Conduct](https://github.com/koushik369mondal/WanderLust/blob/main/CODE_OF_CONDUCT.md) for details on contributing guidelines and community standards.

## 🤝 Contributors

[![Contributors](https://img.shields.io/github/contributors/koushik369mondal/WanderLust?style=for-the-badge)](https://github.com/koushik369mondal/WanderLust/graphs/contributors)

<p align="left">
  <a href="https://github.com/koushik369mondal/WanderLust/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=koushik369mondal/WanderLust" alt="Contributors" />
  </a>
</p>

## 🧑‍💻 Project Admin

<table>
<tr>
<td align="center">
<a href="https://github.com/koushik369mondal"><img src="https://avatars.githubusercontent.com/u/137462541?v=4" height="140px" width="140px" alt="Kaushik Mandal"></a><br><sub><b>Kaushik Mandal</b><br><a href="https://www.linkedin.com/in/koushik369mondal/"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/73993775/278833250-adb040ea-e3ef-446e-bcd4-3e8d7d4c0176.png" width="45px" height="45px"></a></sub>
</td>
</tr>
</table>

## ⭐ Stargazers

<div align="center">
  <a href="https://github.com/koushik369mondal/WanderLust/stargazers">
    <img src="https://reporoster.com/stars/koushik369mondal/WanderLust?type=svg&limit=100&names=false" alt="Stargazers" />
  </a>
</div>

## 🍴 Forkers

<div align="center">
  <a href="https://github.com/koushik369mondal/WanderLust/network/members">
    <img src="https://reporoster.com/forks/koushik369mondal/WanderLust?type=svg&limit=100&names=false" alt="Forkers" />
  </a>
</div>

## 💡 Support & Feedback

If you find this project helpful:

- Please give it a star ⭐ on GitHub
- Share it with others
- Consider contributing
- Feel free to open issues for feedback or suggestions

## 📞 Contact

If you have any questions or suggestions:

- Open an issue on GitHub
- Contact the maintainers

## 📄 License

This project is licensed under the MIT License - see the [License](https://github.com/koushik369mondal/WanderLust/blob/main/LICENSE) file for details.

---

<h2 align="center">
<p><b>Show some <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Red Heart" width="40" height="40" /> by starring this repository!</p>
</h2>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=65&section=footer"/>

**Happy coding and safe travels! 🧳✈️**
