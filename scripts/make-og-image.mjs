/**
 * Renders public/og.png and public/og-en.png (1200x630) — the preview images
 * used by ChatGPT/Gemini answer cards, Google, KakaoTalk, LinkedIn and X — in
 * headless Chrome, mirroring the hero block of the page itself.
 *
 * Run with: npm run build:og
 *
 * Wording comes from src/i18n/locales/*.json, so the preview can never drift
 * away from the headline actually rendered on the page.
 *
 * Two quirks of current Chrome headless drive the shape of this script:
 *   1. It writes --screenshot promptly but then never exits, so the process is
 *      polled for a stable output file and then killed.
 *   2. Anything fetched over the network may not arrive before the capture, so
 *      Pretendard is inlined as a data URI from the npm package rather than
 *      pulled from the CDN or relied on as a system font.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LANGS, META, OG_IMAGE, ogImagePathFor } from './site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PRETENDARD_DIR = path.join(root, 'node_modules/pretendard/dist/web/static/woff2');
const FACES = [
  { weight: 400, file: 'Pretendard-Regular.woff2' },
  { weight: 600, file: 'Pretendard-SemiBold.woff2' },
];

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('No Chrome/Chromium binary found. Checked:\n  ' + CHROME_CANDIDATES.join('\n  '));
  process.exit(1);
}

for (const { file } of FACES) {
  const p = path.join(PRETENDARD_DIR, file);
  if (!fs.existsSync(p)) {
    console.error(`Missing font: ${path.relative(root, p)}\nRun \`npm install\` to restore the pretendard package.`);
    process.exit(1);
  }
}

const fontFaces = FACES.map(({ weight, file }) => {
  const b64 = fs.readFileSync(path.join(PRETENDARD_DIR, file)).toString('base64');
  return `@font-face{font-family:'OG Pretendard';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
}).join('\n');

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Palette is the mockup's: white paper, --ink, --muted, --rule. No plate colour,
// no bottom bar.
function pageHtml(lang) {
  const L = readJson(`src/i18n/locales/${lang}.json`);
  const M = META[lang];
  const lede = L.hero.lede.map(esc).join('<br />');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<style>
${fontFaces}
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${OG_IMAGE.width}px; height: ${OG_IMAGE.height}px; }
  body {
    background: #FFFFFF;
    color: #1C2024;
    font-family: 'OG Pretendard', sans-serif;
    word-break: keep-all;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .frame {
    width: ${OG_IMAGE.width}px; height: ${OG_IMAGE.height}px;
    padding: 74px 80px 60px;
    display: flex; flex-direction: column;
  }
  .wordmark { font-weight: 600; font-size: 30px; letter-spacing: 0.16em; line-height: 1; }
  .rule { height: 1px; background: #E3E6E4; margin: 28px 0 0; }
  /* Auto margins on both sides optically centre the hero block between the
     rule and the pinned footer. */
  .body { margin: auto 0; }
  .headline { font-size: 76px; font-weight: 600; line-height: 1.15; letter-spacing: -0.02em; }
  .alt {
    margin-top: 14px;
    font-size: 22px; font-weight: 400;
    letter-spacing: 0.14em; color: #6A7177;
  }
  .lede { margin-top: 34px; font-size: 30px; font-weight: 400; line-height: 1.6; }
  .foot { font-size: 22px; color: #6A7177; }
</style>
</head>
<body>
  <div class="frame">
    <div class="wordmark">TH&Eacute;ON&Eacute;</div>
    <div class="rule"></div>
    <div class="body">
      <div class="headline">${esc(L.hero.name)}</div>
      <div class="alt">${esc(L.hero.nameAlt)}</div>
      <div class="lede">${lede}</div>
    </div>
    <div class="foot">theo-ne.com${lang === 'en' ? '/en/' : ''}</div>
  </div>
</body>
</html>
`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(lang) {
  const outPath = path.join(root, 'public', ogImagePathFor(lang).replace(/^\//, ''));
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theone-og-'));
  const tmpHtml = path.join(tmpDir, 'og.html');
  fs.writeFileSync(tmpHtml, pageHtml(lang));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.rmSync(outPath, { force: true });

  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--force-device-scale-factor=1',
      `--window-size=${OG_IMAGE.width},${OG_IMAGE.height}`,
      '--virtual-time-budget=4000',
      `--user-data-dir=${path.join(tmpDir, 'profile')}`,
      `--screenshot=${outPath}`,
      `file://${tmpHtml}`,
    ],
    { stdio: 'ignore', detached: false }
  );

  // Chrome writes the file and then hangs, so wait for the size to settle
  // rather than for the process to exit.
  let lastSize = -1;
  let stableFor = 0;
  let waited = 0;
  const TIMEOUT_MS = 45000;

  while (waited < TIMEOUT_MS) {
    await sleep(400);
    waited += 400;
    const size = fs.existsSync(outPath) ? fs.statSync(outPath).size : -1;
    if (size > 0 && size === lastSize) {
      stableFor += 400;
      if (stableFor >= 1200) break;
    } else {
      stableFor = 0;
    }
    lastSize = size;
  }

  child.kill('SIGKILL');
  fs.rmSync(tmpDir, { recursive: true, force: true });

  if (!fs.existsSync(outPath) || fs.statSync(outPath).size === 0) {
    console.error(`Chrome did not produce a screenshot for "${lang}" within ${TIMEOUT_MS / 1000}s.`);
    process.exit(1);
  }

  const { size } = fs.statSync(outPath);
  console.log(`  wrote ${path.relative(root, outPath)} (${(size / 1024).toFixed(1)} KB)`);
}

for (const lang of LANGS) await shoot(lang);
