# Tailwind CSS Setup Guide for WanderLust

## ✅ Installation Complete!

Tailwind CSS has been successfully installed and configured in your WanderLust project.

---

## 📁 Files Created/Modified

### New Files:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `public/CSS/tailwind.input.css` - Source file with Tailwind directives
- `public/CSS/tailwind.output.css` - Compiled CSS (auto-generated)

### Modified Files:
- `package.json` - Added build scripts
- `views/layouts/boilerplate.ejs` - Added Tailwind CSS link

---

## 🎯 Configuration Details

### Prefix: `tw-`
All Tailwind classes are prefixed with `tw-` to avoid conflicts with Bootstrap.

**Example:**
```html
<!-- Bootstrap class -->
<div class="flex">Bootstrap flex</div>

<!-- Tailwind class (with prefix) -->
<div class="tw-flex">Tailwind flex</div>
```

### Preflight Disabled
Tailwind's CSS reset is disabled to preserve Bootstrap styles.

---

## 🚀 Usage

### Available NPM Scripts

```bash
# Build Tailwind CSS once (for production)
npm run build:css

# Watch for changes and rebuild automatically (for development)
npm run watch:css

# Run both Tailwind watcher and Node server
npm run dev:all
```

---

## 💡 How to Use Tailwind Classes

### Example 1: Basic Utility Classes
```html
<div class="tw-bg-blue-500 tw-text-white tw-p-4 tw-rounded-lg">
  This is a blue box with white text
</div>
```

### Example 2: Flexbox Layout
```html
<div class="tw-flex tw-items-center tw-justify-between tw-gap-4">
  <div class="tw-flex-1">Left</div>
  <div class="tw-flex-1">Right</div>
</div>
```

### Example 3: Responsive Design
```html
<div class="tw-text-sm md:tw-text-lg lg:tw-text-xl">
  Small on mobile, large on desktop
</div>
```

### Example 4: Hover Effects
```html
<button class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-transition">
  Hover me!
</button>
```

### Example 5: Custom Components (Pre-defined)
```html
<!-- Uses the .tw-btn-primary class from tailwind.input.css -->
<button class="tw-btn-primary">Click me</button>

<!-- Card component -->
<div class="tw-card">
  <h3 class="tw-text-lg tw-font-bold">Card Title</h3>
  <p class="tw-text-gray-600">Card content</p>
</div>

<!-- Badge -->
<span class="tw-badge tw-bg-blue-500 tw-text-white">New</span>
```

---

## 🎨 Color Palette (Extended)

```javascript
// Available custom colors in tailwind.config.js
{
  primary: '#007bff',    // Blue
  secondary: '#6c757d',  // Gray
  success: '#28a745',    // Green
  danger: '#dc3545',     // Red
  warning: '#ffc107',    // Yellow
  info: '#17a2b8',       // Cyan
}
```

**Usage:**
```html
<div class="tw-bg-primary tw-text-white">Primary color</div>
<div class="tw-bg-success tw-text-white">Success color</div>
```

---

## 📝 Example: Update Navbar with Tailwind

### Before (Bootstrap only):
```html
<div class="d-flex align-items-center gap-3">
  <button class="btn btn-primary">Click</button>
</div>
```

### After (Bootstrap + Tailwind):
```html
<div class="d-flex align-items-center gap-3">
  <button class="btn btn-primary tw-shadow-lg tw-transition hover:tw-shadow-xl">
    Click
  </button>
</div>
```

---

## 🔄 Development Workflow

### Option 1: Watch Mode (Recommended)
1. Open two terminals
2. Terminal 1: `npm run watch:css` (watches for changes)
3. Terminal 2: `npm run dev` (runs your Node server)

### Option 2: Use dev:all Script
```bash
npm run dev:all
```
This runs both the Tailwind watcher and Node server simultaneously.

### Option 3: Build Once
```bash
npm run build:css
npm start
```

---

## 🎭 Mixing Bootstrap and Tailwind

