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


  // ✨ Sparkle Effect (Rave Neon)
  document.addEventListener("mousemove", (e) => {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    // Neon rave colors
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff8800", "#00ff44"];
    sparkle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;

    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;

    // Random size for wavy look
    const size = Math.random() * 10 + 6;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    // Random rotation + flicker
    sparkle.style.transform = `rotate(${Math.random() * 360}deg) scale(1)`;
    sparkle.style.animation = "fadeOut 0.8s forwards, flicker 0.3s alternate infinite";

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 800);
  });
  document.addEventListener("mousemove", (e) => {
  let glow = document.getElementById("cursor-glow");

  if (!glow) {
    glow = document.createElement("div");
    glow.id = "cursor-glow";
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
  }

  // Move glow towards cursor
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

});