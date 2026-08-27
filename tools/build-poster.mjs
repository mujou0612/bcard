/**
 * 產生直式掃描圖(手機全螢幕展示用,讓對方掃 QR Code)
 *
 * 需求:pip3 install --user segno
 * 用法:node tools/build-poster.mjs [寬 高]      預設 1179×2556(iPhone 15/16 Pro 系列)
 *       node tools/build-poster.mjs 1080 1920
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, pick } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = resolve(root, '.poster-build');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SITE = 'https://mujou0612.github.io/bcard/';

const W = Number(process.argv[2]) || 1179;
const H = Number(process.argv[3]) || 2556;

/** 每張海報的品牌設定 */
const POSTERS = [
  {
    cardId: 'funtek',
    out: `assets/poster-funtek.png`,
    logo: 'tools/logos/funtek-alpha.png',
    logoWidth: 0.40,        // 佔畫布寬度的比例
    qrDark: '#24506E',      // 深一階的品牌色,對比足夠,掃描不會有問題
    glow: '#5694B5',
    accent: '#8FC6E4',
  },
  {
    cardId: 'pinchat',
    out: `assets/poster-pinchat.png`,
    logo: 'tools/logos/pinchat-white.png',
    logoWidth: 0.42,
    qrDark: '#026B26',
    glow: '#02B13F',
    accent: '#35D46E',
  },
];

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const dataUri = (p) => {
  const abs = resolve(root, p);
  return `data:${MIME[extname(abs).toLowerCase()] || 'image/png'};base64,${readFileSync(abs).toString('base64')}`;
};

/** 用 segno 產生 QR(錯誤修正等級 H,螢幕上被反光/遮到一角也還掃得到) */
function qrSvg(url, dark) {
  const py = `
import segno, sys
q = segno.make(${JSON.stringify(url)}, error='h')
m = [list(row) for row in q.matrix]
n = len(m)
d = ''.join('M%d %dh1v1h-1z' % (c, r) for r, row in enumerate(m) for c, v in enumerate(row) if v)
sys.stdout.write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">'
    '<path fill="%s" d="%s"/></svg>' % (n, n, ${JSON.stringify(dark)}, d)
)
`;
  return execFileSync('python3', ['-c', py], { encoding: 'utf8' }).trim();
}

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function template(p) {
  const card = CARDS.find((c) => c.id === p.cardId);
  const zh = pick(card, 'zh-Hant');
  const en = pick(card, 'en');
  const url = `${SITE}?card=${card.id}`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body {
    position:relative; overflow:hidden;
    background:#09131f linear-gradient(180deg,#133045 0%,#0d1d2e 44%,#09131f 100%);
    color:#EAF1F8;
    font-family:"Helvetica Neue","PingFang TC","Noto Sans TC",sans-serif;
    -webkit-font-smoothing:antialiased;
    display:flex; flex-direction:column; align-items:center;
    padding:${Math.round(H * 0.062)}px ${Math.round(W * 0.085)}px ${Math.round(H * 0.05)}px;
  }
  .glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(105% 46% at 50% -4%, ${p.glow} 0%, transparent 66%);
    opacity:.34;
  }
  .in { position:relative; z-index:1; width:100%; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .logo { width:${Math.round(W * p.logoWidth)}px; display:block; }
  .name { margin-top:${Math.round(H * 0.032)}px; font-size:${Math.round(W * 0.082)}px; font-weight:700; letter-spacing:-.02em; }
  .role { margin-top:${Math.round(H * 0.008)}px; font-size:${Math.round(W * 0.036)}px; font-weight:500; color:${p.accent}; }
  .role .en { color:#8FA3B8; }
  .role .sep { opacity:.45; margin:0 .38em; }

  .qrcard {
    margin-top:${Math.round(H * 0.042)}px;
    width:${Math.round(W * 0.80)}px; height:${Math.round(W * 0.80)}px;
    background:#fff; border-radius:${Math.round(W * 0.055)}px;
    padding:${Math.round(W * 0.070)}px;
    box-shadow:0 ${Math.round(H*0.012)}px ${Math.round(H*0.03)}px -${Math.round(H*0.01)}px rgba(0,0,0,.65);
    display:grid; place-items:center;
  }
  .qrcard svg { width:100%; height:100%; display:block; shape-rendering:crispEdges; }

  .cta { margin-top:${Math.round(H * 0.034)}px; text-align:center; }
  .cta b { display:block; font-size:${Math.round(W * 0.045)}px; font-weight:600; letter-spacing:.01em; }
  .cta span { display:block; margin-top:${Math.round(H * 0.005)}px; font-size:${Math.round(W * 0.031)}px; color:#8FA3B8; }

  .meta { margin-top:${Math.round(H * 0.058)}px; text-align:center; font-size:${Math.round(W * 0.031)}px; line-height:1.72; color:#8FA3B8; }
  .meta .hi { color:#C7D5E2; }
</style></head><body>
  <div class="glow"></div>
  <div class="in">
    <img class="logo" src="${dataUri(p.logo)}" alt="">
    <div class="name">${esc(zh.name)}</div>
    <div class="role">${esc(zh.role)}<span class="sep">·</span><span class="en">${esc(en.role)}</span></div>

    <div class="qrcard">${qrSvg(url, p.qrDark)}</div>

    <div class="cta">
      <b>掃描存入我的名片</b>
      <span>Scan to save my contact</span>
    </div>

    <div class="meta">
      <div class="hi">${esc(en.company)}</div>
      <div>${esc(card.email)}</div>
      <div>${esc(card.phone)}</div>
      <div>${esc(card.websiteLabel)}</div>
    </div>
  </div>
</body></html>`;
}

mkdirSync(tmp, { recursive: true });
for (const p of POSTERS) {
  const html = resolve(tmp, `${p.cardId}.html`);
  const out = resolve(root, p.out);
  writeFileSync(html, template(p), 'utf8');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--screenshot=${out}`, `--window-size=${W},${H}`, '--force-device-scale-factor=1',
    `file://${html}`,
  ], { stdio: 'ignore' });
  console.log('✓', p.out, `${W}×${H}`);
}
rmSync(tmp, { recursive: true, force: true });
