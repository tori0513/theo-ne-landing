import { useTranslation } from "react-i18next";

interface Step {
  badge: string;
  text: string;
}

export default function WhatWeDoSection() {
  const { t } = useTranslation();
  const items = t('whatWeDo.handle.items', { returnObjects: true }) as string[];
  const steps = t('whatWeDo.build.steps', { returnObjects: true }) as Step[];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-6 text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('whatWeDo.eyebrow')}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold leading-[1.3] tracking-[-0.01em] text-charcoal md:text-[25px]">
          {t('whatWeDo.handle.title')}
        </h2>
        <p className="text-base leading-[1.6] text-charcoal-500">
          {t('whatWeDo.handle.desc')}
        </p>
        <div className="mt-1 flex flex-col gap-1.5 text-base leading-[1.55] text-charcoal">
          {items.map((item) => (
            <div key={item} className="flex gap-2.5">
              <span className="text-charcoal-300">·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ml-[11px] mt-6 h-16 w-[47px] border-b border-l border-charcoal-200" />

      <div className="ml-[60px] mt-[18px] flex flex-col gap-2">
        <h2 className="text-[22px] font-bold leading-[1.3] tracking-[-0.01em] text-charcoal md:text-[25px]">
          {t('whatWeDo.build.title')}
        </h2>
        <p className="text-base leading-[1.6] text-charcoal-500">
          {t('whatWeDo.build.desc')}
        </p>
        <div className="mt-2 flex flex-col gap-2.5">
          {steps.map((step) => (
            <div key={step.badge} className="flex items-baseline gap-3.5">
              <span className="flex-none rounded-sm border border-charcoal-150 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.1em] text-charcoal-600">
                {step.badge}
              </span>
              <span className="text-base leading-[1.6] text-charcoal">{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
