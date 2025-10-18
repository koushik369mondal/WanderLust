/**
 * Enhanced Image Lazy Loading Component for WanderLust
 * Provides optimized image loading with accessibility features
 */

class LazyImageLoader {
  constructor() {
    this.observers = new Map();
    this.loadedImages = new Set();
    this.failedImages = new Set();
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.enhanceExistingImages();
    this.setupMutationObserver();
  }

  setupIntersectionObserver() {
    // Progressive loading based on viewport distance
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Background image observer for hero sections
    this.bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadBackgroundImage(entry.target);
          this.bgObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  enhanceExistingImages() {
    // Process existing images
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    images.forEach(img => this.setupImage(img));

    // Process background images
    const bgElements = document.querySelectorAll('[data-bg-src]');
    bgElements.forEach(el => this.setupBackgroundImage(el));
  }

  setupMutationObserver() {
    // Watch for dynamically added images
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Check if the node itself is an image
            if (node.tagName === 'IMG') {
              this.setupImage(node);
            }
            
            // Check for images within the added node
            const images = node.querySelectorAll?.('img[data-src], img[loading="lazy"]');
            images?.forEach(img => this.setupImage(img));
            
            // Check for background images
            const bgElements = node.querySelectorAll?.('[data-bg-src]');
            bgElements?.forEach(el => this.setupBackgroundImage(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupImage(img) {
    if (this.loadedImages.has(img) || img.hasAttribute('data-lazy-setup')) {
      return;
    }

    img.setAttribute('data-lazy-setup', 'true');

    // Add loading placeholder
    this.addImagePlaceholder(img);

    // Set up lazy loading
    if (img.hasAttribute('data-src') || img.loading === 'lazy') {
      img.classList.add('lazy-loading');
      this.imageObserver.observe(img);
    }

    // Enhance accessibility
    this.enhanceImageAccessibility(img);
  }

  setupBackgroundImage(element) {
    if (element.hasAttribute('data-bg-setup')) {
      return;
    }

    element.setAttribute('data-bg-setup', 'true');
    element.classList.add('lazy-bg-loading');
    this.bgObserver.observe(element);
  }

  addImagePlaceholder(img) {
    // Create a subtle loading placeholder
    const placeholder = this.generatePlaceholder(img);
    
    // Set placeholder as temporary src if no src exists
    if (!img.src && placeholder) {
      img.src = placeholder;
    }

    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'image-loading-indicator';
    loadingIndicator.innerHTML = `
      <div class="loading-spinner" aria-hidden="true"></div>
      <span class="sr-only">Loading image</span>
    `;
    
    img.parentNode.style.position = 'relative';
    img.parentNode.insertBefore(loadingIndicator, img.nextSibling);
  }

  generatePlaceholder(img) {
    // Generate a subtle gradient placeholder
    const width = img.getAttribute('width') || 400;
    const height = img.getAttribute('height') || 300;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle pattern
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    return canvas.toDataURL();
  }

  async loadImage(img) {
    if (this.loadedImages.has(img)) {
      return;
    }

    const dataSrc = img.getAttribute('data-src');
    const actualSrc = dataSrc || img.src;
    
    if (!actualSrc) {
      return;
    }

    try {
      // Announce loading to screen readers
      this.announceImageLoading(img);
      
      // Preload the image
      const preloadImage = new Image();
      
      await new Promise((resolve, reject) => {
        preloadImage.onload = resolve;
        preloadImage.onerror = reject;
        preloadImage.src = actualSrc;
      });

      // Update the actual image
      if (dataSrc) {
        img.src = dataSrc;
        img.removeAttribute('data-src');
      }

      // Apply loaded styles
      this.onImageLoaded(img);
      
    } catch (error) {
      this.onImageError(img, error);
    }
  }

  async loadBackgroundImage(element) {
    const bgSrc = element.getAttribute('data-bg-src');
    
    if (!bgSrc) {
      return;
    }

    try {
      // Preload background image
      const preloadImage = new Image();
      
      await new Promise((resolve, reject) => {
        preloadImage.onload = resolve;
        preloadImage.onerror = reject;
        preloadImage.src = bgSrc;
      });

      // Apply background image
      element.style.backgroundImage = `url(${bgSrc})`;
      element.removeAttribute('data-bg-src');
      element.classList.remove('lazy-bg-loading');
      element.classList.add('lazy-bg-loaded');
      
    } catch (error) {
      console.warn('Failed to load background image:', error);
      element.classList.remove('lazy-bg-loading');
      element.classList.add('lazy-bg-error');
    }
  }

  onImageLoaded(img) {
    this.loadedImages.add(img);
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-loaded');
    
    // Remove loading indicator
    const loadingIndicator = img.parentNode.querySelector('.image-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }

    // Announce completion to screen readers
    this.announceImageLoaded(img);

    // Trigger custom event
    img.dispatchEvent(new CustomEvent('imageLoaded', {
      detail: { image: img }
    }));

    // Add fade-in animation
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
    
    requestAnimationFrame(() => {
      img.style.opacity = '1';
    });
  }

  onImageError(img, error) {
    this.failedImages.add(img);
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-error');
    
    console.warn('Failed to load image:', img.src, error);
    
    // Remove loading indicator
    const loadingIndicator = img.parentNode.querySelector('.image-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }

    // Set fallback image or placeholder
    this.setFallbackImage(img);
    
    // Announce error to screen readers
    this.announceImageError(img);

    // Trigger custom event
    img.dispatchEvent(new CustomEvent('imageError', {
      detail: { image: img, error }
    }));
  }

  setFallbackImage(img) {
    // Use a default placeholder or retry mechanism
    const fallbackSrc = img.getAttribute('data-fallback') || 
                       '/images/placeholder.jpg' ||
                       this.generateErrorPlaceholder();
    
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    }
  }

  generateErrorPlaceholder() {
    // Generate a simple error placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    // Error icon
    ctx.fillStyle = '#6c757d';
    ctx.font = '48px FontAwesome';
    ctx.textAlign = 'center';
    ctx.fillText('🖼️', 200, 150);
    
    // Error text
    ctx.font = '16px Arial';
    ctx.fillText('Image not available', 200, 200);
    
    return canvas.toDataURL();
  }

  enhanceImageAccessibility(img) {
    // Ensure alt attribute exists
    if (!img.hasAttribute('alt')) {
      const altText = this.generateAltText(img);
      img.setAttribute('alt', altText);
    }

    // Add loading attribute for native lazy loading support
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    // Add decoding hint for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    // Add descriptive attributes
    if (img.hasAttribute('data-description')) {
      const description = img.getAttribute('data-description');
      const descId = `img-desc-${Math.random().toString(36).substr(2, 9)}`;
      
      const descElement = document.createElement('div');
      descElement.id = descId;
      descElement.className = 'sr-only';
      descElement.textContent = description;
      
      img.parentNode.insertBefore(descElement, img.nextSibling);
      img.setAttribute('aria-describedby', descId);
    }
  }

  generateAltText(img) {
    // Try to generate meaningful alt text from context
    const src = img.getAttribute('data-src') || img.src || '';
    const title = img.getAttribute('title') || '';
    const figcaption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
    
    if (figcaption) {
      return figcaption;
    }
    
    if (title) {
      return title;
    }
    
    // Extract information from filename
    const filename = src.split('/').pop().split('.')[0];
    const cleanFilename = filename.replace(/[-_]/g, ' ');
    
    return cleanFilename || 'Image';
  }

  announceImageLoading(img) {
    if (window.accessibilityManager) {
      const alt = img.getAttribute('alt') || 'Image';
      window.accessibilityManager.announce(`Loading ${alt}`, 'polite');
    }
  }

  announceImageLoaded(img) {
    if (window.accessibilityManager) {
      const alt = img.getAttribute('alt') || 'Image';
      window.accessibilityManager.announce(`${alt} loaded`, 'polite');
    }
  }

  announceImageError(img) {
    if (window.accessibilityManager) {
      const alt = img.getAttribute('alt') || 'Image';
      window.accessibilityManager.announce(`Failed to load ${alt}`, 'assertive');
    }
  }

  // Performance monitoring
  getStats() {
    return {
      loadedImages: this.loadedImages.size,
      failedImages: this.failedImages.size,
      totalObserved: this.loadedImages.size + this.failedImages.size
    };
  }

  // Manual trigger for specific images
  loadImageNow(img) {
    if (img.hasAttribute('data-src') || img.loading === 'lazy') {
      this.imageObserver.unobserve(img);
      this.loadImage(img);
    }
  }

  // Preload critical images
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical="true"]');
    criticalImages.forEach(img => {
      this.loadImageNow(img);
    });
  }
}

// Initialize lazy image loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    window.lazyImageLoader = new LazyImageLoader();
    
    // Preload critical images immediately
    window.lazyImageLoader.preloadCriticalImages();
  } else {
    // Fallback for older browsers
    console.warn('IntersectionObserver not supported, loading all images immediately');
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyImageLoader;
}