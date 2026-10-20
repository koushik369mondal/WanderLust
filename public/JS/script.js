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
    // SERVICE WORKER - CLEANUP ONLY
    // ------------------
    // Emergency cache clear already handled by emergencyCacheClear.js
    // Just ensure no service workers are running
    if ('serviceWorker' in navigator && !sessionStorage.getItem('swCleanupDone')) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            if (registrations.length > 0) {
                console.log('🧹 Cleaning up service workers...');
                registrations.forEach(registration => {
                    registration.unregister().then(function(success) {
                        if (success) {
                            console.log('✅ Service Worker cleaned up');
                        }
                    });
                });
            }
            sessionStorage.setItem('swCleanupDone', 'true');
        });
    }

    // PWA Install Prompt - DISABLED (offline features removed)
    // Users will always fetch fresh data from the database
    /*
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    */

    function showInstallPrompt() {
        const installToast = document.createElement('div');
        installToast.className = 'toast align-items-center text-white bg-primary border-0 position-fixed';
        installToast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        installToast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fa-solid fa-mobile-screen-button me-2"></i>
                    Install WanderLust for offline access!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
            <div class="mt-2 pt-2 border-top">
                <button class="btn btn-sm btn-light me-2" id="install-btn">Install</button>
                <button class="btn btn-sm btn-outline-light" data-bs-dismiss="toast">Later</button>
            </div>
        `;
        document.body.appendChild(installToast);

        const toast = new bootstrap.Toast(installToast);
        toast.show();

        document.getElementById('install-btn').addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
            toast.hide();
        });
    }

    function showUpdateToast() {
        const updateToast = document.createElement('div');
        updateToast.className = 'toast align-items-center text-white bg-info border-0 position-fixed';
        updateToast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        updateToast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fa-solid fa-refresh me-2"></i>
                    New version available! Refresh to update.
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
            <div class="mt-2 pt-2 border-top">
                <button class="btn btn-sm btn-light me-2" id="refresh-btn">Refresh</button>
                <button class="btn btn-sm btn-outline-light" data-bs-dismiss="toast">Later</button>
            </div>
        `;
        document.body.appendChild(updateToast);

        const toast = new bootstrap.Toast(updateToast);
        toast.show();

        document.getElementById('refresh-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

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
    // Handles the Airbnb-style Search Bar & Rich Suggestions Popover
    // ------------------
    class SearchManager {
        constructor() {
            this.searchForm = document.querySelector('.wander-search-box form[role="search"]');
            this.searchInput = document.getElementById("searchInput");
            this.searchWrapper = document.getElementById("wanderSearchWrapper");
            this.clearBtn = document.getElementById("searchClearBtn");
            this.suggestionsContainer = document.getElementById("searchSuggestions");
            
            // Mobile search elements
            this.mobileInput = document.getElementById("mobileSearchInput");
            this.mobileClearBtn = document.getElementById("mobileSearchClearBtn");
            
            this.debounceTimer = null;
            this.activeIndex = -1;
            this.trendingDestinations = [
                { name: "Goa", subtitle: "Beachfront villas & parties", icon: "fa-umbrella-beach" },
                { name: "Manali", subtitle: "Mountain escapes & snow", icon: "fa-mountain" },
                { name: "Phuket", subtitle: "Island paradises & resorts", icon: "fa-water" },
                { name: "Dubai", subtitle: "Luxury desert & city skyline", icon: "fa-city" },
                { name: "Tokyo", subtitle: "Culture, food & vibrant stays", icon: "fa-torii-gate" },
                { name: "Scottish Highlands", subtitle: "Castles & historic lochs", icon: "fa-chess-rook" }
            ];
            this.topCategories = [
                { name: "Trending", icon: "fa-fire" },
                { name: "Beachfront", icon: "fa-umbrella-beach" },
                { name: "Mountains", icon: "fa-mountain" },
                { name: "Iconic Cities", icon: "fa-mountain-city" },
                { name: "Cabins", icon: "fa-tents" },
                { name: "Castles", icon: "fa-chess-rook" }
            ];

            this.init();
        }

        init() {
            this.setupDesktopSearch();
            this.setupMobileSearch();
            this.setupGlobalKeyboardShortcut();
        }

        setupDesktopSearch() {
            if (!this.searchInput) return;

            // Update clear button & kbd visibility initially
            this.updateClearState();

            // Form Submit
            if (this.searchForm) {
                this.searchForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const query = this.searchInput.value.trim();
                    this.hideSuggestions();
                    if (query) {
                        window.location.href = `/listings?search=${encodeURIComponent(query)}`;
                    } else {
                        window.location.href = `/listings`;
                    }
                });
            }

            // Input listener
            this.searchInput.addEventListener("input", (e) => {
                const val = e.target.value;
                this.updateClearState();
                if (val.trim().length >= 2) {
                    this.handleDebouncedSearch(val.trim());
                } else if (val.trim().length === 0) {
                    this.renderDefaultSuggestions();
                } else {
                    this.hideSuggestions();
                }
            });

            // Focus listener: show default trending popover if empty, or search suggestions if text
            this.searchInput.addEventListener("focus", (e) => {
                const val = e.target.value.trim();
                if (val.length >= 2) {
                    this.handleDebouncedSearch(val);
                } else {
                    this.renderDefaultSuggestions();
                }
            });

            // Clear button
            if (this.clearBtn) {
                this.clearBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.searchInput.value = "";
                    this.updateClearState();
                    this.searchInput.focus();
                    this.renderDefaultSuggestions();
                });
            }

            // Click outside to hide suggestions
            document.addEventListener("click", (e) => {
                if (
                    this.suggestionsContainer &&
                    !this.suggestionsContainer.contains(e.target) &&
                    !this.searchInput.contains(e.target) &&
                    !(this.clearBtn && this.clearBtn.contains(e.target))
                ) {
                    this.hideSuggestions();
                }
            });

            // Keyboard navigation
            this.searchInput.addEventListener("keydown", (e) => {
                if (!this.suggestionsContainer || !this.suggestionsContainer.classList.contains("show")) {
                    return;
                }

                const items = this.suggestionsContainer.querySelectorAll(".search-suggestion-item, .search-suggestion-chip");
                if (!items.length) return;

                if (e.key === "Escape") {
                    this.hideSuggestions();
                    this.searchInput.blur();
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (this.activeIndex >= 0 && items[this.activeIndex]) {
                        items[this.activeIndex].classList.remove("active");
                    }
                    this.activeIndex = (this.activeIndex + 1) % items.length;
                    items[this.activeIndex].classList.add("active");
                    items[this.activeIndex].scrollIntoView({ block: "nearest" });
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (this.activeIndex >= 0 && items[this.activeIndex]) {
                        items[this.activeIndex].classList.remove("active");
                    }
                    this.activeIndex = this.activeIndex <= 0 ? items.length - 1 : this.activeIndex - 1;
                    items[this.activeIndex].classList.add("active");
                    items[this.activeIndex].scrollIntoView({ block: "nearest" });
                } else if (e.key === "Enter") {
                    if (this.activeIndex >= 0 && items[this.activeIndex]) {
                        e.preventDefault();
                        items[this.activeIndex].click();
                    }
                }
            });
        }

        setupMobileSearch() {
            if (!this.mobileInput) return;

            const updateMobileClear = () => {
                if (!this.mobileClearBtn) return;
                this.mobileClearBtn.style.display = this.mobileInput.value.trim().length > 0 ? "inline-flex" : "none";
            };

            this.mobileInput.addEventListener("input", updateMobileClear);

            if (this.mobileClearBtn) {
                this.mobileClearBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.mobileInput.value = "";
                    updateMobileClear();
                    this.mobileInput.focus();
                });
            }
        }

        setupGlobalKeyboardShortcut() {
            // Pressing "/" focuses search input anywhere on the page
            document.addEventListener("keydown", (e) => {
                if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                    const isEditable = document.activeElement && document.activeElement.isContentEditable;
                    if (tag !== "input" && tag !== "textarea" && !isEditable) {
                        e.preventDefault();
                        if (this.searchInput) {
                            this.searchInput.focus();
                            this.searchInput.select();
                        }
                    }
                }
            });
        }

        updateClearState() {
            const hasVal = this.searchInput && this.searchInput.value.trim().length > 0;
            if (this.clearBtn) {
                this.clearBtn.style.display = hasVal ? "inline-flex" : "none";
            }
            if (this.searchWrapper) {
                if (hasVal) {
                    this.searchWrapper.classList.add("has-value");
                } else {
                    this.searchWrapper.classList.remove("has-value");
                }
            }
        }

        handleDebouncedSearch(query) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.fetchSuggestions(query);
            }, 250);
        }

        async fetchSuggestions(query) {
            try {
                const response = await fetch(`/listings/search/suggestions?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const suggestions = await response.json();
                    this.renderQuerySuggestions(query, suggestions);
                } else {
                    this.hideSuggestions();
                }
            } catch (error) {
                console.error("Error fetching search suggestions:", error);
                this.hideSuggestions();
            }
        }

        renderDefaultSuggestions() {
            if (!this.suggestionsContainer) return;

            this.activeIndex = -1;
            let html = `
                <div class="search-suggestions-section">
                    <div class="search-suggestions-title">
                        <i class="fa-solid fa-fire" aria-hidden="true"></i>
                        <span>Trending Destinations</span>
                    </div>
                    <div class="d-flex flex-column gap-1">
                        ${this.trendingDestinations.map(d => `
                            <div class="search-suggestion-item" data-search="${this.escapeHtml(d.name)}" role="option">
                                <span class="search-suggestion-icon"><i class="fa-solid ${d.icon}" aria-hidden="true"></i></span>
                                <div class="d-flex flex-column min-w-0 flex-1">
                                    <span class="search-suggestion-text">${this.escapeHtml(d.name)}</span>
                                    <small class="text-muted" style="font-size: 0.7rem;">${this.escapeHtml(d.subtitle)}</small>
                                </div>
                                <span class="search-suggestion-type">Popular</span>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="search-suggestions-section">
                    <div class="search-suggestions-title">
                        <i class="fa-solid fa-compass" aria-hidden="true"></i>
                        <span>Explore Categories</span>
                    </div>
                    <div class="search-suggestions-grid">
                        ${this.topCategories.map(c => `
                            <div class="search-suggestion-chip" data-category="${this.escapeHtml(c.name)}" role="option">
                                <i class="fa-solid ${c.icon}" aria-hidden="true"></i>
                                <span>${this.escapeHtml(c.name)}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;

            this.suggestionsContainer.innerHTML = html;
            this.bindSuggestionEvents();
            this.showSuggestions();
        }

        renderQuerySuggestions(query, suggestions) {
            if (!this.suggestionsContainer) return;
            if (!suggestions || suggestions.length === 0) {
                this.suggestionsContainer.innerHTML = `
                    <div class="p-3 text-center text-muted" style="font-size: 0.8125rem;">
                        <i class="fa-solid fa-magnifying-glass mb-2" style="font-size: 1.25rem; opacity: 0.5;"></i>
                        <div>No destinations found for "${this.escapeHtml(query)}"</div>
                        <small class="d-block mt-1">Press Enter to search all listings</small>
                    </div>
                `;
                this.showSuggestions();
                return;
            }

            this.activeIndex = -1;
            const qLower = query.toLowerCase();

            let itemsHtml = suggestions.map(s => {
                const val = s.value;
                const idx = val.toLowerCase().indexOf(qLower);
                let highlighted = this.escapeHtml(val);
                if (idx !== -1) {
                    const before = this.escapeHtml(val.substring(0, idx));
                    const match = this.escapeHtml(val.substring(idx, idx + query.length));
                    const after = this.escapeHtml(val.substring(idx + query.length));
                    highlighted = `${before}<mark>${match}</mark>${after}`;
                }

                return `
                    <div class="search-suggestion-item" data-search="${this.escapeHtml(val)}" role="option">
                        <span class="search-suggestion-icon"><i class="fa-solid ${s.icon || 'fa-location-dot'}" aria-hidden="true"></i></span>
                        <span class="search-suggestion-text">${highlighted}</span>
                        <span class="search-suggestion-type">${this.escapeHtml(s.type || 'destination')}</span>
                    </div>
                `;
            }).join("");

            this.suggestionsContainer.innerHTML = `
                <div class="search-suggestions-section">
                    <div class="search-suggestions-title">
                        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <span>Matching Results</span>
                    </div>
                    <div class="d-flex flex-column gap-1">
                        ${itemsHtml}
                    </div>
                </div>
            `;

            this.bindSuggestionEvents();
            this.showSuggestions();
        }

        bindSuggestionEvents() {
            if (!this.suggestionsContainer) return;

            // Destination clicks
            this.suggestionsContainer.querySelectorAll("[data-search]").forEach(item => {
                item.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const query = item.getAttribute("data-search");
                    if (this.searchInput) this.searchInput.value = query;
                    this.hideSuggestions();
                    window.location.href = `/listings?search=${encodeURIComponent(query)}`;
                });
            });

            // Category chip clicks
            this.suggestionsContainer.querySelectorAll("[data-category]").forEach(chip => {
                chip.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cat = chip.getAttribute("data-category");
                    this.hideSuggestions();
                    window.location.href = `/listings?category=${encodeURIComponent(cat)}`;
                });
            });
        }

        escapeHtml(str) {
            if (!str) return "";
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return String(str).replace(/[&<>"']/g, m => map[m]);
        }

        showSuggestions() {
            if (this.suggestionsContainer) {
                this.suggestionsContainer.classList.add("show");
            }
        }

        hideSuggestions() {
            if (this.suggestionsContainer) {
                this.suggestionsContainer.classList.remove("show");
                this.activeIndex = -1;
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