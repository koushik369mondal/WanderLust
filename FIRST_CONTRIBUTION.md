# 🎯 Your First Contribution Guide

## Step 1: Fork & Setup
1. Go to https://github.com/koushik369mondal/WanderLust
2. Click "Fork" button (top right)
3. Copy your fork URL

## Step 2: Set Up Local Development
```bash
# Add your fork as origin (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/WanderLust.git

# Add upstream for syncing
git remote add upstream https://github.com/koushik369mondal/WanderLust.git

# Create a new branch for your work
git checkout -b fix/logo-display-issue

# Verify remotes
git remote -v
```

## Step 3: Choose Your First Issue

### 🟢 EASY: Fix Logo Display (Issue #175)
**What to do:** Make application name visible alongside logo
**Files to check:** 
- `views/includes/navbar.ejs` (lines 100-158)
- Look for navbar brand section

### 🟢 EASY: Font Visibility (Issue #94)  
**What to do:** Improve font contrast and readability
**Files to check:**
- `public/CSS/style.css`
- Look for font-family and color definitions

### 🟡 MEDIUM: Newsletter Function (Issue #88)
**What to do:** Make newsletter signup work
**Files to check:**
- Find newsletter form in templates
- Add route in `routes/` folder
- Connect to backend

## Step 4: Make Changes & Test
```bash
# Test your changes (after getting MongoDB setup)
npm run dev

# Or for quick frontend testing, just open HTML files
```

## Step 5: Submit Pull Request
```bash
# Add and commit your changes
git add .
git commit -m "fix: resolve logo display issue in navbar"

# Push to your fork
git push origin fix/logo-display-issue

# Go to GitHub and create Pull Request
```

## 🏆 GSSOC Tips for Maximum Points:
- Comment on issue before starting work
- Follow coding standards in CONTRIBUTION.md  
- Add screenshots to your PR
- Test thoroughly before submitting
- Be responsive to review feedback

## 🆘 Need Help?
- Check the repo's issues and discussions
- Ask questions in issue comments
- Review other contributors' PRs for examples

Ready to make your first contribution? 🚀