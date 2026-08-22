/**
 * Renders ai-search-report.json into a shareable PNG.
 *
 * Usage: node scripts/ai-search-audit.mjs https://theo-ne.com
 *        node scripts/make-audit-report-image.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(root, 'ai-search-report.json');
const outPath = path.join(root, 'ai-search-report.png');
const fontPath = path.join(root, 'scripts', 'assets', 'SourceSerif4-SemiBold-latin.woff2');

if (!fs.existsSync(reportPath)) {
  console.error('Run scripts/ai-search-audit.mjs first to produce ai-search-report.json');
  process.exit(1);
}
const R = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const serif = `data:font/woff2;base64,${fs.readFileSync(fontPath).toString('base64')}`;

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('No Chrome binary found.'); process.exit(1); }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pct = Math.round((R.earned / R.total) * 100);

const mark = (c) =>
  c.earned >= c.weight * 0.999
    ? '<span class="m pass">PASS</span>'
    : c.earned > 0
      ? '<span class="m part">PART</span>'
      : '<span class="m fail">FAIL</span>';

// Row pairing: put similarly sized cards side by side so no row is mostly
// empty. Falls back to report order for any category not listed.
const ORDER = ['Crawlability', 'Access', 'Structured data', 'Snippet', 'Answerability', 'Discovery'];
const ordered = [...R.cats].sort((a, b) => {
  const i = ORDER.findIndex((k) => a.name.includes(k));
  const j = ORDER.findIndex((k) => b.name.includes(k));
  return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
});

const cards = ordered.map((c) => `
  <section class="card">
    <div class="chead">
      <h3>${esc(c.name)}</h3>
      <div class="cscore">${c.earned}<span class="of">/${c.total}</span></div>
    </div>
    <div class="track"><div class="fill" style="width:${(c.earned / c.total) * 100}%"></div></div>
    <ul>
      ${c.checks.map((k) => `
        <li>
          ${mark(k)}
          <div class="ctext">
            <div class="clabel">${esc(k.label)}</div>
            ${k.detail ? `<div class="cdetail">${esc(k.detail)}</div>` : ''}
          </div>
          <div class="cpts">${k.earned}/${k.weight}</div>
        </li>`).join('')}
    </ul>
  </section>`).join('');

const html = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><style>
  @font-face { font-family:'RSerif'; font-weight:600; src:url(${serif}) format('woff2'); }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1440px}
  body{
    background:#FFFFFF;color:#191A1C;
    font-family:'Pretendard Variable','Pretendard','Apple SD Gothic Neo',-apple-system,sans-serif;
    font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;
    word-break:keep-all;
  }
  .page{padding:52px 56px 44px}
  header{display:flex;justify-content:space-between;align-items:flex-start;
    border-bottom:1px solid #191A1C;padding-bottom:26px}
  .brand{font-family:'RSerif',Georgia,serif;font-weight:600;font-size:27px;letter-spacing:.16em}
  h1{font-size:31px;font-weight:700;letter-spacing:-.02em;margin-top:13px}
  .sub{font-size:16px;color:#55565A;margin-top:9px;line-height:1.55}
  .sub b{color:#191A1C;font-weight:600}
  .scorebox{text-align:right;flex:none;padding-left:40px}
  .score{font-size:82px;font-weight:700;line-height:.92;letter-spacing:-.04em}
  .score .tot{font-size:31px;color:#8A8B8E;font-weight:600;letter-spacing:-.02em}
  .verdict{display:inline-block;margin-top:13px;background:#0F1526;color:#fff;
    padding:8px 17px;border-radius:3px;font-size:15px;font-weight:700;letter-spacing:.07em}
  .gate{font-size:14px;color:#55565A;margin-top:9px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 22px;margin-top:26px;align-items:start}
  .card{border:1px solid #DDDDD9;border-radius:4px;padding:19px 21px 15px}
  .chead{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
  .chead h3{font-size:16.5px;font-weight:700;letter-spacing:-.01em}
  .cscore{font-size:21px;font-weight:700;flex:none}
  .cscore .of{font-size:14px;color:#8A8B8E;font-weight:600}
  .track{height:4px;background:#E7E7E4;border-radius:2px;margin:11px 0 13px;overflow:hidden}
  .fill{height:100%;background:#0F1526}
  ul{list-style:none;display:flex;flex-direction:column}
  li{display:flex;gap:11px;align-items:flex-start;padding:7px 0;border-top:1px solid #F0F0EE}
  li:first-child{border-top:0}
  .m{flex:none;font-size:10.5px;font-weight:700;letter-spacing:.08em;
    padding:3px 7px;border-radius:2px;margin-top:1px;min-width:44px;text-align:center}
  .pass{background:#0F1526;color:#fff}
  .part{background:#E7E7E4;color:#3C3D40}
  .fail{background:#8A2222;color:#fff}
  .ctext{flex:1;min-width:0}
  .clabel{font-size:13.5px;line-height:1.42;font-weight:500}
  .cdetail{font-size:12px;color:#55565A;margin-top:3px;line-height:1.45;word-break:break-word}
  .cpts{flex:none;font-size:12px;color:#8A8B8E;font-weight:600;margin-top:2px}
  .delta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:24px;
    border-top:1px solid #191A1C;padding-top:22px}
  .dcell .dlabel{font-size:12.5px;font-weight:700;letter-spacing:.13em;color:#55565A}
  .dcell .drow{display:flex;align-items:baseline;gap:11px;margin-top:11px}
  .was{font-size:25px;font-weight:700;color:#ADAEAA;text-decoration:line-through}
  .arrow{font-size:16px;color:#8A8B8E}
  .now{font-size:33px;font-weight:700;letter-spacing:-.025em}
  .dnote{font-size:12.5px;color:#55565A;margin-top:6px;line-height:1.5}
  footer{margin-top:24px;border-top:1px solid #DDDDD9;padding-top:17px;
    display:flex;justify-content:space-between;gap:34px;align-items:flex-start}
  .notes{font-size:12.5px;color:#55565A;line-height:1.65;max-width:1000px}
  .notes b{color:#191A1C;font-weight:600}
  .stamp{font-size:12px;color:#8A8B8E;text-align:right;flex:none;line-height:1.6}
</style></head><body><div class="page">

<header>
  <div>
    <div class="brand">TH&Eacute;ON&Eacute;</div>
    <h1>AI 검색 노출 준비도 감사</h1>
    <div class="sub">
      대상 <b>${esc(R.base)}</b> · 프로덕션 배포 후 실측<br>
      GPTBot · OAI-SearchBot · ClaudeBot · PerplexityBot · Google-Extended · Bingbot 실제 요청 검증
    </div>
  </div>
  <div class="scorebox">
    <div class="score">${R.earned}<span class="tot">/${R.total}</span></div>
    <div class="verdict">${pct >= 90 ? 'PASS' : 'BELOW GATE'}</div>
    <div class="gate">기준 90점 ${pct >= 90 ? '통과' : '미달'} · 배포 완료</div>
  </div>
</header>

<div class="grid">${cards}</div>

<div class="delta">
  <div class="dcell">
    <div class="dlabel">한국어 페이지 크롤 가능 텍스트</div>
    <div class="drow"><span class="was">0자</span><span class="arrow">&rarr;</span><span class="now">2,128자</span></div>
    <div class="dnote">이전에는 크롤러가 빈 &lt;div id="root"&gt;만 받았습니다.</div>
  </div>
  <div class="dcell">
    <div class="dlabel">영문 페이지</div>
    <div class="drow"><span class="was">없음</span><span class="arrow">&rarr;</span><span class="now">4,384자</span></div>
    <div class="dnote">/en/ 독립 URL 신설. 색인 가능한 페이지 0개에서 2개로.</div>
  </div>
  <div class="dcell">
    <div class="dlabel">한글 단어 중간 줄바꿈</div>
    <div class="drow"><span class="was">6건</span><span class="arrow">&rarr;</span><span class="now">0건</span></div>
    <div class="dnote">"서울"이 "서 / 울"로 쪼개지던 현상 해소. 브라우저 실측.</div>
  </div>
</div>

<footer>
  <div class="notes">
    <b>이 점수가 측정하는 것</b> · AI 답변 엔진이 이 사이트를 가져가서 읽고, 이해하고, 인용할 수 있는지에 대한 기술적 조건입니다.
    위 항목은 모두 프로덕션 URL에 실제 요청을 보내 확인했습니다.<br>
    <b>이 점수가 측정하지 않는 것</b> · ChatGPT, Gemini, Grok, Claude가 지금 실제로 인용하고 있는지는 각 엔진의 크롤·색인 주기에 달려 있어
    배포 직후에 측정할 수 없습니다. 통상 수일에서 수 주가 걸립니다. 현재 외부 검색 색인에는 이 도메인이 아직 없습니다(신규 배포).<br>
    <b>다음 단계</b> · Google Search Console과 Bing Webmaster Tools에 사이트맵 제출, 그리고 LinkedIn·Crunchbase·Wikidata 등
    외부 출처 확보. AI 엔진은 이미 신뢰하는 출처와 교차 확인될 때 인용 확률이 크게 올라갑니다.
  </div>
  <div class="stamp">
    ${esc(R.generatedAt)}<br>
    scripts/ai&#8209;search&#8209;audit.mjs<br>
    커밋 81cb690
  </div>
</footer>

</div></body></html>
<script>
  // Reported back through the title so the measuring pass can read it via --dump-dom.
  document.title = 'H:' + Math.ceil(document.body.getBoundingClientRect().height);
</script>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'theone-report-'));
const tmpHtml = path.join(tmp, 'r.html');
fs.writeFileSync(tmpHtml, html);
fs.rmSync(outPath, { force: true });

// Measure the laid-out height first so nothing is cropped, then capture at it.
const measure = spawn(CHROME, ['--headless=new','--disable-gpu','--no-first-run',
  '--window-size=1440,3000', `--user-data-dir=${path.join(tmp,'p1')}`,
  '--virtual-time-budget=5000', '--dump-dom', `file://${tmpHtml}`], { stdio:['ignore','pipe','ignore'] });
let dom = '';
measure.stdout.on('data', (d) => (dom += d));
await new Promise((r) => { measure.on('exit', r); setTimeout(() => { measure.kill('SIGKILL'); r(); }, 25000); });

const measured = Number((dom.match(/<title>H:(\d+)<\/title>/) || [])[1]);
if (!measured) {
  console.error('Could not measure page height from the DOM dump.');
  process.exit(1);
}
const height = measured;
console.log(`  measured content height: ${height}px`);

const child = spawn(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run',
  '--force-device-scale-factor=2', `--window-size=1440,${height}`,
  '--virtual-time-budget=5000', `--user-data-dir=${path.join(tmp,'p2')}`,
  `--screenshot=${outPath}`, `file://${tmpHtml}`], { stdio:'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = -1, stable = 0, waited = 0;
while (waited < 60000) {
  await sleep(400); waited += 400;
  const sz = fs.existsSync(outPath) ? fs.statSync(outPath).size : -1;
  if (sz > 0 && sz === last) { stable += 400; if (stable >= 1600) break; } else stable = 0;
  last = sz;
}
child.kill('SIGKILL');
fs.rmSync(tmp, { recursive: true, force: true });

if (!fs.existsSync(outPath)) { console.error('screenshot failed'); process.exit(1); }
const buf = fs.readFileSync(outPath);
console.log(`  wrote ${path.relative(root, outPath)} (${(buf.length/1024).toFixed(1)} KB, ${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)})`);
