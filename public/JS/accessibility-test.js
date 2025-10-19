/**
 * Accessibility Test Suite for WanderLust
 * Automated accessibility testing and reporting
 */

class AccessibilityTester {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.warnings = [];
    this.passes = [];
    
    this.init();
  }

  init() {
    // Run tests when page is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runAllTests());
    } else {
      this.runAllTests();
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Accessibility Test Suite...');
    
    try {
      await this.testKeyboardNavigation();
      await this.testAriaLabels();
      await this.testColorContrast();
      await this.testImages();
      await this.testForms();
      await this.testHeadings();
      await this.testLandmarks();
      await this.testFocusManagement();
      await this.testScreenReaderContent();
      
      this.generateReport();
      
    } catch (error) {
      console.error('Accessibility test suite failed:', error);
    }
  }

  async testKeyboardNavigation() {
    const testName = 'Keyboard Navigation';
    console.log(`Testing: ${testName}`);
    
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let issues = [];
    
    focusableElements.forEach((element, index) => {
      // Check if element is visible
      const style = getComputedStyle(element);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       style.opacity !== '0';
      
      if (isVisible) {
        // Check if element can receive focus
        if (element.tabIndex < 0 && !element.matches('a[href], button, input, select, textarea')) {
          issues.push(`Element ${element.tagName} at index ${index} cannot receive keyboard focus`);
        }
        
        // Check for focus indicators
        element.focus();
        const focusStyles = getComputedStyle(element);
        if (focusStyles.outline === 'none' && focusStyles.boxShadow === 'none') {
          issues.push(`Element ${element.tagName} at index ${index} has no visible focus indicator`);
        }
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testAriaLabels() {
    const testName = 'ARIA Labels and Attributes';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    // Test buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const hasAccessibleName = button.textContent.trim() || 
                               button.getAttribute('aria-label') || 
                               button.getAttribute('aria-labelledby') ||
                               button.querySelector('img[alt]');
      
      if (!hasAccessibleName) {
        issues.push(`Button at index ${index} lacks accessible name`);
      }
    });
    
    // Test links without accessible names
    const links = document.querySelectorAll('a[href]');
    links.forEach((link, index) => {
      const hasAccessibleName = link.textContent.trim() || 
                               link.getAttribute('aria-label') || 
                               link.getAttribute('aria-labelledby') ||
                               link.querySelector('img[alt]');
      
      if (!hasAccessibleName) {
        issues.push(`Link at index ${index} lacks accessible name`);
      }
    });
    
    // Test form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`) ||
                      input.closest('label');
      
      if (!hasLabel && input.type !== 'hidden' && input.type !== 'submit') {
        issues.push(`Form input at index ${index} lacks proper label`);
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testColorContrast() {
    const testName = 'Color Contrast';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    // Get all text elements
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th');
    
    textElements.forEach((element, index) => {
      const style = getComputedStyle(element);
      const color = this.parseColor(style.color);
      const backgroundColor = this.parseColor(style.backgroundColor);
      
      if (color && backgroundColor) {
        const contrast = this.calculateContrast(color, backgroundColor);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = style.fontWeight;
        
        // WCAG AA standards: 4.5:1 for normal text, 3:1 for large text
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
        const requiredContrast = isLargeText ? 3 : 4.5;
        
        if (contrast < requiredContrast) {
          issues.push(`Text element at index ${index} has insufficient contrast ratio: ${contrast.toFixed(2)} (required: ${requiredContrast})`);
        }
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testImages() {
    const testName = 'Image Accessibility';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Check for alt attribute
      if (!img.hasAttribute('alt')) {
        issues.push(`Image at index ${index} missing alt attribute`);
      } else {
        const alt = img.getAttribute('alt');
        
        // Check for redundant alt text
        if (alt && (alt.includes('image of') || alt.includes('picture of') || alt.includes('photo of'))) {
          issues.push(`Image at index ${index} has redundant alt text: "${alt}"`);
        }
        
        // Check for filename as alt text
        if (alt && (alt.includes('.jpg') || alt.includes('.png') || alt.includes('.gif') || alt.includes('.svg'))) {
          issues.push(`Image at index ${index} uses filename as alt text: "${alt}"`);
        }
      }
      
      // Check for decorative images
      const isDecorative = img.getAttribute('role') === 'presentation' || 
                          img.getAttribute('alt') === '' ||
                          img.getAttribute('aria-hidden') === 'true';
      
      if (!isDecorative && !img.getAttribute('alt')) {
        issues.push(`Non-decorative image at index ${index} needs alt text`);
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testForms() {
    const testName = 'Form Accessibility';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form, formIndex) => {
      // Check for form labels
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach((input, inputIndex) => {
        if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
          return;
        }
        
        const hasLabel = input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby') ||
                        document.querySelector(`label[for="${input.id}"]`) ||
                        input.closest('label');
        
        if (!hasLabel) {
          issues.push(`Form ${formIndex}, Input ${inputIndex} lacks proper label`);
        }
        
        // Check required fields
        if (input.hasAttribute('required')) {
          const hasRequiredIndicator = input.getAttribute('aria-required') === 'true' ||
                                      input.getAttribute('aria-label')?.includes('required') ||
                                      input.closest('.form-group')?.querySelector('.required-indicator');
          
          if (!hasRequiredIndicator) {
            issues.push(`Required field in form ${formIndex}, input ${inputIndex} not properly indicated`);
          }
        }
      });
      
      // Check for error messages
      const errorElements = form.querySelectorAll('.error, .invalid-feedback, [role="alert"]');
      errorElements.forEach((error, errorIndex) => {
        const associatedInput = form.querySelector(`[aria-describedby="${error.id}"]`);
        if (!associatedInput && !error.closest('.form-group')) {
          issues.push(`Error message ${errorIndex} in form ${formIndex} not associated with input`);
        }
      });
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testHeadings() {
    const testName = 'Heading Structure';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      issues.push('No headings found on page');
    } else {
      let previousLevel = 0;
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        
        // Check for empty headings
        if (!heading.textContent.trim()) {
          issues.push(`Empty heading ${heading.tagName} at index ${index}`);
        }
        
        // Check for proper hierarchy
        if (index === 0 && level !== 1) {
          issues.push('First heading should be h1');
        }
        
        if (level > previousLevel + 1) {
          issues.push(`Heading level skipped: ${heading.tagName} at index ${index} (previous was h${previousLevel})`);
        }
        
        previousLevel = level;
      });
    }
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testLandmarks() {
    const testName = 'Page Landmarks';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]'),
      navigation: document.querySelectorAll('nav, [role="navigation"]'),
      banner: document.querySelectorAll('header, [role="banner"]'),
      contentinfo: document.querySelectorAll('footer, [role="contentinfo"]')
    };
    
    // Check for main landmark
    if (landmarks.main.length === 0) {
      issues.push('No main landmark found');
    } else if (landmarks.main.length > 1) {
      issues.push(`Multiple main landmarks found: ${landmarks.main.length}`);
    }
    
    // Check for navigation
    if (landmarks.navigation.length === 0) {
      issues.push('No navigation landmarks found');
    }
    
    // Check for banner
    if (landmarks.banner.length === 0) {
      issues.push('No banner landmark found');
    }
    
    // Check for content info
    if (landmarks.contentinfo.length === 0) {
      issues.push('No contentinfo landmark found');
    }
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testFocusManagement() {
    const testName = 'Focus Management';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    // Test skip links
    // const skipLinks = document.querySelectorAll('.skip-link, .skip-links a');
    // if (skipLinks.length === 0) {
    //   issues.push('No skip links found');
    // }
    
    // Test focus traps in modals
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    modals.forEach((modal, index) => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        issues.push(`Modal ${index} has no focusable elements`);
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  async testScreenReaderContent() {
    const testName = 'Screen Reader Content';
    console.log(`Testing: ${testName}`);
    
    let issues = [];
    
    // Check for live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    if (liveRegions.length === 0) {
      issues.push('No ARIA live regions found for dynamic content');
    }
    
    // Check for screen reader only content
    const srOnlyContent = document.querySelectorAll('.sr-only, .visually-hidden');
    if (srOnlyContent.length === 0) {
      issues.push('No screen reader only content found');
    }
    
    // Check for proper use of aria-hidden
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    hiddenElements.forEach((element, index) => {
      const hasInteractiveContent = element.querySelector('button, a[href], input, select, textarea');
      if (hasInteractiveContent) {
        issues.push(`Element with aria-hidden="true" at index ${index} contains interactive content`);
      }
    });
    
    this.recordTest(testName, issues.length === 0, issues);
  }

  recordTest(testName, passed, issues = []) {
    const result = {
      testName,
      passed,
      issues,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    if (passed) {
      this.passes.push(result);
      console.log(`✅ ${testName}: PASSED`);
    } else {
      this.errors.push(result);
      console.warn(`❌ ${testName}: FAILED`);
      issues.forEach(issue => console.warn(`   - ${issue}`));
    }
  }

  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.passes.length;
    const failedTests = this.errors.length;
    const score = Math.round((passedTests / totalTests) * 100);
    
    console.log('\n🧪 Accessibility Test Report');
    console.log('============================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Score: ${score}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.errors.forEach(test => {
        console.log(`\n${test.testName}:`);
        test.issues.forEach(issue => console.log(`  - ${issue}`));
      });
    }
    
    // Store results for potential external access
    window.accessibilityTestResults = {
      score,
      totalTests,
      passedTests,
      failedTests,
      results: this.testResults,
      timestamp: new Date().toISOString()
    };
    
    // Send results to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'accessibility_test_completed', {
        'score': score,
        'total_tests': totalTests,
        'failed_tests': failedTests
      });
    }
    
    console.log('\nFull results available in window.accessibilityTestResults');
  }

  // Utility methods
  parseColor(colorStr) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    
    const imageData = ctx.getImageData(0, 0, 1, 1);
    return {
      r: imageData.data[0],
      g: imageData.data[1],
      b: imageData.data[2],
      a: imageData.data[3] / 255
    };
  }

  calculateContrast(color1, color2) {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  getLuminance(color) {
    const { r, g, b } = color;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Manual test trigger
  runSingleTest(testName) {
    const methodName = `test${testName.replace(/\s+/g, '')}`;
    if (typeof this[methodName] === 'function') {
      this[methodName]();
    } else {
      console.error(`Test method ${methodName} not found`);
    }
  }
}

// Initialize accessibility tester in development mode
document.addEventListener('DOMContentLoaded', () => {
  // Only run in development or when explicitly enabled
  const runTests = localStorage.getItem('accessibility-tests') === 'true' || 
                   window.location.search.includes('a11y-test=true') ||
                   (process?.env?.NODE_ENV === 'development');
  
  if (runTests) {
    setTimeout(() => {
      window.accessibilityTester = new AccessibilityTester();
    }, 1000); // Wait for page to fully load
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityTester;
}