# 📸 Screenshot Requirement Setup Guide

This guide explains how to implement and configure the screenshot requirement workflow for pull requests in the WanderLust repository.

## 🎯 Overview

The screenshot requirement workflow automatically checks that every pull request includes at least one screenshot or image in the PR description. This ensures:

- **Visual Documentation**: Reviewers can quickly understand UI/UX changes
- **Quality Assurance**: Visual proof that changes work as expected
- **Better Reviews**: More thorough and efficient code review process
- **Historical Record**: Visual documentation of project evolution

## 🚀 Workflow Features

### ✅ Automatic Detection
- **Markdown Images**: `![alt text](image-url)`
- **HTML Images**: `<img src="image-url" alt="alt text">`
- **GitHub Uploads**: Drag-and-drop uploaded images
- **Direct URLs**: Direct links to image files

### ⏭️ Smart Skip Logic
The workflow automatically skips screenshot requirements for:
- Documentation PRs (`docs:`, `documentation`)
- Test-only changes (`test:`, `testing`)
- Build/CI changes (`ci:`, `build`)
- Dependency updates (`deps:`, `dependencies`)
- Refactoring without visual changes (`refactor:`)
- Configuration changes (`config:`)
- Maintenance tasks (`chore:`, `maintenance`)
- Security patches (`security:`, `hotfix`)

### 📝 Manual Skip Options
Add these prefixes to PR titles to skip the check:
- `[skip-screenshot]`
- `[no-screenshot]`

## 🛠️ Setup Instructions

### Step 1: Workflow Installation

The workflow file `screenshot-check.yml` is automatically active once merged to the main branch. It will:

1. **Trigger on PR Events**: `opened`, `edited`, `synchronize`
2. **Check PR Description**: Scan for images and screenshots
3. **Set Status Check**: Creates a `screenshot-check` status
4. **Provide Feedback**: Comments with detailed instructions if check fails

### Step 2: Enable Branch Protection Rules

To make screenshot checks **mandatory** before merging:

#### Option A: GitHub Web Interface

1. **Navigate to Settings**:
   ```
   Repository → Settings → Branches
   ```

2. **Add Branch Protection Rule**:
   - Branch name pattern: `main` (or your default branch)
   - Check "Restrict pushes that create files"
   - Check "Require status checks to pass before merging"

3. **Configure Status Checks**:
   - Check "Require branches to be up to date before merging"
   - In the search box, type: `screenshot-check`
   - Select the `screenshot-check` status check
   - Click "Create" or "Save changes"

#### Option B: GitHub CLI

```bash
# Create branch protection rule with screenshot check
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["screenshot-check"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

#### Option C: GitHub API (using curl)

```bash
curl -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": ["screenshot-check"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1
    },
    "restrictions": null
  }'
```

### Step 3: Verification

1. **Create a test PR** without a screenshot
2. **Verify the check fails** and provides helpful feedback
3. **Add a screenshot** and verify the check passes
4. **Confirm branch protection** prevents merging without the check

## 📷 How to Add Screenshots

### Method 1: GitHub Upload (Recommended)

1. **Edit PR Description**
2. **Drag and Drop**: Drop image files directly into the text area
3. **Auto-Generated**: GitHub creates URLs like:
   ```
   https://user-images.githubusercontent.com/12345/image.png
   ```

### Method 2: Markdown Syntax

```markdown
![Before and After Comparison](https://user-images.githubusercontent.com/12345/before-after.png)

![New Feature Screenshot](https://user-images.githubusercontent.com/12345/new-feature.png)
```

### Method 3: HTML (Advanced)

```html
<img src="https://user-images.githubusercontent.com/12345/image.png" 
     alt="Description of the change" 
     width="600">

<details>
<summary>Click to view more screenshots</summary>

<img src="https://user-images.githubusercontent.com/12345/mobile.png" 
     alt="Mobile view" 
     width="300">
</details>
```

## 📋 Best Practices

### ✅ What to Include

- **Before/After Comparisons**: Show the state before and after changes
- **New Features**: Screenshots of new UI elements or pages
- **Bug Fixes**: Visual proof that issues are resolved
- **Mobile Views**: Include mobile screenshots for responsive changes
- **Error States**: Show error handling and edge cases
- **Accessibility**: Demonstrate accessibility improvements

### 🎨 Screenshot Quality Tips

- **High Resolution**: Use clear, high-quality images
- **Annotations**: Add arrows, highlights, or callouts to show specific changes
- **Consistent Browser**: Use the same browser for consistency
- **Light/Dark Themes**: Show both themes if applicable
- **Different Screen Sizes**: Include desktop, tablet, and mobile views

### 📝 Organization Tips

```markdown
## 📷 Screenshots

### 🆕 New Feature: User Profile
![User Profile Page](screenshot-url)

### 🐛 Bug Fix: Navigation Menu
| Before | After |
|--------|-------|
| ![Before](before-url) | ![After](after-url) |

### 📱 Mobile Responsiveness
<details>
<summary>Mobile Screenshots</summary>

![Mobile View 1](mobile-1-url)
![Mobile View 2](mobile-2-url)
</details>
```

## 🔧 Customization

### Modify Skip Patterns

Edit the `skipPatterns` array in the workflow to customize which PRs skip the check:

```javascript
const skipPatterns = [
  /^\[skip[\s-]?screenshot\]/i,
  /^docs?[\s\(\[\-:]|documentation/i,
  // Add your custom patterns here
  /^your-custom-pattern/i
];
```

### Change Image Detection

Modify the `imagePatterns` array to detect different image formats or sources:

```javascript
const imagePatterns = [
  /!\[.*?\]\(.*?\.(png|jpg|jpeg|gif|webp|svg).*?\)/gi,
  // Add custom patterns
  /your-custom-image-pattern/gi
];
```

### Custom Status Context

Change the status check name by modifying the `context` parameter:

```javascript
await github.rest.repos.createCommitStatus({
  // ...other parameters
  context: 'your-custom-check-name'
});
```

## 🚨 Troubleshooting

### Check Not Appearing
1. Verify the workflow file is in `.github/workflows/`
2. Check that the workflow has proper permissions
3. Ensure the branch protection rule includes the correct context name

### False Positives
1. Review the skip patterns and add more if needed
2. Check if the PR title or description matches skip conditions
3. Verify image URLs are properly formatted

### Status Check Fails to Update
1. Check GitHub Actions logs for errors
2. Verify the workflow has `statuses: write` permission
3. Ensure the repository has Actions enabled

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Markdown Image Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)

## 🤝 Contributing

If you have suggestions for improving the screenshot requirement workflow, please:

1. Open an issue with your suggestion
2. Include examples of edge cases or improvements
3. Consider submitting a pull request with your changes

---

💡 **Pro Tip**: This workflow helps maintain high-quality visual documentation and makes code reviews more effective by providing visual context for changes!