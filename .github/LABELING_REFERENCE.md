# 🤖 Auto-Labeler Quick Reference Card

## 🏷️ Level Assignment Cheat Sheet

### 🌱 **Level1 Keywords** (Beginner - +1 point each)
```
documentation, readme, docs, typo, text, comment, 
style, css, color, font, image, icon, minor
```

### 🔧 **Level2 Keywords** (Intermediate - +4 points each)
```
feature, enhancement, functionality, component, integration, 
improvement, update, modify, change, frontend, ui, interface, 
design, controller, route
```

### ⚡ **Level3 Keywords** (Advanced - +8 points each)
```
bug, error, crash, broken, fix, database, schema, migration, 
auth, security, api, backend, server, deploy, docker, ci/cd, 
workflow, breaking change, architecture, refactor, performance, optimization
```

## 📊 **Scoring Thresholds**

### Issues:
- **Level1**: 0-9 points
- **Level2**: 10-24 points  
- **Level3**: 25+ points

### Pull Requests:
- **Level1**: 0-14 points
- **Level2**: 15-39 points
- **Level3**: 40+ points

## 📁 **File Complexity Scores (PRs)**

| File Type | Points | Examples |
|-----------|--------|----------|
| Core Files | +15 | `app.js`, `schema.js`, `package.json` |
| Models | +12 | `models/*.js` |
| Controllers/Routes | +8 | `controllers/`, `routes/`, `middleware.js` |
| Views/Public | +3 | `views/`, `public/` |
| Documentation | +1 | `*.md`, `*.txt` |
| Other | +2 | Any other files |

## 🎯 **Bonus Factors**

### Issues:
- Description > 1000 chars: +5 points
- Description > 500 chars: +3 points
- Description > 200 chars: +1 point

### Pull Requests:
- 15+ files changed: +20 points
- 10+ files changed: +15 points
- 5+ files changed: +8 points
- 1000+ line changes: +15 points
- 500+ line changes: +10 points
- 200+ line changes: +5 points

---

*This card helps you understand how the auto-labeler assigns complexity levels. For full details, see [LABELING_GUIDE.md](LABELING_GUIDE.md)*