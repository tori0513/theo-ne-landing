import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');

  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <div className="contact-card">
        <div>
          <h2 id="contact-h" className="eyebrow">{t('contact.heading')}</h2>
          <a className="mail" href={`mailto:${email}`}>{email}</a>
        </div>
        <a className="btn btn-primary" href={`mailto:${email}`}>{t('work.support.cta')}</a>
      </div>
    </section>
  );
}
