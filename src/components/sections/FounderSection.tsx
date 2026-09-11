import { useTranslation } from "react-i18next";
import { LINKS } from "@site";

export default function FounderSection() {
  const { t } = useTranslation();
  const items = t('founder.items', { returnObjects: true }) as string[];

  return (
    <section id="founder" aria-labelledby="founder-h">
      <h2 id="founder-h">{t('founder.heading')}</h2>
      <div className="person">
        <p className="person-name">
          <span>{t('founder.name')}</span>
          <small>{t('founder.role')}</small>
        </p>
        <div>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="more">
            <a href={LINKS.linkedin}>{t('founder.linkedin')}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
