# 🤖 Dependabot Configuration

This document explains our automated dependency management setup for the WanderLust project.

## 📋 Overview

Our Dependabot configuration automatically keeps dependencies up-to-date by creating Pull Requests for security updates and dependency upgrades.

## ⚙️ Configuration Details

### 📅 Schedule
- **Frequency**: Weekly updates
- **Day**: Every Monday
- **Time**: 9:00 AM UTC
- **Target Branch**: `main`

### 🏷️ Automatic Labeling
All Dependabot PRs automatically receive:
- `dependencies` - Indicates dependency update
- `automated` - Marks as automated PR
- `GSSoC'25` - Enables auto-complexity labeling

### 👥 Review Assignment
- **Primary Reviewer**: @koushik369mondal
- **PR Limit**: Maximum 10 open dependency PRs

## 📦 Update Groups

### 🔒 Security Updates
- **Pattern**: All dependencies (`*`)
- **Types**: Major, Minor, Patch
- **Priority**: Highest (security fixes)

### 🏭 Production Dependencies
Critical application dependencies with conservative updates:
- `express*`, `mongoose*`, `passport*`
- `cloudinary*`, `multer*`, `ejs*`, `bootstrap*`
- **Types**: Minor and Patch only (no breaking changes)

### 🛠️ Development Dependencies
Development tools with more flexible updates:
- `nodemon*`, `jest*`, `eslint*`, `prettier*`
- **Types**: Major, Minor, Patch (allows breaking changes)

## 🚫 Ignored Updates

To maintain stability, we ignore major version updates for:
- **Express.js** - Core framework stability
- **Mongoose** - Database layer consistency

## 📝 Commit Message Format

- **Production**: `deps: update dependency_name to vX.X.X`
- **Development**: `deps-dev: update dev_dependency to vX.X.X`
- **Scope**: Includes dependency scope information

## 🎯 Benefits

- ✅ **Automated Security**: Immediate security patch updates
- ✅ **Reduced Maintenance**: No manual dependency checking
- ✅ **Stable Updates**: Conservative approach for production code
- ✅ **Clear Tracking**: Organized PRs with proper labeling
- ✅ **GSSoC Integration**: Auto-labeler assigns complexity levels

## 🔄 Workflow Integration

1. **Monday Morning**: Dependabot checks for updates
2. **PR Creation**: Creates grouped PRs based on configuration
3. **Auto-Labeling**: Our intelligent labeler assigns complexity levels
4. **Review Process**: Assigned reviewers get notifications
5. **Testing**: CI/CD runs automatically on dependency PRs
6. **Merge**: Safe to merge after CI passes

## 🛡️ Security First

Security updates are prioritized and grouped separately to ensure:
- Quick identification of critical patches
- Immediate attention to vulnerabilities
- Separate handling from feature updates

## 📊 Monitoring

Keep track of:
- Weekly dependency update patterns
- Security vulnerability frequency
- Update success/failure rates
- Impact on application stability

---

*This configuration ensures WanderLust stays secure and up-to-date while maintaining stability for contributors and users.*