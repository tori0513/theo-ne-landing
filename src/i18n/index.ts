import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

export type Lang = 'ko' | 'en';

export const LANGS: Lang[] = ['ko', 'en'];
export const DEFAULT_LANG: Lang = 'ko';

/**
 * Language is derived from the URL path, not localStorage, so that the server
 * prerender and the client hydration always agree. `/en/...` is English,
 * everything else is Korean.
 */
export function langFromPath(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'ko';
}

export function pathForLang(lang: Lang): string {
  return lang === 'en' ? '/en/' : '/';
}

/**
 * A fresh instance per render — the prerender script renders both languages in
 * one Node process, so a module-level singleton would leak state between them.
 */
export function createI18n(lang: Lang): I18nInstance {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    lng: lang,
    fallbackLng: DEFAULT_LANG,
    interpolation: { escapeValue: false },
  });
  return instance;
}
