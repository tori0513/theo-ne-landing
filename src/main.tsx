import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import './index.css';
import { createI18n, langFromPath } from './i18n';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <I18nextProvider i18n={createI18n(langFromPath(window.location.pathname))}>
      <App />
    </I18nextProvider>
  </StrictMode>
);

// Prerendered pages carry real markup and are hydrated; `vite dev` serves an
// empty root, which must be rendered from scratch instead.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
