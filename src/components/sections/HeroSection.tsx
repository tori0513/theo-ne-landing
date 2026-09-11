import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const lede = t('hero.lede', { returnObjects: true }) as string[];

  return (
    <div className="hero">
      <h1>
        <span>{t('hero.name')}</span>
        <span className="h1-en">{t('hero.nameAlt')}</span>
      </h1>
      <p className="lede">
        {lede.map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
