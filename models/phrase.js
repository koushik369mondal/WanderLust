const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sourceText: { type: String, required: true },
  translatedText: { type: String, required: true },
  transliteration: { type: String },
  language: { type: String },
  category: { type: String },
  audioUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Phrase', phraseSchema);
