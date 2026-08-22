import { useTranslation } from "react-i18next";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-[18px] text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('faq.eyebrow')}
      </div>
      <dl className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.q}
            className="flex flex-col gap-1.5 border-b border-charcoal-50 py-4 first:pt-0"
          >
            <dt className="text-base font-bold leading-[1.5] text-charcoal">
              {item.q}
            </dt>
            <dd className="max-w-[680px] text-[15px] leading-[1.6] text-charcoal-500 text-pretty">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
