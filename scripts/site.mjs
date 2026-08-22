// Single source of truth for everything the prerenderer needs that is not
// already in src/i18n/locales/*.json.

export const ORIGIN = 'https://theo-ne.com';

export const OG_IMAGE = {
  path: '/og.png',
  width: 1200,
  height: 630,
  type: 'image/png',
};

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/hanabeom/',
  trops: 'https://trops.kr',
};

export const LANGS = ['ko', 'en'];
export const DEFAULT_LANG = 'ko';

/** URL path for a language. Korean is the root; English lives under /en/. */
export const pathFor = (lang) => (lang === DEFAULT_LANG ? '/' : `/${lang}/`);
export const urlFor = (lang) => `${ORIGIN}${pathFor(lang)}`;

export const META = {
  ko: {
    locale: 'ko_KR',
    title: 'THÉONÉ Inc. (주)테오네 · 중소기업 수출입 거래 실무',
    description:
      '(주)테오네는 중소기업의 수출입 실무를 직접 처리하고, 반복되는 일을 AI 소프트웨어로 만듭니다. 수출입 거래 운영 서비스 TROPS를 개발하고 운영합니다.',
    siteName: '(주)테오네 THÉONÉ Inc.',
    // Filled in from the locale headline at build time; see prerender.mjs.
    ogImageAlt: null,
    addressLocality: '강남구',
    addressRegion: '서울',
    orgDescription:
      '(주)테오네는 중소기업의 수출입 거래 실무를 직접 처리하고, 그 과정에서 반복되는 일을 AI 소프트웨어로 만드는 회사입니다. 수출 거래 운영 서비스 TROPS를 개발·운영합니다.',
    founderJobTitle: '대표',
    founderDescription:
      '뉴욕주 변호사이자 소프트웨어 엔지니어. 글로벌 기업과 법무법인에서 수출 거래 실무를 다뤘습니다.',
    regNoLabel: '사업자등록번호',
    knowsAbout: [
      '수출입 거래 실무',
      '해외 계약 행정',
      '무역 규정 준수',
      '수출 절차',
      '대금 회수',
      '파트너십 운영',
      '국가 간 프로젝트 관리',
      'AI 거래 운영 자동화',
    ],
    serviceCatalogName: '수출입 거래 실무 서비스',
    award: 'KAIST AI 창업 100인 선정',
  },
  en: {
    locale: 'en_US',
    title: 'THÉONÉ Inc. · Cross-border trade operations for SMEs',
    description:
      'THÉONÉ Inc. handles cross-border trade operations for small and mid-sized companies directly and builds what repeats into AI software. Developer of TROPS, an AI trade operations service for exporters.',
    siteName: 'THÉONÉ Inc.',
    ogImageAlt: null,
    addressLocality: 'Gangnam-gu',
    addressRegion: 'Seoul',
    orgDescription:
      'THÉONÉ Inc. handles cross-border trade operations for small and mid-sized companies directly and builds the parts that repeat into AI software. It develops and operates TROPS, an AI trade operations service for exporters.',
    founderJobTitle: 'Founder',
    founderDescription:
      'Attorney admitted in New York and a software engineer. Handled cross-border transactions at a global corporation and at a law firm.',
    regNoLabel: 'Business Registration Number (Republic of Korea)',
    knowsAbout: [
      'Cross-border trade operations',
      'International contract administration',
      'Trade compliance',
      'Export procedures',
      'Payment collection',
      'Partnership operations',
      'Cross-border project management',
      'AI trade operations automation',
    ],
    serviceCatalogName: 'Cross-border trade operations services',
    award: 'Selected, KAIST AI Founders 100',
  },
};
