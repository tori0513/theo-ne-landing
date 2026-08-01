import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  return (
    <header className="flex items-baseline justify-between gap-4 border-b border-charcoal pb-4">
      <div className="flex items-baseline gap-3.5 min-w-0">
        <span className="font-serif text-[22px] font-semibold tracking-[0.16em] text-charcoal">
          THÉONÉ
        </span>
        <span className="text-[13px] text-charcoal-400">{t('header.legalName')}</span>
      </div>

      <div className="flex items-baseline gap-0.5 flex-none">
        <button
          type="button"
          onClick={() => i18n.changeLanguage('ko')}
          className={cn(
            "px-1.5 py-1 font-sans text-[13px] font-bold tracking-[0.06em] transition-colors",
            i18n.language === 'ko' ? "text-charcoal" : "text-[#A0A1A4]"
          )}
        >
          KO
        </button>
        <span className="text-charcoal-150 text-[13px]">/</span>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          className={cn(
            "px-1.5 py-1 font-sans text-[13px] font-bold tracking-[0.06em] transition-colors",
            i18n.language === 'en' ? "text-charcoal" : "text-[#A0A1A4]"
          )}
        >
          EN
        </button>
      </div>
    </header>
  );
}
