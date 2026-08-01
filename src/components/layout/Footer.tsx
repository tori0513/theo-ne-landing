import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col gap-1.5 border-t border-charcoal pt-5 text-[13px] leading-[1.55] text-charcoal-400">
      <div>{t('footer.copyright')}</div>
      <div>{t('footer.disclaimer')}</div>
    </footer>
  );
}
