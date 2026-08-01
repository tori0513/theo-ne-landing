import { useTranslation } from "react-i18next";

export default function ProductSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-6 text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('product.eyebrow')}
      </div>
      <h2 className="mb-1.5 text-[22px] font-bold tracking-[0.04em] text-charcoal md:text-[25px]">
        {t('product.title')}
      </h2>
      <p className="mb-3 text-base leading-[1.6] text-charcoal-500">
        {t('product.tagline')}
      </p>
      <p className="max-w-[680px] text-base leading-[1.6] text-charcoal text-balance">
        {t('product.desc')}
      </p>

      <div className="mt-6 flex flex-col items-start gap-3">
        <a
          href="https://trops.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm bg-navy px-[26px] py-[13px] text-[15px] font-semibold text-cream transition-colors hover:bg-navy-hover"
        >
          {t('product.cta')}&nbsp;&nbsp;→
        </a>
        <div className="text-[13px] text-charcoal-400">{t('product.badge')}</div>
      </div>
    </section>
  );
}
