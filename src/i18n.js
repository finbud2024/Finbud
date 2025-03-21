// src/i18n.js
import { createI18n } from 'vue-i18n';

// Import your locale files
import en from './locales/en.json';
import vi from './locales/vi.json';

const messages = {
  en: en,
  vi: vi,
};

const i18n = createI18n({
  locale: 'en', // default locale
  messages,
});

export default i18n;