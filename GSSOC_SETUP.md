# 🌍 WanderLust GSSOC 2025 - Quick Setup Guide

## 📋 Prerequisites Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Set up MongoDB Atlas (Free)
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string and add to `.env`

### 3. Set up Cloudinary (Free)
1. Visit [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get API keys from dashboard
4. Add to `.env` file

### 4. Set up Mapbox (Free)
1. Visit [Mapbox](https://www.mapbox.com/)
2. Create account and get access token
3. Add to `.env` file

## 🚀 Quick Start Commands

```bash
# Install dependencies (already done)
npm install

# Initialize database with sample data
node init/index.js

# Start development server
npm run dev
```

## 🎯 Ready to Contribute!

### Choose an Issue:
- Browse issues: https://github.com/koushik369mondal/WanderLust/issues
- Look for `GSSoC'25` and `good first issue` labels
- Comment on the issue you want to work on

### Contribution Workflow:
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/WanderLust.git`
3. Create feature branch: `git checkout -b feature/your-feature-name`
4. Make changes and test
5. Commit: `git commit -m "feat: your feature description"`
6. Push: `git push origin feature/your-feature-name`
7. Create Pull Request

## 🏆 GSSOC 2025 Tips
- Start with Level 1-2 issues for points
- Follow contribution guidelines in CONTRIBUTION.md
- Be active in discussions
- Help other contributors
- Document your work well

Happy Contributing! 🌟