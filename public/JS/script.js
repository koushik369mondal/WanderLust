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
    // Handles the search form submission and auto-suggestions
    class SearchManager {
        constructor() {
            this.searchForm = document.querySelector('form[role="search"]');
            this.searchInput = document.querySelector(".search-input");
            this.suggestionsContainer = document.getElementById("searchSuggestions");
            this.debounceTimer = null;
            this.init();
        }

        init() {
            if (this.searchForm && this.searchInput) {
                this.searchForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const query = this.searchInput.value.trim();
                    if (query) {
                        this.hideSuggestions();
                        window.location.href = `/listings?search=${encodeURIComponent(query)}`;
                    }
                });

                // Auto-suggestions
                if (this.suggestionsContainer) {
                    this.searchInput.addEventListener("input", (e) => {
                        this.handleSearchInput(e.target.value);
                    });

                    this.searchInput.addEventListener("focus", (e) => {
                        if (e.target.value.length > 1) {
                            this.handleSearchInput(e.target.value);
                        }
                    });

                    this.searchInput.addEventListener("blur", (e) => {
                        // Only hide if not clicking on suggestions
                        if (!this.suggestionsContainer.contains(e.relatedTarget)) {
                            setTimeout(() => this.hideSuggestions(), 200);
                        }
                    });

                    // Prevent suggestions from losing focus when clicked
                    this.suggestionsContainer.addEventListener("mousedown", (e) => {
                        e.preventDefault();
                    });

                    // Handle keyboard navigation
                    this.searchInput.addEventListener("keydown", (e) => {
                        const suggestions = this.suggestionsContainer.querySelectorAll('.search-suggestion-item');
                        const currentActive = this.suggestionsContainer.querySelector('.search-suggestion-item.active');
                        let activeIndex = currentActive ? Array.from(suggestions).indexOf(currentActive) : -1;

                        switch (e.key) {
                            case "Escape":
                                this.hideSuggestions();
                                break;
                            case "ArrowDown":
                                e.preventDefault();
                                if (suggestions.length > 0) {
                                    if (currentActive) currentActive.classList.remove('active');
                                    activeIndex = (activeIndex + 1) % suggestions.length;
                                    suggestions[activeIndex].classList.add('active');
                                }
                                break;
                            case "ArrowUp":
                                e.preventDefault();
                                if (suggestions.length > 0) {
                                    if (currentActive) currentActive.classList.remove('active');
                                    activeIndex = activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1;
                                    suggestions[activeIndex].classList.add('active');
                                }
                                break;
                            case "Enter":
                                if (currentActive) {
                                    e.preventDefault();
                                    currentActive.click();
                                }
                                break;
                        }
                    });
                }
            }
        }

        handleSearchInput(query) {
            clearTimeout(this.debounceTimer);
            
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }

            this.debounceTimer = setTimeout(() => {
                this.fetchSuggestions(query);
            }, 300);
        }

        async fetchSuggestions(query) {
            try {
                const response = await fetch(`/listings/search/suggestions?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();
                this.displaySuggestions(suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                this.hideSuggestions();
            }
        }

        displaySuggestions(suggestions) {
            if (!suggestions || suggestions.length === 0) {
                this.hideSuggestions();
                return;
            }

            this.suggestionsContainer.innerHTML = '';
            // Reset any active states
            this.activeIndex = -1;
            // Reset any active states
            this.activeIndex = -1;
            
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'search-suggestion-item';
                item.innerHTML = `
                    <i class="fas ${suggestion.icon} search-suggestion-icon"></i>
                    <span class="search-suggestion-text">${suggestion.value}</span>
                    <small class="search-suggestion-type">${suggestion.type}</small>
                `;
                
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.searchInput.value = suggestion.value;
                    this.hideSuggestions();
                    // Use window.location instead of form.submit() for better reliability
                    window.location.href = `/listings?search=${encodeURIComponent(suggestion.value)}`;
                });
                
                // Also handle mousedown to prevent blur
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                });
                
                this.suggestionsContainer.appendChild(item);
            });

            this.showSuggestions();
        }

        showSuggestions() {
            this.suggestionsContainer.classList.add('show');
        }

        hideSuggestions() {
            this.suggestionsContainer.classList.remove('show');
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