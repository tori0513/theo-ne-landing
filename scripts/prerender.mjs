/**
 * Turns the client-rendered SPA into static HTML at build time.
 *
 * AI search crawlers (GPTBot / OAI-SearchBot, ClaudeBot, PerplexityBot,
 * Google-Extended, Bingbot) do not execute JavaScript, so without this step
 * they only ever see `<div id="root"></div>`. Here every language gets a fully
 * rendered document plus a complete head and a JSON-LD graph.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { LANGS, DEFAULT_LANG, META, ORIGIN, OG_IMAGE, LINKS, VERIFICATION, pathFor, urlFor } from './site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const locales = Object.fromEntries(
  LANGS.map((lang) => [lang, readJson(`src/i18n/locales/${lang}.json`)])
);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON-LD is embedded in HTML, so `<` must not be able to close the script. */
const jsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

function buildGraph(lang) {
  const L = locales[lang];
  const M = META[lang];
  const pageUrl = urlFor(lang);
  const orgId = `${ORIGIN}/#organization`;
  const founderId = `${ORIGIN}/#founder`;
  const tropsId = `${ORIGIN}/#trops`;
  const siteId = `${ORIGIN}/#website`;

  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: L.corporate.values.name,
    legalName: L.corporate.values.name,
    alternateName: lang === 'ko' ? ['THÉONÉ Inc.', 'THÉONÉ', '테오네'] : ['(주)테오네', 'THÉONÉ'],
    url: ORIGIN,
    description: M.orgDescription,
    slogan: L.hero.desc,
    foundingDate: '2026',
    email: L.corporate.values.email,
    logo: { '@type': 'ImageObject', url: `${ORIGIN}${OG_IMAGE.path}` },
    image: `${ORIGIN}${OG_IMAGE.path}`,
    taxID: L.corporate.values.regNo,
    identifier: {
      '@type': 'PropertyValue',
      name: M.regNoLabel,
      value: L.corporate.values.regNo,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: L.corporate.values.address,
      addressLocality: M.addressLocality,
      addressRegion: M.addressRegion,
      addressCountry: 'KR',
    },
    founder: { '@id': founderId },
    employee: { '@id': founderId },
    knowsAbout: M.knowsAbout,
    knowsLanguage: ['ko', 'en'],
    areaServed: [{ '@type': 'Country', name: 'KR' }, 'Worldwide'],
    award: M.award,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: M.serviceCatalogName,
      itemListElement: L.whatWeDo.handle.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item, provider: { '@id': orgId } },
      })),
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: lang === 'ko' ? '문의' : 'business inquiries',
      email: L.corporate.values.email,
      availableLanguage: ['ko', 'en'],
    },
  };

  const founder = {
    '@type': 'Person',
    '@id': founderId,
    name: L.corporate.values.ceo,
    alternateName: lang === 'ko' ? 'Hana Beom' : '범하나',
    jobTitle: M.founderJobTitle,
    description: M.founderDescription,
    worksFor: { '@id': orgId },
    url: pageUrl,
    sameAs: [LINKS.linkedin],
    knowsAbout: M.knowsAbout,
    knowsLanguage: ['ko', 'en'],
    hasCredential: L.founder.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
    })),
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: lang === 'ko' ? '변호사 (뉴욕주)' : 'Attorney (New York State Bar)',
      },
      {
        '@type': 'Occupation',
        name: lang === 'ko' ? '소프트웨어 엔지니어' : 'Software Engineer',
      },
    ],
  };

  const trops = {
    '@type': 'SoftwareApplication',
    '@id': tropsId,
    name: L.product.title,
    alternateName: lang === 'ko' ? 'TROPS 수출 거래 운영 서비스' : 'TROPS trade operations service',
    url: LINKS.trops,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: lang === 'ko' ? '수출 거래 운영' : 'Trade operations',
    operatingSystem: 'Web',
    description: [L.product.tagline, L.product.desc, L.product.desc2].join(' '),
    abstract: L.product.tagline,
    inLanguage: ['ko', 'en'],
    publisher: { '@id': orgId },
    author: { '@id': orgId },
    provider: { '@id': orgId },
    audience: {
      '@type': 'BusinessAudience',
      name: lang === 'ko' ? '수출 중소기업' : 'Small and mid-sized exporters',
    },
    featureList: L.product.features.map((f) => `${f.title}. ${f.desc}`),
  };

  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    url: ORIGIN,
    name: META[lang].siteName,
    description: M.description,
    publisher: { '@id': orgId },
    inLanguage: LANGS,
  };

  // The page is both a WebPage and the FAQPage that carries the Q&A pairs —
  // one node per URL keeps the graph unambiguous for validators.
  const webpage = {
    '@type': ['WebPage', 'FAQPage'],
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: M.title,
    description: M.description,
    inLanguage: lang,
    isPartOf: { '@id': siteId },
    about: { '@id': orgId },
    mentions: [{ '@id': tropsId }, { '@id': founderId }],
    primaryImageOfPage: { '@type': 'ImageObject', url: `${ORIGIN}${OG_IMAGE.path}` },
    mainEntity: L.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [organization, founder, trops, website, webpage] };
}

