import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { createI18n, type Lang } from './i18n';

/** Called by scripts/prerender.mjs once per language at build time. */
export function render(lang: Lang): string {
  return renderToString(
    <I18nextProvider i18n={createI18n(lang)}>
      <App />
    </I18nextProvider>
  );
}
