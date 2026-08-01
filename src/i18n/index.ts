import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

const storedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('theone-lang') : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en }
    },
    lng: storedLang === 'en' ? 'en' : 'ko',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('theone-lang', lng);
  } catch {
    // localStorage unavailable, skip persistence
  }
});

export default i18n;