### Best Practices:

1. **Use Bootstrap for:**
   - Component structure (navbar, modals, dropdowns)
   - Grid system (if you prefer it)
   - Existing components

2. **Use Tailwind for:**
   - Custom styling and spacing
   - Responsive utilities
   - Modern layouts (flexbox, grid)
   - Quick prototyping

### Example: Hybrid Component
```html
<div class="card tw-shadow-lg tw-transition hover:tw-shadow-2xl">
  <div class="card-body tw-p-6">
    <h5 class="card-title tw-text-2xl tw-font-bold tw-text-primary">
      Hybrid Card
    </h5>
    <p class="card-text tw-text-gray-600 tw-mt-2">
      Using Bootstrap's card structure with Tailwind utilities
    </p>
    <button class="btn btn-primary tw-rounded-full tw-shadow-md hover:tw-shadow-lg tw-transition">
      Learn More
    </button>
  </div>
</div>
```

---

## 📚 Common Tailwind Classes Reference

### Spacing
- `tw-p-4` - Padding (all sides)
- `tw-px-4` - Padding (left/right)
- `tw-py-2` - Padding (top/bottom)
- `tw-m-4` - Margin (all sides)
- `tw-mt-2` - Margin top
- `tw-gap-4` - Gap between flex/grid items

### Typography
- `tw-text-sm` - Small text
- `tw-text-lg` - Large text
- `tw-text-xl` - Extra large text
- `tw-font-bold` - Bold text
- `tw-font-semibold` - Semi-bold text
- `tw-text-center` - Center text

### Colors
- `tw-bg-blue-500` - Background color
- `tw-text-white` - Text color
- `tw-text-gray-600` - Gray text

### Layout
- `tw-flex` - Flexbox
- `tw-grid` - CSS Grid
- `tw-items-center` - Align items center
- `tw-justify-between` - Justify space between
- `tw-hidden` - Hide element
- `tw-block` - Display block

### Borders & Shadows
- `tw-rounded` - Rounded corners
- `tw-rounded-lg` - Large rounded corners
- `tw-rounded-full` - Fully rounded (circle)
- `tw-shadow` - Box shadow
- `tw-shadow-lg` - Large shadow
- `tw-border` - Border

### Responsive
- `md:tw-flex` - Flex on medium screens and up
- `lg:tw-text-xl` - XL text on large screens and up
- `sm:tw-hidden` - Hide on small screens and up

---

## 🐛 Troubleshooting

### Issue: "No utility classes detected"
**Solution:** Make sure you're using Tailwind classes in your `.ejs` files and run `npm run build:css` again.

### Issue: Styles not applying
1. Check if `tailwind.output.css` exists in `public/CSS/`
2. Clear browser cache
3. Make sure you're using the `tw-` prefix
4. Run `npm run build:css` again

### Issue: Conflicts with Bootstrap
- Always use the `tw-` prefix for Tailwind classes
- Bootstrap classes don't need a prefix

---

## 📖 Documentation

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind Play (Online Editor)](https://play.tailwindcss.com/)

---

## 🎉 Next Steps

1. **Start the watcher:**
   ```bash
   npm run watch:css
   ```

2. **Try adding Tailwind classes to a component:**
   - Open any `.ejs` file
   - Add classes like `tw-bg-blue-500 tw-p-4 tw-rounded`
   - The watcher will automatically rebuild the CSS

3. **Experiment with the pre-built components:**
   ```html
   <button class="tw-btn-primary">Primary Button</button>
   <div class="tw-card">Card Component</div>
   ```

4. **Gradually migrate components:**
   - Start with new features
   - Use Tailwind for fine-tuning existing Bootstrap components
   - Consider fully migrating small components first

---

## 💪 Ready to Build!

Tailwind CSS is now fully integrated into your WanderLust project. Start using utility classes with the `tw-` prefix alongside your existing Bootstrap code!

Happy coding! 🚀
