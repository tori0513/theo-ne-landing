import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LANGS, pathForLang, type Lang } from "@/i18n";

const LABELS: Record<Lang, string> = { ko: 'KO', en: 'EN' };

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const current = i18n.language as Lang;

  return (
    <header className="flex items-baseline justify-between gap-4 border-b border-charcoal pb-4">
      <div className="flex items-baseline gap-3.5 min-w-0">
        <span className="font-serif text-[22px] font-semibold tracking-[0.16em] text-charcoal">
          THÉONÉ
        </span>
        <span className="text-[13px] text-charcoal-400">{t('header.legalName')}</span>
      </div>

      {/* Real links, not client-side toggles, so each language is its own crawlable URL. */}
      <nav className="flex items-baseline gap-0.5 flex-none">
        {LANGS.map((lang, idx) => (
          <span key={lang} className="flex items-baseline gap-0.5">
            {idx > 0 && <span className="text-charcoal-150 text-[13px]">/</span>}
            <a
              href={pathForLang(lang)}
              hrefLang={lang}
              aria-current={current === lang ? 'page' : undefined}
              className={cn(
                "px-1.5 py-1 font-sans text-[13px] font-bold tracking-[0.06em] transition-colors",
                current === lang ? "text-charcoal" : "text-[#A0A1A4] hover:text-charcoal"
              )}
            >
              {LABELS[lang]}
            </a>
          </span>
        ))}
      </nav>
    </header>
  );
}
