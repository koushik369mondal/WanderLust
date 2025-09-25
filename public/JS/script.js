//
// ────────────────────────────────────────────────────────────────── I ──────────
//   ┌───────────────────────────────────────────────────────────────────────────┐
//   │ WANDERLUST CUSTOM SCRIPT                                                  │
//   └───────────────────────────────────────────────────────────────────────────┘
//
// ────────────────────────────────────────────────────────────────────────────
//

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------
    // FORM VALIDATION
    // ------------------
    // This is the standard Bootstrap 5 validation script.
    // It finds all forms with the `.needs-validation` class and applies custom styles.
    (() => {
        "use strict";
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    })();


    // ------------------
    // THEME MANAGER
    // ------------------
    // Manages light/dark theme switching and persists the choice in localStorage.
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById("theme-toggle");
            this.themeIcon = document.getElementById("theme-icon");
            this.currentTheme = localStorage.getItem("theme") || "light";
            this.init();
        }

        init() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease-in-out';
            this.setTheme(this.currentTheme);
            if (this.themeToggle) {
                this.themeToggle.addEventListener("click", () => this.toggleTheme());
            }
            setTimeout(() => { document.body.style.opacity = '1'; }, 50);
        }

        setTheme(theme) {
            document.body.classList.add('theme-switching');
            document.documentElement.setAttribute("data-theme", theme);
            this.updateThemeIcon(theme);
            this.currentTheme = theme;
            localStorage.setItem("theme", theme);
            setTimeout(() => { document.body.classList.remove('theme-switching'); }, 500);
        }

        updateThemeIcon(theme) {
            if (this.themeIcon) {
                this.themeIcon.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    this.themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
                    this.themeIcon.style.transform = 'scale(1)';
                }, 150);
            }
        }

        toggleTheme() {
            const newTheme = this.currentTheme === "light" ? "dark" : "light";
            this.setTheme(newTheme);
        }
    }

    // ------------------
    // SEARCH MANAGER
    // ------------------
    // Handles the search form submission to redirect with a query parameter.
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

    // ------------------
    // INITIALIZATION
    // ------------------
    new ThemeManager();
    new SearchManager();


    // ------------------
    // MODAL LOGIC (Highly Rated Badge)
    // ------------------
    // Exposes a global function to show a custom modal.
    window.showRatedModal = function(title, avgRating) {
        const modal = document.createElement('div');
        modal.id = 'rated-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.25); display: flex; align-items: center;
            justify-content: center; z-index: 9999;
        `;

        modal.innerHTML = `
            <div style="background: rgba(255,255,255,0.95); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 2rem 2.5rem; text-align: center; max-width: 350px;">
                <h3 style="color: #1976d2; font-weight: bold; margin-bottom: 1rem;">Highly Rated</h3>
                <div style="margin-bottom: 1rem; color: #333;">This listing is popular with guests! It has an average rating of <b>${avgRating}/5</b> stars, based on real guest reviews.</div>
                <div style="font-size: 1.5rem; color: #ffc107; margin-bottom: 1.5rem;">
                    ${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}
                </div>
                <button onclick="document.body.removeChild(document.getElementById('rated-modal'))" style="background: #1976d2; color: white; border: none; border-radius: 8px; padding: 0.5rem 1.5rem; font-size: 1rem; cursor: pointer;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    };
});