function buildHead(lang) {
  const M = META[lang];
  const L = locales[lang];
  // Keep the image's alt text tied to the headline the image actually shows.
  const ogImageAlt = M.ogImageAlt ?? `${META[lang].siteName}, ${L.hero.title}`;
  const pageUrl = urlFor(lang);
  const ogImage = `${ORIGIN}${OG_IMAGE.path}`;
  const other = LANGS.filter((l) => l !== lang);
  const tag = (s) => `    ${s}`;

  return [
    `<title>${esc(M.title)}</title>`,
    `<meta name="description" content="${esc(M.description)}" />`,
    // Let engines quote the page at full length and show a large preview.
    `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`,
    // Search-console ownership. Both consoles re-check the tag periodically, so
    // it has to survive every deploy, not just the first one.
    ...(VERIFICATION.google
      ? [`<meta name="google-site-verification" content="${esc(VERIFICATION.google)}" />`]
      : []),
    ...(VERIFICATION.naver
      ? [`<meta name="naver-site-verification" content="${esc(VERIFICATION.naver)}" />`]
      : []),
    `<meta name="author" content="${esc(META[lang].siteName)}" />`,
    `<link rel="canonical" href="${pageUrl}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANG)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(M.siteName)}" />`,
    `<meta property="og:title" content="${esc(M.title)}" />`,
    `<meta property="og:description" content="${esc(M.description)}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:locale" content="${M.locale}" />`,
    ...other.map((l) => `<meta property="og:locale:alternate" content="${META[l].locale}" />`),
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
    `<meta property="og:image:type" content="${OG_IMAGE.type}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(M.title)}" />`,
    `<meta name="twitter:description" content="${esc(M.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:image:alt" content="${esc(ogImageAlt)}" />`,
    `<meta name="theme-color" content="#FFFFFF" />`,
    `<script type="application/ld+json">${jsonLd(buildGraph(lang))}</script>`,
  ]
    .map(tag)
    .join('\n');
}

/**
 * llms.txt — a plain-Markdown brief for AI agents that fetch the site directly
 * (llmstxt.org convention). Generated from the same locale files as the page,
 * so the two can never drift apart.
 */
