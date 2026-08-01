import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col">
      <div className="mb-4 text-[12.5px] font-semibold tracking-[0.16em] text-charcoal">
        {t('hero.label')}
      </div>
      <h1 className="mb-3 text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-charcoal md:text-[44px]">
        {t('hero.title')}
      </h1>
      <p className="text-lg leading-[1.6] text-charcoal-600 text-balance">
        {t('hero.desc')}
      </p>
    </section>
  );
}
