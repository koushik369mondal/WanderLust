/**
 * Enhanced Internationalization (i18n) Manager for WanderLust
 * Provides intelligent language detection, switching, and cultural adaptation
 */

class InternationalizationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.fallbackLanguage = 'en';
    this.supportedLanguages = {
      'en': { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, region: 'US' },
      'hi': { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', rtl: false, region: 'IN' },
      'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, region: 'ES' },
      'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, region: 'FR' },
      'bn': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false, region: 'BD' },
      'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', rtl: false, region: 'IN' },
      'kn': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', rtl: false, region: 'IN' },
      'ml': { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', rtl: false, region: 'IN' },
      'mr': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false, region: 'IN' },
      'or': { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', rtl: false, region: 'IN' },
      'pa': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', rtl: false, region: 'IN' },
      'ta': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false, region: 'IN' },
      'te': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false, region: 'IN' },
      'ur': { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true, region: 'PK' },
      'as': { name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', rtl: false, region: 'IN' }
    };
    this.translations = {};
    this.dateTimeFormats = {};
    this.numberFormats = {};
    
    this.init();
  }

  async init() {
    this.detectUserLanguage();
    this.setupLanguageSelector();
    this.setupCulturalAdaptations();
    await this.loadTranslations();
    this.applyLanguageSettings();
    this.setupDynamicTranslation();
  }

  detectUserLanguage() {
    // Priority order for language detection
    const sources = [
      () => localStorage.getItem('wanderlust_language'),
      () => this.getUrlLanguageParam(),
      () => this.getBrowserLanguage(),
      () => this.getGeoLocationLanguage(),
      () => this.fallbackLanguage
    ];

    for (const source of sources) {
      const lang = source();
      if (lang && this.supportedLanguages[lang]) {
        this.currentLanguage = lang;
        break;
      }
    }

    console.log(`Language detected: ${this.currentLanguage}`);
  }

  getUrlLanguageParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang');
  }

  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    return this.supportedLanguages[langCode] ? langCode : null;
  }

  async getGeoLocationLanguage() {
    try {
      // Use a simple IP-based geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Map country codes to languages
      const countryToLanguage = {
        'IN': 'hi', 'US': 'en', 'GB': 'en', 'ES': 'es', 'FR': 'fr',
        'BD': 'bn', 'PK': 'ur', 'CA': 'en', 'AU': 'en'
      };
      
      return countryToLanguage[data.country_code];
    } catch (error) {
      console.log('Geolocation language detection failed:', error);
      return null;
    }
  }

  setupLanguageSelector() {
    this.createLanguageSwitcher();
    this.createMobileLanguageMenu();
    this.setupKeyboardShortcuts();
  }

  createLanguageSwitcher() {
    const navbar = document.querySelector('.navbar-nav');
    if (!navbar) return;

    const languageDropdown = document.createElement('li');
    languageDropdown.className = 'nav-item dropdown';
    
    const currentLang = this.supportedLanguages[this.currentLanguage];
    languageDropdown.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" role="button" 
         data-bs-toggle="dropdown" aria-expanded="false" 
         id="language-selector" aria-label="Select language">
        <span class="language-flag">${currentLang.flag}</span>
        <span class="language-name d-none d-md-inline">${currentLang.nativeName}</span>
        <span class="sr-only">Current language: ${currentLang.name}</span>
      </a>
      <ul class="dropdown-menu language-menu" aria-labelledby="language-selector">
        ${this.generateLanguageOptions()}
      </ul>
    `;
    
    navbar.appendChild(languageDropdown);
    
    // Add event listeners
    this.setupLanguageDropdownEvents(languageDropdown);
  }

  generateLanguageOptions() {
    return Object.entries(this.supportedLanguages)
      .map(([code, lang]) => `
        <li>
          <a class="dropdown-item language-option ${code === this.currentLanguage ? 'active' : ''}" 
             href="#" data-lang="${code}" 
             aria-label="Switch to ${lang.name}"
             role="menuitem">
            <span class="language-flag me-2">${lang.flag}</span>
            <span class="language-native">${lang.nativeName}</span>
            <span class="language-english text-muted ms-1">(${lang.name})</span>
            ${code === this.currentLanguage ? '<i class="fas fa-check ms-auto text-success" aria-hidden="true"></i>' : ''}
          </a>
        </li>
      `).join('');
  }

  createMobileLanguageMenu() {
    // Add language options to mobile menu
    const mobileNav = document.querySelector('.navbar-collapse');
    if (!mobileNav) return;

    const mobileLanguageSection = document.createElement('div');
    mobileLanguageSection.className = 'mobile-language-section d-md-none mt-3 pt-3 border-top';
    mobileLanguageSection.innerHTML = `
      <h6 class="text-muted mb-2">
        <i class="fas fa-globe me-2" aria-hidden="true"></i>
        Choose Language
      </h6>
      <div class="language-grid">
        ${Object.entries(this.supportedLanguages)
          .map(([code, lang]) => `
            <button class="btn btn-outline-secondary btn-sm language-btn ${code === this.currentLanguage ? 'active' : ''}" 
                    data-lang="${code}"
                    aria-label="Switch to ${lang.name}"
                    title="${lang.nativeName} (${lang.name})">
              ${lang.flag} ${lang.nativeName}
            </button>
          `).join('')}
      </div>
    `;
    
    mobileNav.appendChild(mobileLanguageSection);
  }

  setupLanguageDropdownEvents(dropdown) {
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (e.target.matches('.language-option, .language-option *')) {
        const option = e.target.closest('.language-option');
        const langCode = option.dataset.lang;
        
        if (langCode && langCode !== this.currentLanguage) {
          this.changeLanguage(langCode);
        }
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + L to open language selector
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
          languageSelector.click();
        }
      }
    });
  }

  async changeLanguage(langCode) {
    if (!this.supportedLanguages[langCode]) {
      console.error(`Unsupported language: ${langCode}`);
      return;
    }

    this.showLanguageChangeLoading();
    
    try {
      this.currentLanguage = langCode;
      localStorage.setItem('wanderlust_language', langCode);
      
      await this.loadTranslations();
      this.applyLanguageSettings();
      this.updateLanguageSelector();
      this.translateDynamicContent();
      
      // Update URL without page reload
      this.updateUrlLanguage();
      
      // Announce language change
      this.announceLanguageChange();
      
      // Show success notification
      this.showLanguageChangeSuccess();
      
    } catch (error) {
      console.error('Language change failed:', error);
      this.showLanguageChangeError();
    } finally {
      this.hideLanguageChangeLoading();
    }
  }

  async loadTranslations() {
    if (this.translations[this.currentLanguage]) {
      return; // Already loaded
    }

    try {
      const response = await fetch(`/locales/${this.currentLanguage}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${this.currentLanguage}`);
      }
      
      this.translations[this.currentLanguage] = await response.json();
      
      // Load fallback if not English
      if (this.currentLanguage !== this.fallbackLanguage && !this.translations[this.fallbackLanguage]) {
        const fallbackResponse = await fetch(`/locales/${this.fallbackLanguage}.json`);
        if (fallbackResponse.ok) {
          this.translations[this.fallbackLanguage] = await fallbackResponse.json();
        }
      }
      
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to existing page content
    }
  }

  applyLanguageSettings() {
    const lang = this.supportedLanguages[this.currentLanguage];
    
    // Set document language and direction
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
    
    // Apply RTL styles if needed
    if (lang.rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Set up cultural formatting
    this.setupNumberFormatting();
    this.setupDateFormatting();
    this.setupCurrencyFormatting();
  }

  setupNumberFormatting() {
    const lang = this.supportedLanguages[this.currentLanguage];
    this.numberFormat = new Intl.NumberFormat(this.currentLanguage + '-' + lang.region);
  }

  setupDateFormatting() {
    const lang = this.supportedLanguages[this.currentLanguage];
    this.dateFormat = new Intl.DateTimeFormat(this.currentLanguage + '-' + lang.region, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    this.timeFormat = new Intl.DateTimeFormat(this.currentLanguage + '-' + lang.region, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  setupCurrencyFormatting() {
    const lang = this.supportedLanguages[this.currentLanguage];
    const currencyMap = {
      'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'ES': 'EUR', 
      'FR': 'EUR', 'BD': 'BDT', 'PK': 'PKR'
    };
    
    const currency = currencyMap[lang.region] || 'USD';
    this.currencyFormat = new Intl.NumberFormat(this.currentLanguage + '-' + lang.region, {
      style: 'currency',
      currency: currency
    });
  }

  translate(key, params = {}) {
    const translations = this.translations[this.currentLanguage] || {};
    const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
    
    let text = translations[key] || fallbackTranslations[key] || key;
    
    // Replace parameters
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
    });
    
    return text;
  }

  formatNumber(number) {
    return this.numberFormat?.format(number) || number.toLocaleString();
  }

  formatDate(date) {
    return this.dateFormat?.format(date) || date.toLocaleDateString();
  }

  formatTime(date) {
    return this.timeFormat?.format(date) || date.toLocaleTimeString();
  }

  formatCurrency(amount) {
    return this.currencyFormat?.format(amount) || `$${amount}`;
  }

  setupCulturalAdaptations() {
    // Add cultural CSS classes
    const lang = this.supportedLanguages[this.currentLanguage];
    document.body.classList.add(`lang-${this.currentLanguage}`);
    document.body.classList.add(`region-${lang.region}`);
    
    // Apply font preferences for different scripts
    this.applyFontPreferences();
  }

  applyFontPreferences() {
    const fontPreferences = {
      'hi': 'Noto Sans Devanagari, system-ui',
      'bn': 'Noto Sans Bengali, system-ui',
      'gu': 'Noto Sans Gujarati, system-ui',
      'kn': 'Noto Sans Kannada, system-ui',
      'ml': 'Noto Sans Malayalam, system-ui',
      'mr': 'Noto Sans Devanagari, system-ui',
      'or': 'Noto Sans Oriya, system-ui',
      'pa': 'Noto Sans Gurmukhi, system-ui',
      'ta': 'Noto Sans Tamil, system-ui',
      'te': 'Noto Sans Telugu, system-ui',
      'ur': 'Noto Nastaliq Urdu, system-ui',
      'as': 'Noto Sans Bengali, system-ui'
    };

    const fontFamily = fontPreferences[this.currentLanguage];
    if (fontFamily) {
      document.documentElement.style.setProperty('--font-family-primary', fontFamily);
    }
  }

  setupDynamicTranslation() {
    // Translate existing content
    this.translateStaticContent();
    
    // Set up mutation observer for dynamic content
    this.setupTranslationObserver();
  }

  translateStaticContent() {
    // Translate elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.type === 'submit' || element.type === 'button') {
          element.value = translation;
        } else {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.translate(key);
    });

    // Translate titles and aria labels
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.translate(key);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      element.setAttribute('aria-label', this.translate(key));
    });
  }

  translateDynamicContent() {
    this.translateStaticContent();
    this.formatDynamicNumbers();
    this.formatDynamicDates();
    this.updateLanguageSelector();
  }

  formatDynamicNumbers() {
    document.querySelectorAll('[data-number]').forEach(element => {
      const number = parseFloat(element.getAttribute('data-number'));
      if (!isNaN(number)) {
        element.textContent = this.formatNumber(number);
      }
    });
  }

  formatDynamicDates() {
    document.querySelectorAll('[data-date]').forEach(element => {
      const dateStr = element.getAttribute('data-date');
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        element.textContent = this.formatDate(date);
      }
    });
  }

  updateLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      const lang = this.supportedLanguages[this.currentLanguage];
      const flagSpan = selector.querySelector('.language-flag');
      const nameSpan = selector.querySelector('.language-name');
      const srSpan = selector.querySelector('.sr-only');
      
      if (flagSpan) flagSpan.textContent = lang.flag;
      if (nameSpan) nameSpan.textContent = lang.nativeName;
      if (srSpan) srSpan.textContent = `Current language: ${lang.name}`;
    }

    // Update dropdown options
    document.querySelectorAll('.language-option').forEach(option => {
      const isActive = option.dataset.lang === this.currentLanguage;
      option.classList.toggle('active', isActive);
      
      const checkIcon = option.querySelector('.fa-check');
      if (checkIcon) {
        checkIcon.style.display = isActive ? 'inline' : 'none';
      }
    });
  }

  setupTranslationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Translate any new elements with i18n attributes
            if (node.hasAttribute && node.hasAttribute('data-i18n')) {
              this.translateElement(node);
            }
            
            // Translate child elements
            const i18nElements = node.querySelectorAll ? node.querySelectorAll('[data-i18n]') : [];
            i18nElements.forEach(element => this.translateElement(element));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  translateElement(element) {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const translation = this.translate(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.type === 'submit' || element.type === 'button') {
          element.value = translation;
        } else {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    }
  }

  updateUrlLanguage() {
    const url = new URL(window.location);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.replaceState({}, '', url.toString());
  }

  // UI Feedback Methods
  showLanguageChangeLoading() {
    if (window.showLoading) {
      window.showLoading('Changing language...');
    }
  }

  hideLanguageChangeLoading() {
    if (window.hideLoading) {
      window.hideLoading();
    }
  }

  showLanguageChangeSuccess() {
    const lang = this.supportedLanguages[this.currentLanguage];
    if (window.showToast) {
      window.showToast(`Language changed to ${lang.nativeName} (${lang.name})`, 'success');
    }
  }

  showLanguageChangeError() {
    if (window.showToast) {
      window.showToast('Failed to change language. Please try again.', 'error');
    }
  }

  announceLanguageChange() {
    const lang = this.supportedLanguages[this.currentLanguage];
    if (window.announce) {
      window.announce(`Language changed to ${lang.name}`, 'polite');
    }
  }

  // Public API Methods
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  isRTL() {
    return this.supportedLanguages[this.currentLanguage]?.rtl || false;
  }

  getLanguageInfo(langCode = this.currentLanguage) {
    return this.supportedLanguages[langCode];
  }

  // Advanced Translation Features
  translateWithPluralization(key, count, params = {}) {
    // Simple pluralization support
    const pluralKey = count === 1 ? `${key}_one` : `${key}_other`;
    const translation = this.translate(pluralKey) || this.translate(key);
    
    return translation.replace(/{{count}}/g, this.formatNumber(count));
  }

  getRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat(this.currentLanguage, { numeric: 'auto' });
    const diff = date - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return rtf.format(days, 'day');
  }
}

// Initialize i18n manager
document.addEventListener('DOMContentLoaded', async () => {
  window.i18nManager = new InternationalizationManager();
  
  // Expose global methods
  window.translate = (key, params) => window.i18nManager.translate(key, params);
  window.formatNumber = (number) => window.i18nManager.formatNumber(number);
  window.formatDate = (date) => window.i18nManager.formatDate(date);
  window.formatCurrency = (amount) => window.i18nManager.formatCurrency(amount);
  window.changeLanguage = (langCode) => window.i18nManager.changeLanguage(langCode);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InternationalizationManager;
}