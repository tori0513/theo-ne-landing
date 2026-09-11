import { useTranslation } from "react-i18next";
import { LANGS, pathForLang, type Lang } from "@/i18n";

const LABELS: Record<Lang, string> = { ko: 'KO', en: 'EN' };

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const current = i18n.language as Lang;

  return (
    <header>
      <a className="wordmark" href="#top">THÉONÉ</a>
      <nav aria-label={t('nav.menuLabel')}>
        <a className="hide-m" href="#work">{t('nav.work')}</a>
        <a className="hide-m" href="#founder">{t('nav.founder')}</a>
        <a href="#contact">{t('nav.contact')}</a>
        {/* Real links, not a client-side toggle, so each language is its own
            crawlable URL and the pair can carry hreflang. */}
        <div className="lang" role="group" aria-label={t('nav.langLabel')}>
          {LANGS.map((lang) => (
            <a
              key={lang}
              href={pathForLang(lang)}
              hrefLang={lang}
              aria-current={current === lang ? 'page' : undefined}
            >
              {LABELS[lang]}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
