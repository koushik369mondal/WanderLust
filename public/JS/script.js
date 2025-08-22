// Form Validation
(() => {
  "use strict";
  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });
})();

// Theme Manager
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.themeIcon = document.getElementById("theme-icon");
    this.currentTheme = this.getStoredTheme();
    this.init();
  }

  init() {
    // Add a smooth fade-in effect when page loads
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    this.setTheme(this.currentTheme);
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
    
    // Fade in the page after theme is applied
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 50);
  }

  getStoredTheme() {
    return localStorage.getItem("theme") || "light";
  }

  setStoredTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  setTheme(theme) {
    // Add transitioning class for enhanced animations
    document.body.classList.add('theme-switching');
    document.documentElement.setAttribute("data-theme", theme);
    this.updateThemeIcon(theme);
    this.currentTheme = theme;
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-switching');
    }, 500);
  }

  updateThemeIcon(theme) {
    if (this.themeIcon) {
      // Add a smooth transition effect to icon change
      this.themeIcon.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        this.themeIcon.className =
          theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        this.themeIcon.style.transform = 'scale(1)';
      }, 150);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setStoredTheme(newTheme);
    this.setTheme(newTheme);
  }
}

// Search Manager
class SearchManager {
  constructor() {
    this.searchForm = document.querySelector('form[role="search"]');
    this.searchInput = document.querySelector(".search-inp");
    this.init();
  }

  init() {
    if (this.searchForm) {
      this.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        if (query) {
          window.location.href = `/listings?search=${encodeURIComponent(query)}`;
        }
      });
    }
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new SearchManager();
});