function buildLlmsTxt() {
  const L = locales[DEFAULT_LANG];
  const E = locales.en;
  const M = META.en;

  const lines = [
    '# THÉONÉ Inc. ((주)테오네)',
    '',
    `> ${M.orgDescription}`,
    '',
    '## Key facts',
    '',
    `* **Legal name:** ${E.corporate.values.name} / ${L.corporate.values.name}`,
    `* **Founded:** 2026, Seoul, Republic of Korea`,
    `* **Founder & CEO:** ${E.corporate.values.ceo} (${L.corporate.values.ceo}). Attorney admitted in New York and software engineer.`,
    `* **Business registration number (Republic of Korea):** ${E.corporate.values.regNo}`,
    `* **Address:** ${E.corporate.values.address}`,
    `* **Email:** ${E.corporate.values.email}`,
    `* **Website:** ${ORIGIN} (Korean), ${urlFor('en')} (English)`,
    `* **Product:** ${E.product.title}. ${E.product.tagline} (${LINKS.trops})`,
    `* **Recognition:** ${M.award}`,
    '',
    '## What the company does',
    '',
    `${E.whatWeDo.handle.title}: ${E.whatWeDo.handle.desc}`,
    '',
    ...E.whatWeDo.handle.items.map((i) => `* ${i}`),
    '',
    `${E.whatWeDo.build.title}: ${E.whatWeDo.build.desc}`,
    '',
    ...E.whatWeDo.build.steps.map((s) => `* **${s.badge}.** ${s.text}`),
    '',
    `## ${E.product.title}`,
    '',
    `${E.product.tagline}`,
    '',
    `${E.product.desc}`,
    '',
    `${E.product.desc2}`,
    '',
    ...E.product.features.flatMap((f) => [`**${f.title}.** ${f.desc}`, '']),
    `Product site: ${LINKS.trops}`,
    '',
    '## Founder',
    '',
    `${E.founder.name}`,
    '',
    `${E.founder.bio1}`,
    '',
    `${E.founder.bio2}`,
    '',
    'Credentials:',
    '',
    ...E.founder.credentials.map((c) => `* ${c}`),
    '',
    `LinkedIn: ${LINKS.linkedin}`,
    '',
    '## Frequently asked questions',
    '',
    ...E.faq.items.flatMap((item) => [`### ${item.q}`, '', item.a, '']),
    '## Important scope note',
    '',
    E.footer.disclaimer,
    '',
    '## Pages',
    '',
    `* [THÉONÉ Inc. (English)](${urlFor('en')})`,
    `* [(주)테오네 (한국어)](${urlFor('ko')})`,
    `* [TROPS](${LINKS.trops})`,
    '',
  ];

  return lines.join('\n');
}

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = LANGS.map((lang) => {
    const alts = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`
    ).join('\n');
    return [
      '  <url>',
      `    <loc>${urlFor(lang)}</loc>`,
      alts,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANG)}" />`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      `    <priority>${lang === DEFAULT_LANG ? '1.0' : '0.9'}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

// ---- run ----

const templatePath = path.join(dist, 'index.html');
if (!fs.existsSync(templatePath)) {
  throw new Error('dist/index.html not found — run `vite build` before prerendering.');
}
const template = fs.readFileSync(templatePath, 'utf8');

// Google owns this property through a DNS TXT record on the apex domain, so no
// google meta tag is expected and its absence is not worth warning about.
// GOOGLE_SITE_VERIFICATION stays wired up for a future URL-prefix property.
if (!VERIFICATION.naver) {
  console.warn('  ! NAVER_SITE_VERIFICATION is unset — the naver site-verification tag will be omitted.');
}

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

for (const lang of LANGS) {
  const appHtml = render(lang);

  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/[ \t]*<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/, () => buildHead(lang))
    .replace('<!--ssr-outlet-->', () => appHtml);

  if (html.includes('<!--ssr-outlet-->') || html.includes('seo-head-start')) {
    throw new Error(`prerender placeholders left unreplaced for "${lang}"`);
  }

  const outPath =
    lang === DEFAULT_LANG ? path.join(dist, 'index.html') : path.join(dist, lang, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);

  const textLen = appHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  console.log(
    `  prerendered ${pathFor(lang).padEnd(6)} -> ${path.relative(root, outPath)}  (${textLen} chars of crawlable text)`
  );
}

fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap());
console.log('  wrote dist/sitemap.xml');

fs.writeFileSync(path.join(dist, 'llms.txt'), buildLlmsTxt());
console.log('  wrote dist/llms.txt');
