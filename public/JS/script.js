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
            this.searchInput = document.querySelector(".search-inp");
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

                    this.searchInput.addEventListener("blur", () => {
                        // Delay hiding to allow click on suggestions
                        setTimeout(() => this.hideSuggestions(), 200);
                    });

                    // Hide suggestions on Escape
                    this.searchInput.addEventListener("keydown", (e) => {
                        if (e.key === "Escape") {
                            this.hideSuggestions();
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
            
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'search-suggestion-item';
                item.innerHTML = `
                    <i class="fas ${suggestion.icon} search-suggestion-icon"></i>
                    <span class="search-suggestion-text">${suggestion.value}</span>
                    <small class="search-suggestion-type">${suggestion.type}</small>
                `;
                
                item.addEventListener('click', () => {
                    this.searchInput.value = suggestion.value;
                    this.hideSuggestions();
                    this.searchForm.submit();
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
    // ADVANCED FILTER MANAGER
    // ------------------
    class AdvancedFilterManager {
        constructor() {
            this.filterForm = document.getElementById('advancedFilterForm');
            this.activeFilters = new Map();
            this.listingsContainer = document.getElementById('listingsContainer');
            this.originalListings = null;
            this.currentSort = 'relevance';
            this.init();
        }

        init() {
            if (!this.filterForm) return;

            // Initialize filter form handlers
            this.filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyFilters();
            });

            // Reset filters button
            const resetBtn = document.getElementById('resetFilters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetFilters());
            }

            // Clear all filters button
            const clearAllBtn = document.getElementById('clearAllFilters');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => this.clearAllFilters());
            }

            // Sort dropdown handlers
            const sortOptions = document.querySelectorAll('.sort-option');
            sortOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSort(option.dataset.sort, option.textContent.trim());
                });
            });

            // Location tag handlers
            const locationTags = document.querySelectorAll('.location-tag');
            locationTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    const locationInput = document.getElementById('locationFilter');
                    if (locationInput) {
                        locationInput.value = tag.dataset.location;
                        tag.classList.toggle('active');
                    }
                });
            });

            // Price range slider handler
            const priceSlider = document.getElementById('priceRangeSlider');
            if (priceSlider) {
                priceSlider.addEventListener('input', (e) => {
                    const maxPrice = document.getElementById('maxPrice');
                    if (maxPrice && !maxPrice.value) {
                        maxPrice.value = e.target.value;
                    }
                });
            }

            // Real-time filter changes
            this.setupRealTimeFilters();
            
            // Store original listings for client-side filtering
            this.storeOriginalListings();
        }

        setupRealTimeFilters() {
            // Monitor all filter inputs for changes
            const filterInputs = this.filterForm.querySelectorAll('input, select');
            filterInputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.updateActiveFilters();
                    this.updateFilterCount();
                });
            });
        }

        storeOriginalListings() {
            // Store the original HTML content for client-side filtering
            if (this.listingsContainer) {
                this.originalListings = this.listingsContainer.innerHTML;
            }
        }

        async applyFilters() {
            const formData = new FormData(this.filterForm);
            const filters = {};

            // Collect all filter values
            for (let [key, value] of formData.entries()) {
                if (value) {
                    if (filters[key]) {
                        // Handle multiple values (like features)
                        if (Array.isArray(filters[key])) {
                            filters[key].push(value);
                        } else {
                            filters[key] = [filters[key], value];
                        }
                    } else {
                        filters[key] = value;
                    }
                }
            }

            // Show loading state
            this.showLoadingState();

            try {
                // Build URL with filters
                const url = new URL('/listings', window.location.origin);
                
                // Add existing search query if present
                const currentSearch = new URLSearchParams(window.location.search).get('search');
                if (currentSearch) {
                    url.searchParams.set('search', currentSearch);
                }

                // Add filter parameters
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(key, v));
                    } else {
                        url.searchParams.set(key, value);
                    }
                });

                // Add sort parameter
                if (this.currentSort !== 'relevance') {
                    url.searchParams.set('sort', this.currentSort);
                }

                // Fetch filtered results
                const response = await fetch(url.toString(), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.ok) {
                    const data = await response.text();
                    // Parse the response and update listings
                    this.updateListingsDisplay(data);
                    this.updateActiveFilters();
                    this.updateFilterCount();
                    
                    // Close the offcanvas filter panel
                    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('advancedFilters'));
                    if (offcanvas) {
                        offcanvas.hide();
                    }
                } else {
                    console.error('Filter request failed');
                    this.showErrorState();
                }
            } catch (error) {
                console.error('Error applying filters:', error);
                this.showErrorState();
            }
        }

        showLoadingState() {
            if (this.listingsContainer) {
                this.listingsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="listings-loading">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-3 text-muted">Applying filters...</p>
                        </div>
                    </div>
                `;
            }
        }

        showErrorState() {
            if (this.listingsContainer) {
                this.listingsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="no-results-advanced">
                            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                            <h4>Oops! Something went wrong</h4>
                            <p class="text-muted">We couldn't apply your filters. Please try again.</p>
                            <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                        </div>
                    </div>
                `;
            }
        }

        updateListingsDisplay(htmlContent) {
            // Parse the HTML response and extract listings
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const newListings = doc.querySelector('#listingsContainer');
            
            if (newListings && this.listingsContainer) {
                this.listingsContainer.innerHTML = newListings.innerHTML;
                
                // Reapply search highlighting if needed
                const searchQuery = new URLSearchParams(window.location.search).get('search');
                if (searchQuery) {
                    this.highlightSearchTerms(searchQuery);
                }
            }
        }

        highlightSearchTerms(query) {
            const searchTerms = query.toLowerCase().split(' ');
            const textNodes = this.getTextNodes(this.listingsContainer);
            
            textNodes.forEach(node => {
                let content = node.textContent;
                let highlighted = false;
                
                searchTerms.forEach(term => {
                    if (term.length > 2) {
                        const regex = new RegExp(`(${term})`, 'gi');
                        if (regex.test(content)) {
                            content = content.replace(regex, '<span class="search-highlight">$1</span>');
                            highlighted = true;
                        }
                    }
                });
                
                if (highlighted) {
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = content;
                    node.parentNode.replaceChild(wrapper, node);
                }
            });
        }

        getTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.trim()) {
                    textNodes.push(node);
                }
            }
            
            return textNodes;
        }

        handleSort(sortType, sortLabel) {
            this.currentSort = sortType;
            
            // Update sort button label
            const currentSortLabel = document.getElementById('currentSort');
            if (currentSortLabel) {
                currentSortLabel.textContent = sortLabel;
            }
            
            // Apply filters with new sort
            this.applyFilters();
            
            // Update active sort option
            document.querySelectorAll('.sort-option').forEach(option => {
                option.classList.remove('active');
            });
            event.target.classList.add('active');
        }

        updateActiveFilters() {
            this.activeFilters.clear();
            const formData = new FormData(this.filterForm);
            
            for (let [key, value] of formData.entries()) {
                if (value && value.trim()) {
                    this.activeFilters.set(key, value);
                }
            }
        }

        updateFilterCount() {
            const filterCount = this.activeFilters.size;
            const countElement = document.getElementById('activeFilterCount');
            const clearAllBtn = document.getElementById('clearAllFilters');
            
            if (countElement) {
                if (filterCount > 0) {
                    countElement.textContent = filterCount;
                    countElement.style.display = 'inline-flex';
                } else {
                    countElement.style.display = 'none';
                }
            }
            
            if (clearAllBtn) {
                clearAllBtn.style.display = filterCount > 0 ? 'inline-block' : 'none';
            }
        }

        resetFilters() {
            if (this.filterForm) {
                this.filterForm.reset();
                this.activeFilters.clear();
                this.updateFilterCount();
                
                // Reset location tags
                document.querySelectorAll('.location-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
            }
        }

        clearAllFilters() {
            this.resetFilters();
            
            // Redirect to clean listings page
            const url = new URL('/listings', window.location.origin);
            const currentSearch = new URLSearchParams(window.location.search).get('search');
            if (currentSearch) {
                url.searchParams.set('search', currentSearch);
            }
            
            window.location.href = url.toString();
        }
    }

    // ------------------
    // GLOBAL HELPER FUNCTIONS
    // ------------------
    
    // Function to clear all filters and redirect
    window.clearAllFilters = function() {
        const url = new URL('/listings', window.location.origin);
        const currentSearch = new URLSearchParams(window.location.search).get('search');
        if (currentSearch) {
            url.searchParams.set('search', currentSearch);
        }
        window.location.href = url.toString();
    };

    // Function to remove individual filters
    window.removeFilter = function(filterName, filterValue = null) {
        const url = new URL(window.location.href);
        
        if (filterValue) {
            // Handle array parameters like features
            const existingValues = url.searchParams.getAll(filterName);
            url.searchParams.delete(filterName);
            existingValues.forEach(value => {
                if (value !== filterValue) {
                    url.searchParams.append(filterName, value);
                }
            });
        } else {
            // Remove single parameter
            url.searchParams.delete(filterName);
        }
        
        window.location.href = url.toString();
    };

    // Add event listeners for filter removal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-filter')) {
            e.preventDefault();
            const filterName = e.target.dataset.filter;
            const filterValue = e.target.dataset.value;
            removeFilter(filterName, filterValue);
        }
    });

    // ------------------
    // INITIALIZATION
    // ------------------
    new ThemeManager();
    new SearchManager();
    new AdvancedFilterManager();


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