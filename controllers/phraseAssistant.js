const Phrase = require('../models/phrase');
const fetch = require('node-fetch');
const OpenAI = require('openai');

const hasOpenAI = !!process.env.OPENAI_API_KEY;
let openai;
if (hasOpenAI) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function fallbackTranslate(text, target) {
  // Use Google Translate API as primary fallback
  try {
    const { Translate } = require('@google-cloud/translate').v2;
    const translate = new Translate();
    const [translation] = await translate.translate(text, target);
    return translation;
  } catch (gErr) {
    console.error('Google Translate fallback error', gErr && gErr.message ? gErr.message : gErr);
    // Fallback to LibreTranslate if Google fails
    try {
      const resp = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'auto', target, format: 'text' })
      });
      const data = await resp.json();
      return data.translatedText || data.translated || '';
    } catch (err) {
      console.error('LibreTranslate fallback error', err && err.message ? err.message : err);
      return '';
    }
  }
}

async function openaiTranslate(text, target) {
  if (!openai) return { translation: '', transliteration: '' };
  try {
    const system = `You are a concise translation assistant. Respond with a JSON object: {"translation": "...", "transliteration": "..."}. Do not include any additional text.`;
    const user = `Translate the following text into ${target} and provide a phonetic transliteration if applicable: "${text}"`;
    const resp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 300
    });
    const content = resp && resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
    if (!content) return { translation: '', transliteration: '' };
    // Try to parse JSON from the model; fall back to heuristics if parsing fails
    try {
      const parsed = JSON.parse(content);
      return { translation: parsed.translation || '', transliteration: parsed.transliteration || '' };
    } catch (e) {
      // Attempt to extract first line as translation
      const firstLine = content.split('\n').find(Boolean) || '';
      return { translation: firstLine.trim(), transliteration: '' };
    }
  } catch (e) {
    console.error('OpenAI translate error', e && e.message ? e.message : e);
    return { translation: '', transliteration: '' };
  }
}

function renderIndex(req, res) {
  return res.render('phraseAssistant/index', { title: 'Local Language Assistant' });
}

async function translate(req, res) {
  const { text, target } = req.body || {};
  if (!text || !target) return res.status(400).json({ error: 'text and target are required' });
  try {
    let translation = '';
    let transliteration = '';
    if (hasOpenAI) {
      const out = await openaiTranslate(text, target);
      translation = out.translation || '';
      transliteration = out.transliteration || '';
    }
    if (!translation) {
      translation = await fallbackTranslate(text, target);
    }
    return res.json({ translation, transliteration });
  } catch (error) {
    console.error('Translate API error:', error && error.message ? error.message : error);
    return res.status(500).json({ error: 'Translation failed' });
  }
}

async function saveFavorite(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Login required' });
  const { sourceText, translation, transliteration, language, category } = req.body || {};
  if (!sourceText || !translation) return res.status(400).json({ error: 'sourceText and translation required' });
  try {
    const fav = new Phrase({ user: req.user._id, sourceText, translatedText: translation, transliteration, language, category });
    await fav.save();
    return res.json({ ok: true, id: fav._id });
  } catch (e) {
    console.error('Save favorite error:', e && e.message ? e.message : e);
    return res.status(500).json({ error: 'Failed to save favorite' });
  }
}

async function getFavorites(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Login required' });
  try {
    const favs = await Phrase.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
    return res.json({ favorites: favs });
  } catch (e) {
    console.error('Get favorites error:', e && e.message ? e.message : e);
    return res.status(500).json({ error: 'Failed to load favorites' });
  }
}

module.exports = { renderIndex, translate, saveFavorite, getFavorites };
