/**
 * 由 data.js 產生每個語系的名片圖(1188×726 @2x → 2376×1452 PNG)
 * 版型完全比照原始 FUNTEK 名片(座標與灰階皆為實測值)。
 *
 * 用法:node tools/build-cards.mjs [語系...]        例:node tools/build-cards.mjs ja ko
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, LANGS, I18N, pick } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = resolve(root, '.card-build');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const dataUri = (p) => {
  const abs = resolve(root, p);
  return `data:${MIME[extname(abs).toLowerCase()] || 'image/png'};base64,${readFileSync(abs).toString('base64')}`;
};

const escHtml = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function template(card, lang) {
  const L = pick(card, lang);
  const t = I18N[lang].t;
  const b = card.brand;
  const vatLine = card.vat ? `<br>${escHtml(`${t.vatLabel} ${card.vat}`)}` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1188px; height:726px; }
  body {
    background:#fff; position:relative; overflow:hidden;
    font-family:"Helvetica Neue","PingFang TC","Hiragino Sans","Apple SD Gothic Neo","Noto Sans TC",sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .dash {
    position:absolute; top:0; left:0; right:0; height:3px;
    background:repeating-linear-gradient(to right, ${b.dash} 0 9px, transparent 9px 18px);
  }
  .name  { position:absolute; left:74px; top:78px;  font-size:44px; font-weight:700; color:#000; letter-spacing:.2px; line-height:1; }
  .title { position:absolute; left:74px; top:142px; font-size:33px; font-weight:400; color:#808080; line-height:1; }
  .logo  { position:absolute; right:88px; top:78px; width:${b.logoWidth}px; }
  .contact { position:absolute; left:75px; top:350px; font-size:32px; color:#808080; line-height:1.42; }
  .org     { position:absolute; left:75px; top:520px; font-size:33px; color:#808080; line-height:1.53; }
</style></head><body>
  <div class="dash"></div>
  <div class="name">${escHtml(L.name)}</div>
  <div class="title">${escHtml(L.role)}</div>
  <img class="logo" src="${dataUri(b.logo)}" alt="">
  <div class="contact">${escHtml(card.email)}<br>${escHtml(card.website)}</div>
  <div class="org">${escHtml(L.company)}<br>${escHtml(L.address)}${vatLine}</div>
</body></html>`;
}

const only = process.argv.slice(2);
const langs = only.length ? only : LANGS;

mkdirSync(tmp, { recursive: true });
let n = 0;
for (const card of CARDS) {
  if (!card.brand) { console.log('–', card.id, '(使用現成圖檔,略過)'); continue; }
  for (const lang of langs) {
    if (!card.l10n[lang]) continue;
    const html = resolve(tmp, `${card.id}-${lang}.html`);
    const out = resolve(root, pick(card, lang).image);
    writeFileSync(html, template(card, lang), 'utf8');
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      `--screenshot=${out}`, '--window-size=1188,726', '--force-device-scale-factor=2',
      `file://${html}`,
    ], { stdio: 'ignore' });
    console.log('✓', pick(card, lang).image);
    n++;
  }
}
rmSync(tmp, { recursive: true, force: true });
console.log(`\n${n} 張名片圖產生完成`);
