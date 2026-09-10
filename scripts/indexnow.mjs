/**
 * Tells IndexNow-participating engines that the site changed.
 *
 * Bing and Naver both participate, so a single POST reaches both — worth having
 * because Naver's own crawl schedule is slow. Google does not participate and
 * still discovers changes through Search Console and the sitemap.
 *
 * Deliberately NOT part of `npm run build`. A build runs before the deployment
 * is promoted, so pinging there would invite crawlers to fetch the old page.
 * This runs against the live site instead, and refuses to ping until the live
 * site actually serves what it is about to announce.
 *
 * Usage: npm run indexnow            (pings the production origin)
 *        node scripts/indexnow.mjs https://theo-ne.com
 */
import { ORIGIN, LANGS, INDEXNOW_KEY, urlFor } from './site.mjs';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const base = (process.argv[2] || ORIGIN).replace(/\/$/, '');
const host = new URL(base).host;
const keyLocation = `${base}/${INDEXNOW_KEY}.txt`;
const urlList = LANGS.map((lang) => urlFor(lang).replace(ORIGIN, base));

const fail = (msg) => {
  console.error(`  x ${msg}`);
  process.exit(1);
};

// The engines fetch the key file to prove the submitter controls the host. If
// it is not live, the ping is rejected — check it here so the failure is legible.
const keyRes = await fetch(keyLocation).catch((e) => fail(`cannot reach ${keyLocation}: ${e.message}`));
if (!keyRes.ok) fail(`${keyLocation} returned HTTP ${keyRes.status} — deploy the key file first.`);
const served = (await keyRes.text()).trim();
if (served !== INDEXNOW_KEY) fail(`${keyLocation} serves "${served}", expected "${INDEXNOW_KEY}".`);
console.log(`  key file OK  ${keyLocation}`);

for (const url of urlList) {
  const res = await fetch(url).catch((e) => fail(`cannot reach ${url}: ${e.message}`));
  if (!res.ok) fail(`${url} returned HTTP ${res.status} — not announcing a page that is not live.`);
  console.log(`  live OK      ${url}`);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation, urlList }),
});

// 200 accepted, 202 accepted but the key is still being validated.
if (res.status !== 200 && res.status !== 202) {
  fail(`IndexNow returned HTTP ${res.status} ${res.statusText}\n${(await res.text()).slice(0, 500)}`);
}
console.log(`  submitted ${urlList.length} URLs to IndexNow (HTTP ${res.status}) -> Bing, Naver`);
