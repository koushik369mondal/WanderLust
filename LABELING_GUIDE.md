# 🏷️ GSSoC'25 Auto-Labeling Guide for Contributors

Welcome to WanderLust! This guide explains how our intelligent auto-labeling system assigns **Level1**, **Level2**, and **Level3** labels to help you understand task complexity and choose appropriate contributions.

## 🎯 Overview

Our **HIGH PRIORITY Auto-Labeler** automatically analyzes Issues and Pull Requests to assign complexity levels. Every contribution gets:
- 🎪 **GSSoC'25** label (indicating participation in GirlScript Summer of Code 2025)
- 📊 **Level1/2/3** label (indicating task complexity)

---

## 📋 **Level Classifications**

### 🌱 **Level1 - Beginner Friendly**
*Perfect for newcomers and first-time contributors*

**Characteristics:**
- ✅ Simple documentation updates
- ✅ Minor text/typo corrections
- ✅ Basic CSS styling changes
- ✅ Image replacements or additions
- ✅ Simple UI improvements

**Keywords that trigger Level1:**
- `documentation`, `readme`, `docs`, `typo`, `text`
- `comment`, `style`, `css`, `color`, `font`
- `image`, `icon`, `minor`

**Examples:**
- Fix typos in README.md
- Update color scheme in CSS
- Add missing comments to code
- Replace images or icons
- Minor text corrections

---

### 🔧 **Level2 - Intermediate**
*Requires some programming experience*

**Characteristics:**
- ✅ New feature implementation
- ✅ UI/UX enhancements
- ✅ Frontend component development
- ✅ Route/Controller modifications
- ✅ Moderate functionality changes

**Keywords that trigger Level2:**
- `feature`, `enhancement`, `functionality`, `component`
- `integration`, `improvement`, `update`, `modify`
- `frontend`, `ui`, `interface`, `design`
- `controller`, `route`

**Examples:**
- Add new user interface components
- Implement search functionality
- Create new routes or controllers
- Enhance existing features
- Frontend improvements

---

### ⚡ **Level3 - Advanced**
*Requires significant experience and expertise*

**Characteristics:**
- ✅ Complex bug fixes
- ✅ Database schema changes
- ✅ Security implementations
- ✅ Backend architecture modifications
- ✅ Performance optimizations
- ✅ CI/CD and deployment tasks

**Keywords that trigger Level3:**
- `bug`, `error`, `crash`, `broken`, `fix`
- `database`, `schema`, `migration`, `auth`, `security`
- `api`, `backend`, `server`, `deploy`, `docker`
- `ci/cd`, `workflow`, `breaking change`
- `architecture`, `refactor`, `performance`, `optimization`

**Examples:**
- Fix critical application bugs
- Implement authentication systems
- Database schema modifications
- API development and integration
- Performance optimization
- Security enhancements

---

## 🤖 **How the Auto-Labeler Works**

### For Issues:
1. **Content Analysis**: Scans title and description for keywords
2. **Complexity Scoring**: Assigns points based on keyword matches
3. **Length Factor**: Considers description length for complexity
4. **Final Classification**: Determines level based on total score

### For Pull Requests:
1. **File Analysis**: Examines changed files and their importance
2. **Volume Assessment**: Considers number of files and lines changed
3. **Pattern Recognition**: Identifies file types and complexity
4. **Smart Classification**: Assigns level based on comprehensive analysis

---

## 📊 **Scoring System**

### Issue Scoring:
- **Level3 keywords**: +8 points each
- **Level2 keywords**: +4 points each  
- **Level1 keywords**: +1 point each
- **Long descriptions**: +1 to +5 points

**Thresholds:**
- 🌱 **Level1**: 0-9 points
- 🔧 **Level2**: 10-24 points
- ⚡ **Level3**: 25+ points

### Pull Request Scoring:
- **Core files** (app.js, schema.js): +15 points
- **Models**: +12 points
- **Controllers/Routes**: +8 points
- **Views/Public**: +3 points
- **Documentation**: +1 point

**Additional factors:**
- **File count**: +8 to +20 points
- **Line changes**: +5 to +15 points

**Thresholds:**
- 🌱 **Level1**: 0-14 points
- 🔧 **Level2**: 15-39 points
- ⚡ **Level3**: 40+ points

---

## 🎯 **Tips for Contributors**

### 🌱 **Starting with Level1:**
- Look for documentation improvements
- Fix typos or formatting issues
- Make simple CSS/styling changes
- Add comments to code
- Update README or guides

### 🔧 **Moving to Level2:**
- Implement new features
- Create UI components
- Add new routes or pages
- Enhance user experience
- Work on frontend functionality

### ⚡ **Tackling Level3:**
- Fix complex bugs
- Work on backend systems
- Implement security features
- Optimize performance
- Handle database operations

---

## 🚀 **Workflow Integration**

Our auto-labeler runs automatically when you:
- 📝 **Open a new Issue**
- 🔄 **Edit an existing Issue**
- 🔀 **Create a Pull Request**
- 📤 **Update a Pull Request**

The system will:
1. Analyze your contribution
2. Assign appropriate labels
3. Help maintainers prioritize reviews
4. Guide other contributors

---

## 🤝 **Best Practices**

### For Issues:
- Be descriptive in your issue titles
- Provide detailed explanations
- Include relevant keywords naturally
- Specify the type of contribution clearly

### For Pull Requests:
- Make focused, logical changes
- Follow project structure
- Test your changes thoroughly
- Provide clear commit messages

---

## 📞 **Need Help?**

- 🐛 **Found a labeling issue?** Create an Issue and mention the auto-labeler
- 🤔 **Confused about complexity?** Check similar Issues/PRs for reference
- 💡 **Have suggestions?** We welcome feedback on improving the system

---

## 🎉 **Welcome to GSSoC'25!**

Thank you for contributing to WanderLust! Our auto-labeling system helps create a welcoming environment for contributors of all experience levels. 

**Happy Coding!** 🚀

---

*This guide is automatically maintained. The auto-labeler system is continuously improved based on contributor feedback and usage patterns.*