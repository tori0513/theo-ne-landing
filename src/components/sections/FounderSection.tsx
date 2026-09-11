import { useTranslation } from "react-i18next";
import { LINKS } from "@site";

export default function FounderSection() {
  const { t } = useTranslation();
  const items = t('founder.items', { returnObjects: true }) as string[];

  return (
    <section id="founder" aria-labelledby="founder-h">
      <div className="section-head">
        <h2 id="founder-h" className="eyebrow">{t('founder.heading')}</h2>
      </div>
      <div className="person">
        <p className="person-name">
          <span className="t-heading">{t('founder.name')}</span>
          <small>{t('founder.role')}</small>
        </p>
        <ul className="spec">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="more">
          <a className="btn btn-ghost" href={LINKS.linkedin}>{t('founder.linkedin')}</a>
        </p>
      </div>
    </section>
  );
}
