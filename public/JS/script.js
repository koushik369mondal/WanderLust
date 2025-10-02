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

    // =====================================
    // MODERN DESIGN ENHANCEMENTS
    // =====================================

    // Enhanced Navbar Scroll Effect
    function initNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Auto-hide navbar on scroll down (mobile)
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Intersection Observer for Reveal Animations
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal, .card, .glass-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            revealObserver.observe(element);
        });
    }

    // Enhanced Card Interactions
    function initCardInteractions() {
        const cards = document.querySelectorAll('.card, .listing-card, .glass-card');
        
        cards.forEach(card => {
            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 768) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // Smooth Page Transitions
    function initPageTransitions() {
        // Add fade-in animation to page content
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        });

        // Smooth link transitions
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    
                    document.body.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = href;
                    }, 150);
                }
            });
        });
    }

    // Enhanced Form Interactions
    function initFormEnhancements() {
        const formControls = document.querySelectorAll('.form-control, input, textarea');
        
        formControls.forEach(control => {
            // Add modern styling
            control.classList.add('form-control-modern');
            
            // Floating label effect
            const label = control.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                control.addEventListener('focus', () => {
                    label.style.transform = 'translateY(-25px) scale(0.85)';
                    label.style.color = 'var(--accent-color)';
                });
                
                control.addEventListener('blur', () => {
                    if (!control.value) {
                        label.style.transform = 'translateY(0) scale(1)';
                        label.style.color = 'var(--text-muted)';
                    }
                });
            }
        });
    }

    // Parallax Background Effect
    function initParallaxBackground() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.body.style.backgroundPosition = `center ${rate}px`;
        });
    }

    // Progressive Image Loading
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Enhanced Button Interactions
    function initButtonEnhancements() {
        const buttons = document.querySelectorAll('.btn, button');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Theme-aware animations
    function initThemeAnimations() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Add a subtle flash effect
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--accent-color);
                    opacity: 0;
                    pointer-events: none;
                    z-index: 9999;
                    animation: themeFlash 0.3s ease-out;
                `;
                
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 300);
            });
        }
    }

    // Initialize all enhancements
    initNavbarScrollEffect();
    initRevealAnimations();
    initCardInteractions();
    initPageTransitions();
    initFormEnhancements();
    initParallaxBackground();
    initLazyLoading();
    initButtonEnhancements();
    initThemeAnimations();
});

// CSS Animations (to be added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes themeFlash {
        0% { opacity: 0; }
        50% { opacity: 0.1; }
        100% { opacity: 0; }
    }
    
    .loaded {
        opacity: 1 !important;
        transform: scale(1) !important;
    }
    
    img[data-src] {
        opacity: 0;
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);