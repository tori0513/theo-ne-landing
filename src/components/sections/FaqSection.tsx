import { useTranslation } from "react-i18next";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <section id="faq" aria-labelledby="faq-h">
      <div className="section-head">
        <h2 id="faq-h" className="eyebrow">{t('faq.heading')}</h2>
      </div>
      <div className="faq">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
