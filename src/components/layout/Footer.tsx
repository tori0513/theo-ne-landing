import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <p>
        <span>{t('footer.legalName')}</span>
        <span>{t('footer.ceo')}</span>
        <span>{t('footer.regNo')}</span>
      </p>
      <p>{t('footer.address')}</p>
      <p>
        <span>{t('footer.disclaimer')}</span>
        <span>{t('footer.copyright')}</span>
      </p>
    </footer>
  );
}
