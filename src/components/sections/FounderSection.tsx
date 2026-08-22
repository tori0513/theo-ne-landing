import { Linkedin } from "lucide-react";
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
      <p className="mb-3 max-w-[680px] text-base leading-[1.6] text-charcoal text-pretty">
        {t('founder.bio1')}
      </p>
      <p className="max-w-[680px] text-base leading-[1.6] text-charcoal text-pretty">
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

        <a
          href="https://www.linkedin.com/in/hanabeom/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('founder.linkedinLabel')}
          className="mt-1 inline-flex w-fit items-center gap-1.5 text-[15px] text-charcoal-400 transition-colors hover:text-charcoal"
        >
          <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      </div>
    </section>
  );
}
