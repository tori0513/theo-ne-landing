import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export default function CorporateInfoSection() {
  const { t } = useTranslation();

  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: t('corporate.fields.name'), value: t('corporate.values.name') },
    { label: t('corporate.fields.ceo'), value: t('corporate.values.ceo') },
    { label: t('corporate.fields.regNo'), value: t('corporate.values.regNo') },
    { label: t('corporate.fields.address'), value: t('corporate.values.address') },
    {
      label: t('corporate.fields.email'),
      value: (
        <a
          href={`mailto:${t('corporate.values.email')}`}
          className="text-charcoal underline underline-offset-[3px]"
        >
          {t('corporate.values.email')}
        </a>
      ),
    },
  ];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-[18px] text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('corporate.eyebrow')}
      </div>
      <div className="flex flex-col text-[15px] leading-[1.55]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[clamp(96px,18vw,160px)_1fr] gap-x-5 border-b border-charcoal-50 py-2.5"
          >
            <span className="text-charcoal-400">{row.label}</span>
            <span className="text-charcoal">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
