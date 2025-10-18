# 📋 Issue Guidelines for GSSoC'25 Contributors

## 🎯 How Issues Are Labeled

Our automated labeler assigns **Level1**, **Level2**, or **Level3** labels based on **actual complexity**, not just keywords.

### ⚠️ Important: Anti-Abuse Measures

Simply writing "bug", "critical", or "urgent" **will NOT** give you Level3 automatically. The system is smart and looks at:

1. **Content Quality**: Length and detail of your description
2. **Technical Indicators**: Code blocks, file paths, specific technical terms
3. **Multiple Indicators**: Level3 requires MULTIPLE advanced indicators
4. **Structure**: Numbered steps, expected behavior, actual behavior

---

## 🏷️ Label Meanings

### Level1 (5 points) ✅
**Good for first-time contributors**

Examples:
- Fix typos or grammar in documentation
- Update README or other docs
- Change CSS colors, fonts, or styling
- Fix broken links
- Add comments to code
- Update images or icons

**Requirements**: 
- Simple, clear description (can be brief)
- Usually affects 1-2 files
- No complex logic changes

---

### Level2 (15 points) 🟡
**Intermediate difficulty - some experience needed**

Examples:
- Add new UI components (forms, buttons, modals)
- Implement search/filter functionality
- Create new pages or views
- Add validation to forms
- Integrate third-party libraries
- Improve user experience

**Requirements**:
- Clear description with **at least 150+ characters**
- Explain **what** needs to be done
- Mention specific features or components
- May require changes to multiple files

---

### Level3 (30 points) 🔴
**Advanced - significant experience required**

Examples:
- Fix security vulnerabilities
- Database schema migrations
- Authentication/Authorization systems
- API integrations with backend changes
- Performance optimization requiring profiling
- Breaking changes or major refactoring
- Real-time features (WebSocket, streaming)

**Requirements**:
- **Detailed description with 300+ characters**
- **Multiple technical indicators** (not just one "bug" keyword)
- Code blocks showing the issue
- File paths to affected files
- Numbered steps to reproduce (if bug)
- Expected vs actual behavior
- Technical terms showing complexity

---

## ✅ Good Issue Examples

### ✅ Good Level1 Issue
```
Title: Fix typo in navbar menu
Description: The word "Accomodation" is spelled wrong in the navbar. 
It should be "Accommodation" with double 'm'. 
File: views/includes/navbar.ejs, line 23
```

### ✅ Good Level2 Issue
```
Title: Add search functionality to listings page
Description: Currently users can't search through listings. We need to add a search bar 
that filters listings by title, location, and description in real-time.

Requirements:
- Add search input in the listings index page
- Implement frontend filtering using JavaScript
- Make it responsive for mobile devices
- Add clear/reset button

Files to modify:
- views/listings/index.ejs
- public/JS/listings.js
- public/CSS/style.css
```

### ✅ Good Level3 Issue
```
Title: Security vulnerability - user authentication bypass
Description: Found a critical security issue where users can access protected routes 
without proper authentication by manipulating session cookies.

Technical Details:
- Affected files: middleware.js, routes/user.js
- The isLoggedIn middleware doesn't properly validate JWT tokens
- Steps to reproduce:
  1. Login and get session cookie
  2. Logout but keep cookie
  3. Modify cookie expiry field
  4. Access /listings/new - works without authentication

Expected: Should redirect to login page
Actual: Allows access to protected routes

Security Impact: HIGH - Unauthorized access to CRUD operations

Suggested Fix:
- Implement proper JWT token validation
- Add token expiry checks on server-side
- Use refresh token mechanism
```

---

## ❌ Bad Issue Examples (Will Get Level1)

### ❌ Bad - Too Vague
```
Title: Fix bug
Description: There is a bug, please fix it urgent
```
**Why**: No details, no file paths, generic words, very short

### ❌ Bad - Keyword Stuffing
```
Title: Critical urgent bug error crash broken fix needed ASAP
Description: Bug bug bug critical urgent fix error crash
```
**Why**: Just spamming keywords without real content = penalty points

### ❌ Bad - Single Word/Lazy
```
Title: Error
Description: Not working
```
**Why**: Zero context, zero technical detail

---

## 💡 Tips for Getting Appropriate Labels

1. **Be Specific**: "Fix navbar color to #FF6347" not "Fix navbar"
2. **Show Evidence**: Add screenshots, code snippets, error messages
3. **List Files**: Mention which files need to be changed
4. **Explain Impact**: Who is affected? How severe?
5. **Break It Down**: Use numbered steps for bugs
6. **Be Honest**: Don't fake complexity - reviewers will notice

---

## 🤖 How the Auto-Labeler Works

The system analyzes your issue and looks for:

### ✅ Positive Indicators (Increase Score)
- Multiple technical keywords (security, database, API)
- Code blocks and file paths
- Numbered steps and expected behavior
- Detailed descriptions (300+ chars for Level3)
- Specific technical terms

### ⚠️ Negative Indicators (Decrease Score)
- Very short descriptions (< 50 chars)
- Generic words only (bug, fix, error)
- Keyword stuffing without context
- Single-word issues
- Lazy requests ("please fix", "help me")
- Questions without specifics

### 🎯 Scoring Thresholds
- **Level3**: 50+ points (needs multiple indicators + detail)
- **Level2**: 25-49 points (clear feature with description)
- **Level1**: < 25 points (simple or vague issues)

---

## 📞 Questions?

If you're unsure about complexity:
1. Start with what you think is accurate
2. The auto-labeler will adjust if needed
3. Maintainers may manually adjust labels
4. Focus on **quality** over **points**

**Remember**: Better to get Level1 for a well-written simple issue than Level1 for a poorly-written complex issue! ✨
