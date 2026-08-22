/**
 * Renders public/og.png (1200x630) — the preview image used by ChatGPT/Gemini
 * answer cards, Google, KakaoTalk, LinkedIn and X — in headless Chrome, using
 * the site's own palette and typography.
 *
 * Run with: npm run build:og
 *
 * Two quirks of current Chrome headless drive the shape of this script:
 *   1. It writes --screenshot promptly but then never exits, so the process is
 *      polled for a stable output file and then killed.
 *   2. Anything fetched over the network may not arrive before the capture, so
 *      the serif face is inlined as a data URI and the Korean text relies on
 *      locally installed faces.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public', 'og.png');
const fontPath = path.join(root, 'scripts', 'assets', 'SourceSerif4-SemiBold-latin.woff2');

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
if (!fs.existsSync(fontPath)) {
  console.error(`Missing embedded font: ${path.relative(root, fontPath)}`);
  process.exit(1);
}

const serifDataUri = `data:font/woff2;base64,${fs.readFileSync(fontPath).toString('base64')}`;

// Wording comes from the Korean locale so the preview image can never drift
// away from the headline actually rendered on the page.
const ko = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/ko.json'), 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const headline = esc(ko.hero.title);
const legalName = esc(ko.header.legalName);
// The tagline is one sentence pair; break it at the sentence boundary.
const subLines = ko.hero.desc.split(/(?<=\.)\s+/).map(esc).join('<br />');
const productName = esc(ko.product.title);

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<style>
  @font-face {
    font-family: 'OG Serif';
    font-style: normal;
    font-weight: 600;
    src: url(${serifDataUri}) format('woff2');
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #FFFFFF;
    color: #191A1C;
    /* Pretendard when the machine has it, Apple SD Gothic Neo otherwise —
       Pretendard is metric-compatible with it, so both read the same. */
    font-family: 'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo',
                 -apple-system, 'Malgun Gothic', sans-serif;
    font-variant-numeric: tabular-nums;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .frame {
    width: 1200px; height: 630px;
    padding: 74px 80px 60px;
    display: flex; flex-direction: column;
    border-bottom: 10px solid #0F1526;
  }
  .top { display: flex; align-items: baseline; gap: 22px; }
  .wordmark {
    font-family: 'OG Serif', Georgia, serif;
    font-weight: 600; font-size: 46px;
    letter-spacing: 0.16em; line-height: 1;
  }
  .legal { font-size: 21px; color: #55565A; }
  .rule { height: 1px; background: #191A1C; margin: 28px 0 0; }
  /* Auto margins on both sides optically center the headline block between
     the rule and the pinned footer. */
  .body { margin: auto 0; }
  .headline {
    font-size: 76px; font-weight: 700;
    line-height: 1.15; letter-spacing: -0.028em;
  }
  .sub {
    margin-top: 26px;
    font-size: 28px; font-weight: 400;
    line-height: 1.5; color: #4A4B4E;
  }
  .foot {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 22px; color: #55565A;
  }
  .chip {
    border: 1px solid #C9C9C5; border-radius: 3px;
    padding: 7px 14px;
    font-size: 18px; font-weight: 700;
    letter-spacing: 0.12em;
    color: #3C3D40;
  }
</style>
</head>
<body>
  <div class="frame">
    <div class="top">
      <span class="wordmark">TH&Eacute;ON&Eacute;</span>
      <span class="legal">${legalName}</span>
    </div>
    <div class="rule"></div>
    <div class="body">
      <div class="headline">${headline}</div>
      <div class="sub">${subLines}</div>
    </div>
    <div class="foot">
      <span>theo-ne.com</span>
      <span class="chip">${productName}</span>
    </div>
  </div>
</body>
</html>
`;

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theone-og-'));
const tmpHtml = path.join(tmpDir, 'og.html');
fs.writeFileSync(tmpHtml, html);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.rmSync(outPath, { force: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    `--window-size=${1200},${630}`,
    '--virtual-time-budget=4000',
    `--user-data-dir=${path.join(tmpDir, 'profile')}`,
    `--screenshot=${outPath}`,
    `file://${tmpHtml}`,
  ],
  { stdio: 'ignore', detached: false }
);

// Chrome writes the file and then hangs, so wait for the size to settle rather
// than for the process to exit.
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
  console.error(`Chrome did not produce a screenshot within ${TIMEOUT_MS / 1000}s.`);
  process.exit(1);
}

const { size } = fs.statSync(outPath);
console.log(`  wrote ${path.relative(root, outPath)} (${(size / 1024).toFixed(1)} KB)`);
