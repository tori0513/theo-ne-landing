import { useTranslation } from "react-i18next";

interface Feature {
  title: string;
  desc: string;
}

export default function ProductSection() {
  const { t } = useTranslation();
  const features = t('product.features', { returnObjects: true }) as Feature[];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-6 text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('product.eyebrow')}
      </div>
      <h2 className="mb-1.5 text-[22px] font-bold tracking-[0.04em] text-charcoal md:text-[25px]">
        {t('product.title')}
      </h2>
      <p className="mb-5 text-base leading-[1.6] text-charcoal-500">
        {t('product.tagline')}
      </p>

      <div className="flex max-w-[680px] flex-col gap-3">
        <p className="text-base leading-[1.6] text-charcoal text-pretty">
          {t('product.desc')}
        </p>
        <p className="text-base leading-[1.6] text-charcoal text-pretty">
          {t('product.desc2')}
        </p>
      </div>

      <div className="mt-7 flex flex-col">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-1.5 border-t border-charcoal-50 py-4 last:pb-0"
          >
            <h3 className="text-base font-bold leading-[1.5] text-charcoal">
              {feature.title}
            </h3>
            <p className="max-w-[680px] text-[15px] leading-[1.6] text-charcoal-500 text-pretty">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-start gap-3">
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
