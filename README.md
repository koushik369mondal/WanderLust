# 🌍 Wanderlust - Travel Experience Sharing Platform

A full-stack web application to explore, share, and review travel destinations. Built with **MongoDB**, **Express.js**, **Node.js**, and **EJS**.

---

## 🔗 [Live Preview](https://wanderlust-j5rm.onrender.com/listings)

---

## 🚀 Features

- 🌐 **Browse Destinations** - Explore amazing travel locations
- 📝 **Add New Places** - Share your favorite destinations  
- ⭐ **Reviews & Ratings** - Rate and review places you've visited
- 🗺️ **Interactive Maps** - Powered by Mapbox
- 📸 **Photo Uploads** - Upload images via Cloudinary
- 📱 **Responsive Design** - Works on all devices
- 🔐 **User Authentication** - Secure login/signup system
- ✏️ **Full CRUD** - Create, Read, Update, Delete functionality

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Bootstrap
- **Database:** MongoDB (Mongoose ODM)
- **Cloud Storage:** Cloudinary (for image uploads)
- **Maps:** Mapbox API
- **Authentication:** Passport.js

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas account)
- [Git](https://git-scm.com/)

---

## 📂 Installation (For Contributors)

### 1. Fork & Clone

1. **Fork** this repository by clicking the "Fork" button at the top right
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/WanderLust.git
   cd WanderLust
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### 2. Set Up Environment Variables

This project requires environment variables for external services. Follow these steps:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials in `.env`:**
   ```env
   # Cloudinary Configuration (for image uploads)
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   
   # Mapbox Configuration (for maps)
   MAP_TOKEN=your_mapbox_public_token
   
   # MongoDB Configuration
   ATLAS_DB_URL=your_mongodb_connection_string
   
   # Session Secret (use a strong random string)
   SECRET=your_super_secret_session_key
   ```

3. **Get your API credentials:**
   
   **🗺️ Mapbox Token:**
   - Sign up at [Mapbox](https://account.mapbox.com/)
   - Go to "Access tokens" and copy your **Default Public Token**
   
   **☁️ Cloudinary Credentials:**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Go to Dashboard and copy: Cloud Name, API Key, API Secret
   
   **🗄️ MongoDB Connection:**
   - For MongoDB Atlas: [Get connection string](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)
   - For local MongoDB: `mongodb://localhost:27017/wanderlust`

### 3. Run the Project

```bash
# Development mode (with nodemon)
npm run dev

# Or standard mode
npm start
```

🎉 Your app should now be running at: **http://localhost:3000**

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

## 🤝 Contributing

We welcome contributions! Follow these steps:

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, well-commented code
- Follow existing code style and conventions
- Test your changes locally

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

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:** Make sure you've run `npm install`

### Issue: Database connection failed
**Solution:** Check your `ATLAS_DB_URL` in `.env` file

### Issue: Images not uploading
**Solution:** Verify your Cloudinary credentials in `.env`

### Issue: Maps not loading
**Solution:** Check your `MAP_TOKEN` in `.env`

---

## 📝 Available Scripts

```bash
npm start          # Start the application
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests (if available)
```

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

Thanks to all contributors who have helped make this project better! 🙌

---

## ⭐ Support

If you find this project helpful:
- Give it a ⭐ on GitHub
- Share it with others
- Consider contributing

---

## 📞 Contact

If you have any questions or suggestions, feel free to:
- Open an issue on GitHub
- Contact the maintainers

---

**Happy coding and safe travels! 🧳✈️**
