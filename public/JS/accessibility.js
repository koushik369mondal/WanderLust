/**
 * WanderLust Accessibility Enhancement Utilities
 * Provides enhanced accessibility features for better user experience
 */

class AccessibilityManager {
  constructor() {
    this.isKeyboardUser = false;
    this.announcements = [];
    this.focusTrap = null;
    
    this.init();
  }

  init() {
    this.setupKeyboardDetection();
    this.setupSkipLinks();
    this.setupAriaLive();
    this.setupFormValidation();
    this.setupLazyLoading();
    this.setupFocusManagement();
    this.setupToastSystem();
    this.setupModalAccessibility();
  }

  // Keyboard vs Mouse Detection
  setupKeyboardDetection() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboardUser = true;
        document.body.classList.add('keyboard-user');
        document.body.classList.remove('mouse-user');
      }
    });

    document.addEventListener('mousedown', () => {
      this.isKeyboardUser = false;
      document.body.classList.add('mouse-user');
      document.body.classList.remove('keyboard-user');
    });
  }

  // Skip Links for Screen Readers
  // setupSkipLinks() {
  //   const skipLinks = document.createElement('div');
  //   skipLinks.className = 'skip-links';
  //   skipLinks.innerHTML = `
  //     <a href="#main-content">Skip to main content</a>
  //     <a href="#navigation">Skip to navigation</a>
  //     <a href="#search">Skip to search</a>
  //   `;
  //   document.body.insertBefore(skipLinks, document.body.firstChild);
  // }

  // ARIA Live Region for Announcements
  setupAriaLive() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);

    const assertiveRegion = document.createElement('div');
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    assertiveRegion.id = 'aria-live-assertive';
    document.body.appendChild(assertiveRegion);
  }

  // Announce messages to screen readers
  announce(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-region';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  // Enhanced Form Validation
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Add ARIA attributes
        this.enhanceFormField(input);
        
        // Real-time validation
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
      
      form.addEventListener('submit', (e) => this.validateForm(e, form));
    });
  }

  enhanceFormField(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    const fieldId = field.id || `field-${Math.random().toString(36).substr(2, 9)}`;
    
    if (!field.id) {
      field.id = fieldId;
    }
    
    if (label && !label.getAttribute('for')) {
      label.setAttribute('for', fieldId);
    }
    
    // Add required indicator
    if (field.hasAttribute('required')) {
      if (label && !label.querySelector('.required-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'required-indicator sr-only';
        indicator.textContent = ' (required)';
        label.appendChild(indicator);
      }
      field.setAttribute('aria-required', 'true');
    }
    
    // Error message container
    if (!field.nextElementSibling?.classList.contains('form-error')) {
      const errorContainer = document.createElement('div');
      errorContainer.className = 'form-error';
      errorContainer.id = `${fieldId}-error`;
      errorContainer.setAttribute('role', 'alert');
      errorContainer.style.display = 'none';
      field.parentNode.insertBefore(errorContainer, field.nextSibling);
      
      field.setAttribute('aria-describedby', `${fieldId}-error`);
    }
  }

  validateField(field) {
    const errorContainer = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let message = '';
    
    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      message = `${this.getFieldLabel(field)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }
    
    // Password validation
    if (field.type === 'password' && field.value && field.value.length < 6) {
      isValid = false;
      message = 'Password must be at least 6 characters long';
    }
    
    // Update field state
    field.setAttribute('aria-invalid', !isValid);
    
    if (!isValid) {
      this.showFieldError(field, message);
    } else {
      this.clearFieldError(field);
    }
    
    return isValid;
  }

  validateForm(event, form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    let firstInvalidField = null;
    
    inputs.forEach(input => {
      const isFieldValid = this.validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      }
    });
    
    if (!isFormValid) {
      event.preventDefault();
      firstInvalidField?.focus();
      this.announce('Please correct the errors in the form', 'assertive');
    }
  }

  showFieldError(field, message) {
    const errorContainer = document.getElementById(`${field.id}-error`);
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      field.classList.add('is-invalid');
    }
  }

  clearFieldError(field) {
    const errorContainer = document.getElementById(`${field.id}-error`);
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.style.display = 'none';
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    }
  }

  getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    return label?.textContent?.replace(' (required)', '') || field.name || 'Field';
  }

  // Lazy Loading with Accessibility
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            imageObserver.unobserve(img);
            
            // Update alt text for screen readers
            if (!img.alt) {
              img.alt = img.dataset.alt || 'Image loaded';
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy-loading');
        imageObserver.observe(img);
      });
    }
  }

  // Focus Management
  setupFocusManagement() {
    // Tab trapping for modals
    this.setupModalFocusTrap();
    
    // Focus restoration
    this.setupFocusRestoration();
  }

  setupModalFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal:not([style*="display: none"])');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  setupFocusRestoration() {
    let previousFocus = null;
    
    // Store focus before opening modal
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-bs-toggle="modal"], .modal-trigger')) {
        previousFocus = document.activeElement;
      }
    });
    
    // Restore focus when modal closes
    document.addEventListener('hidden.bs.modal', () => {
      if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
      }
    });
  }

  // Toast Notification System
  setupToastSystem() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'info', duration = 5000) {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.id = toastId;
    
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="toast-title">${this.getToastIcon(type)} ${this.getToastTitle(type)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Manual dismiss
    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });
    
    // Announce to screen readers
    this.announce(message, 'polite');
  }

  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  getToastTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return titles[type] || titles.info;
  }

  // Modal Accessibility Enhancement
  setupModalAccessibility() {
    document.addEventListener('shown.bs.modal', (e) => {
      const modal = e.target;
      const focusableElement = modal.querySelector('input, button, select, textarea, [tabindex]');
      if (focusableElement) {
        focusableElement.focus();
      }
    });
  }

  // Loading State Management
  showLoading(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', message);
    overlay.id = 'loading-overlay';
    
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner" aria-hidden="true"></div>
        <div class="sr-only">${message}</div>
        <div class="loading-text" aria-live="polite">${message}</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.announce(message, 'polite');
  }

  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.remove();
      this.announce('Loading complete', 'polite');
    }
  }

  // Button Loading States
  setButtonLoading(button, loading = true) {
    if (loading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      const originalText = button.textContent;
      button.dataset.originalText = originalText;
      button.innerHTML = '<span class="sr-only">Loading...</span>' + originalText;
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      button.removeAttribute('aria-busy');
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  // Utility Methods
  addAriaLabel(element, label) {
    element.setAttribute('aria-label', label);
  }

  addAriaDescription(element, description) {
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    
    element.parentNode.insertBefore(descElement, element.nextSibling);
    element.setAttribute('aria-describedby', descId);
  }

  // High Contrast Mode Detection
  detectHighContrast() {
    const testElement = document.createElement('div');
    testElement.style.borderStyle = 'solid';
    testElement.style.borderWidth = '1px';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    
    document.body.appendChild(testElement);
    
    const isHighContrast = getComputedStyle(testElement).borderTopColor === 'rgb(0, 0, 0)';
    document.body.removeChild(testElement);
    
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    }
    
    return isHighContrast;
  }
}

// Initialize accessibility manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
  
  // Expose global methods for easy use
  window.showToast = (message, type, duration) => {
    window.accessibilityManager.showToast(message, type, duration);
  };
  
  window.announce = (message, priority) => {
    window.accessibilityManager.announce(message, priority);
  };
  
  window.showLoading = (message) => {
    window.accessibilityManager.showLoading(message);
  };
  
  window.hideLoading = () => {
    window.accessibilityManager.hideLoading();
  };
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}