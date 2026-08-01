import { useTranslation } from "react-i18next";

export default function FounderSection() {
  const { t } = useTranslation();
  const credentials = t('founder.credentials', { returnObjects: true }) as string[];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-6 text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('founder.eyebrow')}
      </div>
      <h2 className="mb-3 text-xl font-bold text-charcoal md:text-[23px]">
        {t('founder.name')}
      </h2>
      <p className="mb-3 max-w-[680px] text-base leading-[1.6] text-charcoal text-balance">
        {t('founder.bio1')}
      </p>
      <p className="max-w-[680px] text-base leading-[1.6] text-charcoal text-balance">
        {t('founder.bio2')}
      </p>

      <div className="mt-[26px] flex flex-col gap-2.5">
        <div className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
          {t('founder.credentialsLabel')}
        </div>
        <div className="flex flex-col gap-1.5 text-[15px] leading-[1.55] text-charcoal">
          {credentials.map((item) => (
            <div key={item} className="flex gap-2.5">
              <span className="text-charcoal-300">·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
