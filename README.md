# 🌍 Wanderlust - Travel Experience Sharing Platform

> **A comprehensive travel experience sharing platform where wanderers connect, explore, and share their adventures with the world.**

Wanderlust is a full-stack web application designed for travel enthusiasts who want to discover amazing destinations, share their travel experiences, and connect with fellow travelers. Whether you're planning your next adventure or sharing memories from your latest trip, Wanderlust provides the perfect platform to explore, review, and contribute to a growing community of travel lovers.

Built with modern web technologies: **MongoDB**, **Express.js**, **Node.js**, and **EJS**.

---

## 🎯 **Part of GirlScript Summer of Code 2025 (GSSoC'25)**

This project is proudly participating in **GirlScript Summer of Code 2025**, welcoming contributions from developers around the world. Join us in building an amazing platform for travel enthusiasts! 🚀

---

## 🔗 [Live Preview](https://wanderlust-j5rm.onrender.com/listings)

**Experience Wanderlust live!** Explore the platform, browse destinations, and see all features in action.

---

## 📸 **Screenshots & Demo**

### 🏠 **Homepage - Discover Amazing Destinations**
*Browse through a curated collection of travel destinations with stunning visuals*

### 🗺️ **Interactive Maps**
*Explore locations with integrated Mapbox maps showing exact coordinates*

### ⭐ **Reviews & Ratings System**
*Read authentic reviews from fellow travelers and share your own experiences*

### 📱 **Responsive Design**
*Seamlessly works across all devices - desktop, tablet, and mobile*

> 💡 **Tip:** Visit the [live demo](https://wanderlust-j5rm.onrender.com/listings) to experience all features firsthand!

---

## 🚀 Features

### 🌟 **Core Features**
- 🌐 **Explore Destinations** - Discover amazing travel locations from around the world
- 📝 **Share Your Adventures** - Add new destinations with detailed descriptions and photos  
- ⭐ **Community Reviews** - Rate and review places you've visited, helping other travelers
- 🗺️ **Interactive Maps** - Explore exact locations with beautiful Mapbox integration
- 📸 **Photo Management** - Upload and manage travel photos with Cloudinary integration
- 👤 **User Profiles** - Create personalized profiles with travel preferences and social links

### 🛡️ **Security & Authentication**
- 🔐 **Secure Authentication** - Robust login/signup system with Passport.js
- 🛡️ **Data Protection** - Secure session management and data validation
- 🚫 **Authorization Controls** - User-specific permissions for editing and deleting content

### 💻 **Technical Features**
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ✏️ **Complete CRUD Operations** - Create, Read, Update, Delete functionality
- 🌙 **Dark/Light Theme** - Toggle between themes for better user experience
- ⚡ **Fast Performance** - Optimized for quick loading and smooth navigation

---

## 🛠 Tech Stack

### 🖥️ **Backend Technologies**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast and minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### 🎨 **Frontend Technologies**
- **EJS** - Embedded JavaScript templating engine
- **HTML5 & CSS3** - Modern markup and styling
- **Bootstrap 5** - Responsive CSS framework
- **JavaScript (ES6+)** - Modern JavaScript for interactivity

### 🔗 **APIs & Services**
- **Cloudinary** - Cloud-based image and video management
- **Mapbox API** - Interactive maps and geolocation services
- **Passport.js** - Authentication middleware for Node.js

### 🔧 **Development Tools**
- **Nodemon** - Development server with auto-restart
- **Git** - Version control system
- **npm** - Package manager for Node.js

---

## 📋 Prerequisites

Before you begin contributing to Wanderlust, ensure you have the following installed on your machine:

### 🔧 **Required Software**
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher) - JavaScript runtime environment
  - Download from the official website and follow installation instructions
  - Verify installation: `node --version` and `npm --version`

