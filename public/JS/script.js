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
    this.setTheme(this.currentTheme);
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  getStoredTheme() {
    return localStorage.getItem("theme") || "light";
  }

  setStoredTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.updateThemeIcon(theme);
    this.currentTheme = theme;
  }

  updateThemeIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
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