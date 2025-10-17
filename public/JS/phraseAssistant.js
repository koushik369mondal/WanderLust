document.addEventListener('DOMContentLoaded', () => {
  const widget = document.getElementById('phrase-assistant-widget');
  const page = document.getElementById('custom-phrase'); // check if on full page

  if (widget) {
    // Widget mode
    initWidget();
  } else if (page) {
    // Full page mode
    initPage();
  }

  function initWidget() {
    const defaultLang = widget.getAttribute('data-default-lang') || '';

    const input = document.getElementById('phrase-input');
    const target = document.getElementById('phrase-target');
    const translateBtn = document.getElementById('translate-btn');
    const ttsBtn = document.getElementById('tts-btn');
    const saveBtn = document.getElementById('save-btn');
    const translatedText = document.getElementById('translated-text');
    const transliterationEl = document.getElementById('transliteration');
    const favList = document.getElementById('favorites-list');

    const LOCAL_CACHE_KEY = 'localPhraseCache_v1';

    function loadCache() {
      try {
        const raw = localStorage.getItem(LOCAL_CACHE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }
    function saveCache(items) {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(items));
    }

    function renderFavorites() {
      const items = loadCache();
      favList.innerHTML = '';
      items.slice(0,50).forEach(it => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<div><strong>${it.sourceText}</strong><div class="small text-muted">${it.translation}</div></div><div><button class="btn btn-sm btn-outline-primary copy-btn">Copy</button></div>`;
        li.querySelector('.copy-btn').addEventListener('click', ()=>navigator.clipboard.writeText(it.translation || ''));
        favList.appendChild(li);
      });
    }

    async function doTranslate() {
      const text = input.value.trim();
      const tgt = target.value.trim() || defaultLang || 'hi';
      if (!text) return alert('Enter a phrase');
      translateBtn.disabled = true;
      try {
        const res = await fetch('/phrase-assistant/api/translate', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ text, target: tgt })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        translatedText.textContent = data.translation || '';
        transliterationEl.textContent = data.transliteration || '';
        // cache locally
        const cache = loadCache();
        cache.unshift({ sourceText: text, translation: data.translation, transliteration: data.transliteration, language: tgt, createdAt: Date.now() });
        saveCache(cache.slice(0,200));
        renderFavorites();
      } catch (e) {
        alert('Translation failed: '+e.message);
      } finally {
        translateBtn.disabled = false;
      }
    }

    function speakText() {
      const text = translatedText.textContent.trim();
      if (!text) return;
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utter);
      } else {
        alert('TTS not supported in this browser');
      }
    }

    saveBtn.addEventListener('click', async ()=>{
      const sourceText = input.value.trim();
      const translation = translatedText.textContent.trim();
      const transliteration = transliterationEl.textContent.trim();
      if (!sourceText || !translation) return alert('Translate first');
      try {
        const res = await fetch('/phrase-assistant/api/save', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sourceText, translation, transliteration, language: target.value })});
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        // also cache locally
        const cache = loadCache();
        cache.unshift({ sourceText, translation, transliteration, language: target.value, createdAt: Date.now() });
        saveCache(cache.slice(0,200));
        renderFavorites();
        alert('Saved');
      } catch (e) {
        alert('Save failed: '+(e.message||e));
      }
    });

    translateBtn.addEventListener('click', doTranslate);
    ttsBtn.addEventListener('click', speakText);

    renderFavorites();
  }

  function initPage() {
    // Full page functionality
    const customPhrase = document.getElementById('custom-phrase');
    const customTarget = document.getElementById('custom-target');
    const customCategory = document.getElementById('custom-category');
    const customTranslateBtn = document.getElementById('custom-translate-btn');
    const customResult = document.getElementById('custom-result');
    const customTranslatedText = document.getElementById('custom-translated-text');
    const customTransliteration = document.getElementById('custom-transliteration');
    const customTtsBtn = document.getElementById('custom-tts-btn');
    const customSaveBtn = document.getElementById('custom-save-btn');

    const quickCategory = document.getElementById('quick-category');
    const quickLang = document.getElementById('quick-lang');
    const loadQuickBtn = document.getElementById('load-quick-btn');
    const quickPhrases = document.getElementById('quick-phrases');

    const favoritesList = document.getElementById('favorites-list');

    const LOCAL_CACHE_KEY = 'localPhraseCache_v1';

    function loadCache() {
      try {
        const raw = localStorage.getItem(LOCAL_CACHE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }
    function saveCache(items) {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(items));
    }

    function renderFavorites() {
      // Load from server if logged in, else local
      fetch('/phrase-assistant/api/favorites')
        .then(res => res.json())
        .then(data => {
          const items = data.favorites || loadCache();
          favoritesList.innerHTML = '';
          items.slice(0,20).forEach(it => {
            const div = document.createElement('div');
            div.className = 'mb-2 p-2 border rounded';
            div.innerHTML = `<strong>${it.sourceText}</strong><br><span class="text-muted">${it.translatedText || it.translation}</span><br><button class="btn btn-sm btn-outline-primary copy-btn">Copy</button>`;
            div.querySelector('.copy-btn').addEventListener('click', () => navigator.clipboard.writeText(it.translatedText || it.translation || ''));
            favoritesList.appendChild(div);
          });
        })
        .catch(() => {
          // Fallback to local
          const items = loadCache();
          favoritesList.innerHTML = '';
          items.slice(0,20).forEach(it => {
            const div = document.createElement('div');
            div.className = 'mb-2 p-2 border rounded';
            div.innerHTML = `<strong>${it.sourceText}</strong><br><span class="text-muted">${it.translation}</span><br><button class="btn btn-sm btn-outline-primary copy-btn">Copy</button>`;
            div.querySelector('.copy-btn').addEventListener('click', () => navigator.clipboard.writeText(it.translation || ''));
            favoritesList.appendChild(div);
          });
        });
    }

    customTranslateBtn.addEventListener('click', async () => {
      const text = customPhrase.value.trim();
      const tgt = customTarget.value.trim();
      if (!text || !tgt) return alert('Enter phrase and target language');
      customTranslateBtn.disabled = true;
      try {
        const res = await fetch('/phrase-assistant/api/translate', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ text, target: tgt })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        customTranslatedText.textContent = data.translation || '';
        customTransliteration.textContent = data.transliteration || '';
        customResult.style.display = 'block';
        // Cache locally
        const cache = loadCache();
        cache.unshift({ sourceText: text, translation: data.translation, transliteration: data.transliteration, language: tgt, createdAt: Date.now() });
        saveCache(cache.slice(0,200));
      } catch (e) {
        alert('Translation failed: ' + e.message);
      } finally {
        customTranslateBtn.disabled = false;
      }
    });

    customTtsBtn.addEventListener('click', () => {
      const text = customTranslatedText.textContent.trim();
      if (!text) return;
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utter);
      } else {
        alert('TTS not supported');
      }
    });

    customSaveBtn.addEventListener('click', async () => {
      const sourceText = customPhrase.value.trim();
      const translation = customTranslatedText.textContent.trim();
      const transliteration = customTransliteration.textContent.trim();
      const language = customTarget.value.trim();
      const category = customCategory.value;
      if (!sourceText || !translation) return alert('Translate first');
      try {
        const res = await fetch('/phrase-assistant/api/save', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ sourceText, translation, transliteration, language, category })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        alert('Saved to favorites');
        renderFavorites();
      } catch (e) {
        alert('Save failed: ' + (e.message || e));
      }
    });

    loadQuickBtn.addEventListener('click', () => {
      const category = quickCategory.value;
      const lang = quickLang.value.trim();
      if (!lang) return alert('Enter language code');
      // Predefined phrases
      const phrases = {
        greetings: ['Hello', 'Thank you', 'Please', 'Goodbye'],
        directions: ['Where is the nearest bus stop?', 'How do I get to the airport?', 'Is this the right way?'],
        dining: ['Does this dish contain nuts?', 'Water please', 'The bill please'],
        emergency: ['I need help', 'Call the police', 'I am lost'],
        etiquette: ['Excuse me', 'May I?', 'I am sorry']
      };
      const list = phrases[category] || [];
      quickPhrases.innerHTML = '';
      list.forEach(phrase => {
        const div = document.createElement('div');
        div.className = 'mb-2 p-2 border rounded d-flex justify-content-between';
        div.innerHTML = `<span>${phrase}</span><button class="btn btn-sm btn-primary translate-quick">Translate</button>`;
        div.querySelector('.translate-quick').addEventListener('click', () => {
          customPhrase.value = phrase;
          customTarget.value = lang;
          customTranslateBtn.click();
        });
        quickPhrases.appendChild(div);
      });
    });

    renderFavorites();
  }
});
