// Loading Manager
class LoadingManager {
    constructor() {
        this.loadingOverlay = document.getElementById('global-loading');
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupAjaxLoading();
    }

    setupFormHandlers() {
        // Use event delegation to handle all form submissions
        document.addEventListener('submit', (e) => {
            // Find the submit button in this form - try multiple selectors
            let submitButton = e.target.querySelector('button[type="submit"]');
            if (!submitButton) {
                submitButton = e.target.querySelector('button:not([type]), button[type="button"]');
            }
            if (!submitButton) {
                submitButton = e.target.querySelector('button');
            }
            
            if (submitButton) {
                // Prevent immediate submission
                e.preventDefault();
                
                // Apply loading state
                this.showButtonLoading(submitButton);
                
                // Submit after delay
                setTimeout(() => {
                    e.target.submit();
                }, 200);
            }
        });
    }

    showButtonLoading(button) {
        if (button) {
            // Store original text
            button.setAttribute('data-original-text', button.innerHTML);
            // Clear text and add spinner class
            button.innerHTML = '';
            button.classList.add('btn-loading');
            button.disabled = true;
        }
    }

    hideFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"].btn-loading');
        if (submitButton) {
            // Restore original text
            const originalText = submitButton.getAttribute('data-original-text');
            if (originalText) {
                submitButton.innerHTML = originalText;
            }
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;
        }
    }

    showGlobalLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // Add a small delay to prevent flickering for fast operations
            this.loadingTimeout = setTimeout(() => {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.opacity = '1';
                }
            }, 100);
        }
    }

    hideGlobalLoading() {
        if (this.loadingOverlay) {
            clearTimeout(this.loadingTimeout);
            this.loadingOverlay.style.opacity = '0';
            // Wait for the fade-out transition to complete
            setTimeout(() => {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.display = 'none';
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }

    setupAjaxLoading() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function(resource, config = {}) {
            // Only show loading for non-GET requests or specific API endpoints
            const isGetRequest = !config.method || config.method.toUpperCase() === 'GET';
            const isApiRequest = typeof resource === 'string' && 
                               (resource.includes('/api/') || 
                                resource.includes('/listings') || 
                                resource.includes('/reviews') || 
                                resource.includes('/users'));

            if (!isGetRequest || isApiRequest) {
                self.showGlobalLoading();
            }

            try {
                const response = await originalFetch(resource, config);
                return response;
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            } finally {
                // Small delay to prevent flickering for fast requests
                setTimeout(() => {
                    self.hideGlobalLoading();
                    
                    // Reset any form loading states
                    document.querySelectorAll('form').forEach(form => {
                        self.hideFormLoading(form);
                    });
                }, 300);
            }
        };
    }

}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.loadingManager = new LoadingManager();
    });
} else {
    window.loadingManager = new LoadingManager();
}

// Expose the loading manager for manual control
window.showLoading = () => window.loadingManager?.showGlobalLoading();
window.hideLoading = () => window.loadingManager?.hideGlobalLoading();
