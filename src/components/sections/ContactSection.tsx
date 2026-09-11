import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');

  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <h2 id="contact-h">{t('contact.heading')}</h2>
      <p style={{ margin: 0 }}>
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </section>
  );
}
