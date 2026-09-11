import { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * The statement is the headline; the legal name moves up into the eyebrow.
 * The supporting line reuses the first FAQ answer so the hero never carries
 * copy that does not already exist in the locale file.
 */
export default function HeroSection() {
  const { t } = useTranslation();
  const lede = t('hero.lede', { returnObjects: true }) as string[];
  const faq = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <div className="hero">
      <div className="hero-stack">
        <p className="eyebrow">
          <span>{t('hero.name')}</span>
          <span>{t('hero.nameAlt')}</span>
        </p>
        <h1 className="t-hero">
          {lede.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>
        <p className="lede t-subtitle">{faq[0].a}</p>
        <p className="ctas">
          <a className="btn btn-primary" href="#contact">{t('work.support.cta')}</a>
          <a className="btn btn-secondary" href="#work">{t('nav.work')}</a>
        </p>
      </div>
    </div>
  );
}
