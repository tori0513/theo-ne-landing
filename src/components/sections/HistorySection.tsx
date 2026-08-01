import { useTranslation } from "react-i18next";

interface HistoryItem {
  year: string;
  event: string;
}

export default function HistorySection() {
  const { t } = useTranslation();
  const items = t('history.items', { returnObjects: true }) as HistoryItem[];

  return (
    <section className="flex flex-col border-t border-charcoal-100 pt-7">
      <div className="mb-[18px] text-[12.5px] font-bold uppercase tracking-[0.16em] text-charcoal">
        {t('history.eyebrow')}
      </div>
      <div className="flex flex-col text-[15px] leading-[1.55]">
        {items.map((item, idx) => (
          <div
            key={`${item.year}-${idx}`}
            className="grid grid-cols-[56px_20px_1fr] border-b border-charcoal-50 py-2.5"
          >
            <span className="text-charcoal-400">{item.year}</span>
            <span className="text-charcoal-300">·</span>
            <span className="text-charcoal">{item.event}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
