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
      <h2 id="faq-h">{t('faq.heading')}</h2>
      <div className="faq">
        {items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