- **[MongoDB](https://www.mongodb.com/)** - Database for storing application data
  - **Option 1:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud - Recommended for beginners)
  - **Option 2:** [Local MongoDB Installation](https://docs.mongodb.com/manual/installation/)

- **[Git](https://git-scm.com/)** - Version control system
  - Download and install from the official website
  - Configure with your GitHub credentials

### 🔑 **Required API Keys** (Free accounts available)
- **[Cloudinary Account](https://cloudinary.com/)** - For image upload functionality
- **[Mapbox Account](https://account.mapbox.com/)** - For interactive maps

### 💡 **Recommended Tools**
- **Code Editor:** [VS Code](https://code.visualstudio.com/), [Sublime Text](https://www.sublimetext.com/), or your preferred editor
- **API Testing:** [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- **Database GUI:** [MongoDB Compass](https://www.mongodb.com/products/compass) (optional)

---

## 📂 Installation Guide (For Contributors)

Follow these step-by-step instructions to set up Wanderlust on your local machine:

### 🍴 **Step 1: Fork & Clone**

1. **Fork the Repository**
   - Click the "Fork" button at the top right of this GitHub page
   - This creates a copy of the repository in your GitHub account

2. **Clone Your Fork**
   ```bash
   # Replace YOUR-USERNAME with your actual GitHub username
   git clone https://github.com/YOUR-USERNAME/WanderLust.git
   cd WanderLust
   ```

3. **Install Dependencies**
   ```bash
   # Install all required packages
   npm install
   ```
   
   > ⏱️ **Note:** This might take a few minutes depending on your internet connection.

### 🔐 **Step 2: Environment Configuration**

1. **Create Environment File**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

2. **Configure Your API Keys**
   
   Open the `.env` file in your code editor and fill in your credentials:

   ```env
   # 🗺️ Mapbox Configuration
   MAP_TOKEN=your_mapbox_public_token
   
   # ☁️ Cloudinary Configuration  
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   
   # 🗄️ MongoDB Configuration
   ATLAS_DB_URL=your_mongodb_connection_string
   
   # 🔒 Session Secret
   SECRET=your_super_secret_session_key
   ```

3. **Get Your API Credentials:**

   **🗺️ Mapbox Setup:**
   - Visit [Mapbox](https://account.mapbox.com/)
   - Create a free account
   - Go to "Access tokens" → Copy your **Default Public Token**
   
   **☁️ Cloudinary Setup:**
   - Visit [Cloudinary](https://cloudinary.com/)
   - Create a free account
   - Go to Dashboard → Copy: **Cloud Name**, **API Key**, **API Secret**
   
   **🗄️ MongoDB Setup:**
   - **For beginners (Recommended):** [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)
   - **For local setup:** Use `mongodb://localhost:27017/wanderlust`

   **🔒 Session Secret:**
   - Generate a secure random string (e.g., `your_super_secret_key_here`)

### 🚀 **Step 3: Run the Application**

```bash
# Start in development mode (recommended for contributors)
npm run dev

# Alternative: Start in production mode
npm start
```

### ✅ **Step 4: Verify Installation**

1. **Check the Terminal** - You should see:
   ```
   Server is running on port 3000
   Connected to MongoDB
   ```

2. **Open Your Browser** - Navigate to: **http://localhost:3000**

3. **Test Features:**
   - Browse existing listings
   - Create a new account
   - Add a new destination (test image upload)
   - View locations on the map

> 🎉 **Congratulations!** You now have Wanderlust running locally on your machine!

---

## 📁 Project Structure

```
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

---

## 🤝 Contributing to Wanderlust

We welcome contributions from developers of all skill levels! Whether you're a beginner making your first open-source contribution or an experienced developer, there's a place for you in our community.

### 🌟 **Ways to Contribute**

- 🐛 **Bug Reports** - Found a bug? Report it!
- ✨ **Feature Requests** - Have an idea? We'd love to hear it!
- 🛠️ **Code Contributions** - Fix bugs, add features, improve performance
- 📚 **Documentation** - Help improve our docs, tutorials, and guides
- 🎨 **Design** - UI/UX improvements, icons, graphics
- 🧪 **Testing** - Write tests, test new features, improve coverage

### 🚀 **Quick Start for Contributors**

#### **First-time Contributors**
1. ⭐ **Star** this repository
2. 🍴 **Fork** the repository to your GitHub account
3. 📋 **Check** the [Issues](https://github.com/koushik369mondal/WanderLust/issues) page for beginner-friendly tasks
4. 💬 **Comment** on an issue you'd like to work on
5. 🔧 **Follow** the installation guide above

#### **Experienced Contributors**
1. 🍴 **Fork** and **clone** the repository
2. 🔧 **Set up** your development environment
3. 🏷️ **Choose** an issue or propose a new feature
4. 💻 **Start coding** following our guidelines

### 📝 **Step-by-Step Contribution Process**

#### **1. 🌿 Create a Feature Branch**
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/add-dark-theme
git checkout -b bugfix/fix-map-loading
git checkout -b docs/improve-readme
```

#### **2. 💻 Make Your Changes**
- **Code Quality:**
  - Write clean, readable, and well-commented code
  - Follow existing code style and conventions
  - Use meaningful variable and function names
  
- **Testing:**
  - Test your changes thoroughly
  - Ensure existing functionality still works
  - Test on different devices/browsers if applicable

- **Documentation:**
  - Update documentation if you change functionality
  - Add comments for complex logic
  - Update README if you add new features

#### **3. ✅ Before Committing**
```bash
# Check your changes
git status
git diff

# Make sure the app runs without errors
npm run dev

# Test in your browser
# Visit http://localhost:3000 and test your changes
```

#### **4. 📝 Commit Your Changes**
```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add: brief description of your changes"

# Examples of good commit messages:
git commit -m "Add: dark theme toggle functionality"
git commit -m "Fix: map not loading on mobile devices"
git commit -m "Docs: update installation instructions"
```

#### **5. 🚀 Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

#### **6. 🎯 Create a Pull Request**
1. **Go to your fork** on GitHub
2. **Click** "New Pull Request"
3. **Fill out the PR template:**
   - Clear title describing your changes
   - Detailed description of what you changed
   - Screenshots (if applicable)
   - Related issue number (if applicable)
4. **Submit** the PR 🎉

### 📋 **Pull Request Guidelines**

#### **PR Title Format:**
- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Docs: documentation changes`

#### **PR Description Should Include:**
- 📝 **Summary** of changes made
- 🔗 **Related issue** (if applicable): `Fixes #issue-number`
- 🧪 **Testing** details: How you tested the changes
- 📸 **Screenshots** (for UI changes)
- ✅ **Checklist** of completed tasks

#### **Before Submitting:**
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented where necessary
- [ ] Changes tested locally
- [ ] No console errors
- [ ] Documentation updated (if applicable)

### 🏷️ **Issue Labels Guide**

- 🟢 **good first issue** - Perfect for newcomers
- 🔵 **enhancement** - New features
- 🔴 **bug** - Bug reports
- 🟡 **documentation** - Docs improvements
- 🟣 **help wanted** - Extra attention needed
- 🟠 **priority: high** - Urgent issues

### 💡 **Getting Help**

- 📖 **Read** existing issues and PRs for context
- 💬 **Ask questions** in issue comments
- 🤝 **Be patient** - maintainers are volunteers
- 🙋 **Tag** @koushik369mondal for urgent matters

### 🌍 **Community Guidelines**

- 🤗 **Be respectful** and inclusive
- 💬 **Communicate clearly** and constructively
- 🤝 **Help others** when you can
- 📚 **Learn from mistakes** - we all make them!
- 🎉 **Celebrate others'** contributions

> 💡 **New to Open Source?** Check out [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) for a comprehensive guide!

---

## 🐛 Troubleshooting & FAQ

### 🔧 **Common Installation Issues**

#### **Issue: "Cannot find module" errors**
```bash
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Issue: Database connection failed**
```bash
Error: Could not connect to MongoDB
```
**Solutions:**
1. **Check your MongoDB connection string** in `.env` file
2. **For MongoDB Atlas:**
   - Ensure your IP address is whitelisted
   - Check username/password in connection string
   - Verify cluster is running
3. **For local MongoDB:**
   - Start MongoDB service: `mongod`
   - Use: `mongodb://localhost:27017/wanderlust`

#### **Issue: Images not uploading**
```bash
Error: Invalid Cloudinary credentials
```
**Solution:**
- Verify your Cloudinary credentials in `.env` file
- Check: `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`
- Ensure no extra spaces in credential values

#### **Issue: Maps not loading**
```bash
Map container not found
```
**Solutions:**
1. **Check Mapbox token** in `.env` file
2. **Verify token permissions** on Mapbox dashboard
3. **Clear browser cache** and reload

#### **Issue: Port already in use**
```bash
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### 🆘 **Getting Additional Help**

#### **Before Asking for Help:**
1. ✅ Check this troubleshooting section
2. ✅ Search existing [GitHub Issues](https://github.com/koushik369mondal/WanderLust/issues)
3. ✅ Verify all environment variables are correct
4. ✅ Ensure all dependencies are installed

#### **When Reporting Issues:**
1. 📝 **Describe the problem** clearly
2. 🖥️ **Include your operating system** (Windows/Mac/Linux)
3. 📊 **Share error messages** (full error logs)
4. 🔧 **List steps to reproduce** the issue
5. 📸 **Add screenshots** if applicable

#### **Where to Get Help:**
- 🐛 **Bug Reports:** [Open an Issue](https://github.com/koushik369mondal/WanderLust/issues/new)
- 💬 **Questions:** Comment on existing issues or discussions
- 📧 **Direct Contact:** koushik369mondal@gmail.com

### 📚 **Frequently Asked Questions**

**Q: Can I use this project for commercial purposes?**
A: Yes! This project is under MIT License, allowing commercial use.

**Q: How do I add a new feature?**
A: Check our [Contributing Guidelines](#-contributing-to-wanderlust) and open an issue first to discuss the feature.

**Q: Is this project beginner-friendly?**
A: Absolutely! We welcome contributors of all skill levels and have good first issue labels.

**Q: Can I deploy this to production?**
A: Yes! Check our deployment section for guidance on hosting platforms.

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-restart on changes)
npm start           # Start in production mode

# Database
node init/index.js  # Initialize database with sample data

# Package Management
npm install         # Install all dependencies
npm audit           # Check for security vulnerabilities
npm update          # Update packages to latest versions
```

### 🛠️ **Development Workflow**
```bash
# 1. Start development server
npm run dev

# 2. Make your changes
# Files auto-reload thanks to nodemon

# 3. Test your changes
# Visit http://localhost:3000

# 4. Initialize sample data (if needed)
node init/index.js
```

---

## 🚀 Deployment Guide

### 🌐 **Deploying to Production**

Wanderlust can be deployed to various cloud platforms. Here are guides for popular options:

#### **🟢 Render (Recommended - Free Tier Available)**
1. **Create account** at [Render](https://render.com/)
2. **Connect your GitHub** repository
3. **Set environment variables** in Render dashboard
4. **Deploy** with automatic builds from your main branch

**Environment Variables for Render:**
```
NODE_ENV=production
ATLAS_DB_URL=your_mongodb_atlas_url
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_token
SECRET=your_session_secret
```

#### **💙 Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set ATLAS_DB_URL=your_mongodb_url
heroku config:set CLOUD_NAME=your_cloudinary_name
# ... (add all other env vars)

# Deploy
git push heroku main
```

#### **⚡ Vercel**
1. **Install Vercel CLI:** `npm i -g vercel`
2. **Run:** `vercel` in project directory
3. **Configure** environment variables in Vercel dashboard

#### **🔷 Netlify**
- Netlify is primarily for static sites, so consider using Render or Heroku for this Node.js application

### 📋 **Pre-Deployment Checklist**
- [ ] All environment variables configured
- [ ] Database connection string updated for production
- [ ] API keys are valid and have correct permissions
- [ ] `.env` file not included in deployment
- [ ] Application tested locally
- [ ] All dependencies properly listed in `package.json`

---

---

## 🗺️ Roadmap & Future Enhancements

### 🎯 **Current Goals (GSSoC'25)**
- [ ] 🌙 **Dark/Light Theme Toggle** - Complete theme system
- [ ] 📱 **PWA Support** - Progressive Web App capabilities  
- [ ] 🔔 **Real-time Notifications** - User interaction alerts
- [ ] 🌍 **Multi-language Support** - Internationalization (i18n)
- [ ] 📊 **Admin Dashboard** - Content management interface

### 🚀 **Upcoming Features**
- [ ] 🤖 **AI-Powered Recommendations** - Smart destination suggestions
- [ ] 💬 **Chat System** - Direct messaging between travelers
- [ ] 📅 **Trip Planning** - Itinerary creation and sharing
- [ ] 🏆 **Gamification** - Badges and achievements for active users
- [ ] 📈 **Analytics Dashboard** - User engagement insights

### 🔧 **Technical Improvements**
- [ ] ⚡ **Performance Optimization** - Faster loading times
- [ ] 🧪 **Testing Suite** - Comprehensive unit and integration tests
- [ ] 📱 **Mobile App** - React Native companion app
- [ ] 🔒 **Enhanced Security** - Advanced authentication features
- [ ] 🌐 **API Development** - RESTful API for third-party integrations

### 💡 **Community Suggestions**
Have an idea for Wanderlust? We'd love to hear it!
- 📝 [Submit Feature Request](https://github.com/koushik369mondal/WanderLust/issues/new?template=feature_request.md)
- 💬 Join our discussions
- 🗳️ Vote on existing proposals

> 🤝 **Want to contribute to any of these features?** Check our [Contributing Guidelines](#-contributing-to-wanderlust) and look for related issues!

---

## 🤝 **GSSoC'25 & Community**

### 🌟 **GirlScript Summer of Code 2025**
Wanderlust is proudly part of **GSSoC'25**, one of the largest open-source programs in India!

**Program Highlights:**
- 🎓 **Learn & Grow** - Perfect for beginners and experienced developers
- 🏆 **Certificates & Rewards** - Recognition for your contributions  
- 🌍 **Global Community** - Connect with developers worldwide
- 💡 **Mentorship** - Guidance from experienced maintainers

**For GSSoC'25 Participants:**
- 🔍 Look for issues labeled `gssoc25`
- 📊 Track your contributions on the leaderboard
- 🤝 Join our community discussions
- 📚 Follow our contribution guidelines

### 🎖️ **Recognition**
We believe in recognizing our contributors:
- 🌟 **Contributor Hall of Fame** - Featured on our README
- 📜 **Certificates** - For significant contributions
- 🏆 **Special Mentions** - In our release notes
- 💼 **LinkedIn Recommendations** - For outstanding contributors

---

## 🔒 Security Note

- Never commit your `.env` file to version control
- Keep your API keys and secrets secure
- Use strong, unique passwords for all services

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

### 🌟 **Hall of Fame**
Thanks to all the amazing people who have contributed to making Wanderlust better! 🙌

> **Want to see your name here?** Check out our [Contributing Guidelines](#-contributing-to-wanderlust) and start contributing today!

### 🎯 **Special Recognition**
- **GSSoC'25 Contributors** - Making a difference in open source
- **First-time Contributors** - Welcome to the community!
- **Bug Fixers** - Keeping the codebase clean and functional
- **Feature Developers** - Adding awesome new capabilities
- **Documentation Writers** - Making the project accessible to everyone

### 📊 **Contribution Stats**
- 🔄 **Pull Requests:** Contributing code improvements
- 🐛 **Issues Reported:** Helping identify and fix problems  
- 📚 **Documentation:** Making the project more accessible
- 💡 **Feature Ideas:** Shaping the future of Wanderlust

> 🤝 **Contributors are the heart of open source!** Every contribution, no matter how small, makes a difference.

---

## ⭐ Support & Community

### 💝 **Show Your Support**
If you find Wanderlust helpful and enjoy using it:

- 🌟 **Star this repository** - It helps others discover the project
- 🍴 **Fork the project** - Create your own version
- 🔗 **Share with friends** - Spread the word about Wanderlust
- 💬 **Join discussions** - Be part of our community
- 🤝 **Contribute** - Help make it even better

### 🌐 **Community Links**
- 📁 **GitHub Repository:** [WanderLust](https://github.com/koushik369mondal/WanderLust)
- 🐛 **Report Issues:** [GitHub Issues](https://github.com/koushik369mondal/WanderLust/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/koushik369mondal/WanderLust/discussions)
- 📚 **Documentation:** You're reading it!

### 🏆 **Project Metrics**
- ⭐ **GitHub Stars:** Help us reach our goal!
- 🍴 **Forks:** See how others are using the project
- 👥 **Contributors:** Growing community of developers
- 🔄 **Active Development:** Regular updates and improvements

---

## 📞 Contact & Support

### 💬 **Get in Touch**

We'd love to hear from you! Whether you have questions, suggestions, or just want to say hello:

#### **📧 Primary Contact**
- **Maintainer:** Kaushik Mandal
- **Email:** [koushik369mondal@gmail.com](mailto:koushik369mondal@gmail.com)
- **GitHub:** [@koushik369mondal](https://github.com/koushik369mondal)

#### **🤝 **Community Support**
- 🐛 **Bug Reports:** [Open an Issue](https://github.com/koushik369mondal/WanderLust/issues/new)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/koushik369mondal/WanderLust/discussions)
- ❓ **General Questions:** Comment on relevant issues
- 📚 **Documentation Issues:** Help us improve our docs!

#### **⚡ **Quick Help**
- 🔍 **Search existing issues** before creating new ones
- 📝 **Provide detailed information** when reporting problems
- 🤝 **Be patient and respectful** - we're all volunteers!
- 🌟 **Consider contributing** if you find a solution

### 📞 **Response Times**
- 🚨 **Critical Bugs:** 24-48 hours
- 🐛 **General Issues:** 2-5 business days  
- 💡 **Feature Requests:** 1-2 weeks for review
- 📚 **Documentation:** 3-7 business days

> 💡 **Tip:** The more details you provide, the faster we can help you!

---

## 🎉 **Thank You!**

### 🌟 **To Our Amazing Community**
Thank you for being part of the Wanderlust journey! Whether you're:
- 🧑‍💻 **Contributing code**
- 🐛 **Reporting bugs** 
- 💡 **Suggesting features**
- 📚 **Improving documentation**
- ⭐ **Starring the repository**
- 🔗 **Sharing with others**

**Every action helps make Wanderlust better for everyone!**

### 🚀 **Special Thanks**
- 🎓 **GSSoC'25** - For providing this amazing platform
- 👥 **Open Source Community** - For inspiring collaboration
- 🌍 **Travel Enthusiasts** - For sharing their passion
- 💻 **Developers Worldwide** - For building amazing tools

---

## 🧳 **Ready to Start Your Journey?**

1. ⭐ **Star** this repository
2. 🍴 **Fork** the project  
3. 💻 **Clone** your fork
4. 🛠️ **Set up** your development environment
5. 🚀 **Start contributing**!

---

**Happy coding and safe travels! 🧳✈️🌍**

*Made with ❤️ by the Wanderlust community*
