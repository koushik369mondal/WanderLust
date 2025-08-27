# 🌍 Wanderlust - Travel Experience Sharing Platform

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/koushik369mondal/WanderLust)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

>A full-stack web application to explore, share, and review travel destinations. Built with **MongoDB**, **Express.js**, **Node.js**, and **EJS**.

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

**🔗 [Live Preview](https://wanderlust-zh33.onrender.com/listings)**

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=00C853&center=true&vCenter=true&width=900&lines=Thanks+for+visiting+WanderLust!+🙌;Start+the+repo+✅;Share+it+with+others+🌍;Contribute+and+grow+🛠️;Happy+Coding+✨!" alt="Thanks Banner Typing SVG" />
</div>
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**📊 Project Insights**

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

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**🚀 Features**

- 🌐 *Browse Destinations* - Explore amazing travel locations
- 📝 *Add New Places* - Share your favorite destinations  
- ⭐ *Reviews & Ratings* - Rate and review places you've visited
- 🗺️ *Interactive Maps* - Powered by Mapbox
- 📸 *Photo Uploads* - Upload images via Cloudinary
- 📱 *Responsive Design* - Works on all devices
- 🔐 *User Authentication* - Secure login/signup system
- ✏️ *Full CRUD* - Create, Read, Update, Delete functionality

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

![GSSoC Logo](./public/images/gssoc_logo.png)

**🌟 Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow WanderLust! Let’s make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 GSSoC is one of India’s **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from GSSoC 2025 to this WanderLust project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

**🛠 Tech Stack**

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Bootstrap
- **Database:** MongoDB (Mongoose ODM)
- **Cloud Storage:** Cloudinary (for image uploads)
- **Maps:** Mapbox API
- **Authentication:** Passport.js

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**� Environment Variables Setup Guide**

This project requires several external services. Follow this comprehensive guide to set up all required environment variables:

**🔧 Step 1: Create your `.env` file**
```bash
cp .env.example .env
```

**☁️ CLOUDINARY Setup (Image Upload Service)**

1. **Create Account:**
   - Go to [Cloudinary](https://cloudinary.com/) and sign up for free
   - Verify your email and complete registration

2. **Get Your Credentials:**
   - After login, go to your **Dashboard**
   - Find the **Account Details** section
   - Copy these three values:
     - **Cloud Name** (e.g., `your_cloud_name`)
     - **API Key** (e.g., `123456789012345`)
     - **API Secret** (e.g., `your_api_secret_here`)

3. **Add to `.env`:**
   ```env
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

**🗺️ MAPBOX Setup (Maps Service)**

1. **Create Account:**
   - Go to [Mapbox](https://account.mapbox.com/) and sign up for free
   - Complete the registration process

2. **Get Access Token:**
   - After login, go to **Account** → **Access Tokens**
   - Copy your **Default Public Token** (starts with `pk.`)
   - Example: `pk.eyJ1IjoieW91cl91c2VybmFtZSIsImEiOiJjbTls...`

3. **Add to `.env`:**
   ```env
   MAP_TOKEN=your_mapbox_access_token
   ```

**🗄️ MONGODB ATLAS Setup (Database Service)**

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for free
   - Choose the **Free Tier** (M0 Sandbox)

2. **Create Cluster:**
   - Click **Build a Database** → **Create** (Free tier)
   - Choose your preferred **Cloud Provider** and **Region**
   - Click **Create Cluster** (this takes 1-3 minutes)

3. **Create Database User:**
   - Go to **Database Access** (left sidebar)
   - Click **Add New Database User**
   - Choose **Password** authentication
   - Set **Username** and **Password** (save these!)
   - Under **Database User Privileges**, select **Read and write to any database**
   - Click **Add User**

4. **Allow Network Access:**
   - Go to **Network Access** (left sidebar)
   - Click **Add IP Address**
   - For development, click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Click **Confirm**

5. **Get Connection String:**
   - Go back to **Clusters** → Click **Connect**
   - Choose **Connect your application**
   - Select **Node.js** and **4.1 or later**
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials

6. **Add to `.env`:**
   ```env
   ATLAS_DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

**🔐 SESSION SECRET Setup (Security)**

1. **What is it?**
   - A session secret is used to encrypt user session data
   - It should be a long, random, and unique string

2. **Generate a Strong Secret:**
   - **Option 1:** Use Node.js crypto module:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - **Option 2:** Use online generator: [Random.org](https://www.random.org/passwords/)
   - **Option 3:** Create your own random string (minimum 32 characters)

3. **Add to `.env`:**
   ```env
   SECRET=your_super_secret_session_key_here_make_it_long_and_random
   ```

**⚠️ IMPORTANT SECURITY NOTES:**

- ✅ **NEVER** commit your `.env` file to GitHub
- ✅ Keep all credentials private and secure
- ✅ Use different credentials for development and production
- ✅ The `.env` file is already in `.gitignore` to prevent accidental commits
- ✅ If you accidentally expose credentials, regenerate them immediately

**🎯 Final `.env` Example:**
```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=pk.eyJ1IjoieW91cl91c2VybmFtZSIsImEiOiJjbTls...

ATLAS_DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

SECRET=your_super_secret_session_key_here_make_it_long_and_random
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**📋 Prerequisites**

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas account)
- [Git](https://git-scm.com/)

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
 
 **📂 Installation (For Contributors)**

***1. Fork & Clone***

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

***2. Set Up Environment Variables***

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

***3. Run the Project***

```bash
# Development mode (with nodemon)
npm run dev

# Or standard mode
npm start
```

🎉 Your app should now be running at: [`http://localhost:8080`]

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**📁 Project Structure**

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

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
 
 **🤝 Contributing**

We welcome contributions! Follow these steps:

***1. Create a Feature Branch***

```bash
git checkout -b feature/your-feature-name
```

***2. Make Your Changes***

- Write clean, well-commented code
- Follow existing code style and conventions
- Test your changes locally

***3. Commit Your Changes***

```bash
git add .
git commit -m "Add: brief description of your changes"
```

***4. Push to Your Fork***

```bash
git push origin feature/your-feature-name
```

***5. Create a Pull Request***
1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Provide a clear title and description
4. Submit the PR 🎉

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**🐛 Common Issues & Solutions**

***Issue: "Cannot find module" errors***
**Solution:** Make sure you've run `npm install`

***Issue: Database connection failed******
**Solution:** Check your `ATLAS_DB_URL` in `.env` file

***Issue: Images not uploading***
**Solution:** Verify your Cloudinary credentials in `.env`

***Issue: Maps not loading******
**Solution:** Check your `MAP_TOKEN` in `.env`

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**📝 Available Scripts**

```bash
npm start          # Start the application
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests (if available)
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**🔒 Security Note**

- Never commit your `.env` file to version control
- Keep your API keys and secrets secure
- Use strong, unique passwords for all services

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)


**📜 Code of Conduct**

Please refer to the [`Code of Conduct`](https://github.com/koushik369mondal/WanderLust/blob/main/CODE_OF_CONDUCT.md) for details on contributing guidelines and community standards.

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

**🤝👤 Contribution Guidelines**

We love our contributors! CONTRIBUTE.md `Will be Coming Soon`.

>Thank you once again to all our contributors who has contributed to **WanderLust!** Your efforts are truly appreciated. 💖👏

<!-- Contributors badge (auto-updating) -->

[![Contributors](https://img.shields.io/github/contributors/koushik369mondal/WanderLust?style=for-the-badge)](https://github.com/koushik369mondal/WanderLust/graphs/contributors)

<!-- Contributors avatars (auto-updating) -->
<p align="left">
  <a href="https://github.com/koushik369mondal/WanderLust/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=koushik369mondal/WanderLust" alt="Contributors" />
  </a>
</p>

See the full list of contributors and their contributions on the [`GitHub Contributors Graph`](https://github.com/koushik369mondal/WanderLust/graphs/contributors).

<h2 align="center">
<p style="font-family:var(--ff-philosopher);font-size:3rem;"><b> Show some <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Red Heart" width="40" height="40" /> by starring this awesome repository!
</p>
</h2>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**💡 Suggestions & Feedback**

Feel free to open issues or discussions if you have any feedback, feature suggestions, or want to collaborate!

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**🙌 Support & Star**

***If you find this project helpful:***
- Please give it a star ⭐ on GitHub
- Share it with others
- Consider contributing

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

**📞 Contact**

If you have any questions or suggestions, feel free to:
- Open an issue on GitHub
- Contact the maintainers

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

**📄 License**

This project is licensed under the MIT License - see the [`License`](https://github.com/koushik369mondal/WanderLust/blob/main/LICENSE) file for details.

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**⭐ Stargazers**

<div align="center">
  <a href="https://github.com/koushik369mondal/WanderLust/stargazers">
    <img src="https://reporoster.com/stars/koushik369mondal/WanderLust?type=svg&limit=100&names=false" alt="Stargazers" />
  </a>
</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**🍴 Forkers**

<div align="center">
  <a href="https://github.com/koushik369mondal/WanderLust/network/members">
    <img src="https://reporoster.com/forks/koushik369mondal/WanderLust?type=svg&limit=100&names=false" alt="Forkers" />
  </a>
</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

<h2>🧑‍💻Project Admin:</h2>
<table>
<tr>
<td align="center">
<a href="https://github.com/koushik369mondal"><img src="https://avatars.githubusercontent.com/u/137462541?v=4" height="140px" width="140px" alt="Kaushik Mandal"></a><br><sub><b>Kaushik Mandal</b><br><a href="https://www.linkedin.com/in/koushik369mondal/"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/73993775/278833250-adb040ea-e3ef-446e-bcd4-3e8d7d4c0176.png" width="45px" height="45px"></a></sub>
</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h1 align="center"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /> Give us a Star and let's make magic! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /></h1>

<p align="center">
     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mirror%20Ball.png" alt="Mirror Ball" width="150" height="150" />
</p>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

**👨‍💻 Built with ❤️ by the WanderLust Team**

**❤️ Kaushik Mandal and Contributors ❤️** [open an issue](https://github.com/koushik369mondal/WanderLust/issues) | [Watch Demo](https://wanderlust-zh33.onrender.com/listings)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="150%">

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=65&section=footer"/>

**Happy coding and safe travels! 🧳✈️**

**Ready to show off your coding achievements? Get started with WanderLust today! 🚀**