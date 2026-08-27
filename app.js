/* ------------------------------------------------------------------
 * app.js — 名片 landing page 邏輯
 * 資料與文案都在 data.js,這裡只處理行為。
 * ------------------------------------------------------------------ */
import { CARDS, I18N, LANGS, FALLBACK_LANG, pick, vcfPath, buildVCard } from './data.js';

/* ---------- 語系 ---------- */

const LANG_SHORT = { 'zh-Hant': '繁中', 'zh-Hans': '简中', en: 'EN', ja: '日本語', ko: '한국어' };
const STORE_KEY = 'bcard.lang';

function normalize(tag) {
  const l = String(tag || '').toLowerCase();
  if (!l) return null;
  if (l.startsWith('zh')) {
    if (/hant|-tw|-hk|-mo/.test(l)) return 'zh-Hant';
    if (/hans|-cn|-sg|-my/.test(l)) return 'zh-Hans';
    return 'zh-Hant'; // 裸 zh → 預設繁中
  }
  if (l.startsWith('ja')) return 'ja';
  if (l.startsWith('ko')) return 'ko';
  if (l.startsWith('en')) return 'en';
  return null;
}

function detectLang() {
  const forced = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (_) { /* 私密瀏覽 */ }
  const chain = [forced, saved, ...(navigator.languages || [navigator.language])];
  for (const tag of chain) {
    const hit = normalize(tag);
    if (hit && I18N[hit]) return hit;
  }
  return FALLBACK_LANG;
}

let lang = detectLang();
let t = I18N[lang].t;

/* ---------- 平台 ---------- */

const UA = navigator.userAgent || '';
const IS_IOS = /iP(hone|ad|od)/.test(UA) ||
  (/Mac/.test(UA) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- DOM ---------- */

const $ = (id) => document.getElementById(id);
const cardsEl = $('cards');
const dotsEl = $('dots');
const infoEl = $('info');
const nameEl = $('cName');
const roleEl = $('cRole');
const contactsEl = $('contacts');
const footEl = $('foot');
const btnContact = $('btnContact');
const btnDownload = $('btnDownload');
const btnChat = $('btnChat');
const btnSocial = $('btnSocial');
const prevBtn = $('prevBtn');
const nextBtn = $('nextBtn');
const glowEl = document.querySelector('.glow');
const sheet = $('sheet');
const scrim = $('scrim');
const sheetTitle = $('sheetTitle');
const sheetBody = $('sheetBody');
const sheetClose = $('sheetClose');
const lightbox = $('lightbox');
const lbImg = $('lbImg');
const lbClose = $('lbClose');
const toastEl = $('toast');
const langBtn = $('langBtn');
const langBtnLabel = $('langBtnLabel');

let index = 0;
let slides = [];

/** ?card=pinchat 或 ?card=1 → 指定一開始顯示哪一張(不同 QR code 可指向不同名片) */
function initialIndex() {
  const q = new URLSearchParams(location.search).get('card');
  if (!q) return 0;
  const byId = CARDS.findIndex((c) => c.id === q.toLowerCase());
  if (byId >= 0) return byId;
  const n = parseInt(q, 10);
  return Number.isInteger(n) && n >= 0 && n < CARDS.length ? n : 0;
}

/* ---------- 小工具 ---------- */

let toastTimer;
function toast(msg) {
  if (!msg) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

function icon(name, cls = 'ico') {
  return `<svg class="${cls}" aria-hidden="true"><use href="#${name}"></use></svg>`;
}

function socialIcon(type) {
  const map = { linkedin: 'i-linkedin', instagram: 'i-instagram' };
  return map[type] || 'i-link';
}

function cardAlt(card) {
  return `${card.displayName} — ${pick(card, lang).company}`;
}

function downloadName(card) {
  const ext = pick(card, lang).image.split('.').pop();
  const id = card.id.charAt(0).toUpperCase() + card.id.slice(1);
  return `MuJou-${id}-${lang}.${ext}`;
}

/** 用一個暫時的 <a> 觸發導覽/下載,避免被彈窗阻擋 */
function clickAnchor(attrs) {
  const a = document.createElement('a');
  Object.entries(attrs).forEach(([k, v]) => { if (v != null) a.setAttribute(k, v); });
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ---------- 建立輪播 ---------- */

function buildSlides() {
  cardsEl.innerHTML = CARDS.map((c, i) => `
    <div class="slide" data-i="${i}" role="group" aria-roledescription="slide"
         aria-label="${i + 1} / ${CARDS.length}">
      <div class="persp"><div class="tilt"><div class="floaty">
        <figure class="card-frame">
          <img src="${pick(c, lang).image}" alt="${cardAlt(c)}"
               ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
          <button class="zoom-btn" type="button" tabindex="-1"
                  data-i18n-aria="zoomAria" aria-label="Enlarge">${icon('i-expand')}</button>
        </figure>
      </div></div></div>
    </div>`).join('');
  slides = [...cardsEl.querySelectorAll('.slide')];

  dotsEl.innerHTML = CARDS.map((c, i) =>
    `<button class="dot" type="button" role="tab" data-i="${i}"
             aria-label="${pick(c, lang).company}"></button>`
  ).join('');
  dotsEl.querySelectorAll('.dot').forEach((d) =>
    d.addEventListener('click', () => goTo(+d.dataset.i))
  );
}

/** 語系改變時換掉名片圖 */
function syncCardImages() {
  slides.forEach((s, i) => {
    const img = s.querySelector('img');
    const src = pick(CARDS[i], lang).image;
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    img.alt = cardAlt(CARDS[i]);
  });
  dotsEl.querySelectorAll('.dot').forEach((d, i) =>
    d.setAttribute('aria-label', pick(CARDS[i], lang).company)
  );
  slides.forEach((s, i) => {
    s.querySelector('.zoom-btn').tabIndex = i === index ? 0 : -1;
  });
}

function goTo(i) {
  const n = Math.max(0, Math.min(CARDS.length - 1, i));
  const s = slides[n];
  if (!s) return;
  const left = s.offsetLeft - (cardsEl.clientWidth - s.offsetWidth) / 2;
  cardsEl.scrollTo({ left, behavior: REDUCED ? 'auto' : 'smooth' });
}

function nearestIndex() {
  const center = cardsEl.scrollLeft + cardsEl.clientWidth / 2;
  let best = 0, bestD = Infinity;
  slides.forEach((s, i) => {
    const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

/* ---------- 主題 + 資訊 ---------- */

function applyTheme(card) {
  const root = document.documentElement;
  root.style.setProperty('--accent', card.accent);
  root.style.setProperty('--accent-text', card.accentText);
  glowEl.style.color = card.accent;
}

function renderInfo(card) {
  const L = pick(card, lang);

  nameEl.textContent = card.displayName;
  // 分隔點黏在職稱後面,換行時才不會出現孤立的「·」開頭
  roleEl.innerHTML =
    `<span>${L.role}<span class="sep" aria-hidden="true">·</span></span> ` +
    `<span class="org">${L.company}</span>`;

  const rows = [
    { ico: 'i-mail', label: t.emailLabel, text: card.email, href: `mailto:${card.email}`, copy: card.email },
    { ico: 'i-phone', label: t.phoneLabel, text: card.phone, href: `tel:${card.phoneRaw}`, copy: card.phoneRaw },
    { ico: 'i-globe', label: t.webLabel, text: card.websiteLabel, href: card.website, copy: card.website, ext: true },
  ];
  if (L.address) {
    rows.push({
      ico: 'i-pin', label: t.addressLabel, text: L.address, copy: L.address, wrap: true, ext: true,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(L.address)}`,
    });
  }
  if (card.vat) {
    rows.push({ ico: 'i-id', label: t.vatLabel, text: `${t.vatLabel} ${card.vat}`, copy: card.vat });
  }

  contactsEl.innerHTML = rows.map((r) => {
    const body = r.href
      ? `<a href="${r.href}" ${r.ext ? 'target="_blank" rel="noopener"' : ''}
            aria-label="${r.label}: ${r.text}">${r.text}</a>`
      : `<span class="txt">${r.text}</span>`;
    return `<li class="crow${r.wrap ? ' crow-wrap' : ''}">
      ${icon(r.ico)}${body}
      <button class="icon-btn copy" type="button" data-copy="${r.copy}"
              aria-label="${t.copy} ${r.label}">${icon('i-copy')}</button>
    </li>`;
  }).join('');

  contactsEl.querySelectorAll('.copy').forEach((b) => {
    b.addEventListener('click', () => copyText(b.dataset.copy, b));
  });

  // 動作按鈕
  btnContact.setAttribute('href', vcfPath(card, lang));
  btnChat.setAttribute('href', card.chatUrl);
  btnSocial.hidden = !(card.social && card.social.length);
  footEl.textContent = IS_IOS ? t.iosHint : t.androidHint;

  dotsEl.querySelectorAll('.dot').forEach((d, i) => {
    const on = i === index;
    d.classList.toggle('is-active', on);
    d.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === CARDS.length - 1;
}

let swapTimer;
function setIndex(i, { animate = true } = {}) {
  const changed = i !== index;
  index = i;
  clearTimeout(swapTimer);
  const card = CARDS[index];
  applyTheme(card);
  slides.forEach((s, n) => {
    s.classList.toggle('is-active', n === index);
    s.querySelector('.zoom-btn').tabIndex = n === index ? 0 : -1;
  });
  dotsEl.querySelectorAll('.dot').forEach((d, n) => d.classList.toggle('is-active', n === index));

  if (changed && animate && !REDUCED) {
    infoEl.classList.add('swapping');
    swapTimer = setTimeout(() => {
      renderInfo(CARDS[index]);
      infoEl.classList.remove('swapping');
    }, 180);
  } else {
    renderInfo(card);
  }
}

/* ---------- 複製 ---------- */

async function copyText(text, btn) {
  const ok = await (async () => {
    try {
      if (navigator.clipboard && isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* 往下走 fallback */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      const done = document.execCommand('copy');
      ta.remove();
      return done;
    } catch (_) { return false; }
  })();

  if (ok) {
    toast(t.copied);
    if (btn) {
      btn.classList.add('done');
      btn.innerHTML = icon('i-check');
      setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = icon('i-copy'); }, 1600);
    }
  } else {
    toast(t.copyFailed);
  }
}

/* ---------- 動作 ---------- */

function addToContact(e) {
  const card = CARDS[index];
  // iOS:直接導覽到 .vcf,Safari 會跳出「加入聯絡人」預覽,體驗最好
  if (IS_IOS) { toast(t.savingContact); return; }
  // 其他平台:用 Blob 觸發下載,不依賴伺服器的 Content-Type
  e.preventDefault();
  try {
    const blob = new Blob([buildVCard(card, lang)], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    clickAnchor({ href: url, download: `MuJou-${card.id}-${lang}.vcf` });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast(t.savingContact);
  } catch (_) {
    clickAnchor({ href: vcfPath(card, lang), download: `MuJou-${card.id}-${lang}.vcf` });
  }
}

async function downloadCard() {
  const card = CARDS[index];
  const src = pick(card, lang).image;
  toast(t.downloadStarted);
  try {
    const res = await fetch(src, { cache: 'force-cache' });
    if (!res.ok) throw new Error(res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    clickAnchor({ href: url, download: downloadName(card) });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (_) {
    clickAnchor({ href: src, download: downloadName(card), target: '_blank', rel: 'noopener' });
  }
}

function openSocial() {
  const links = CARDS[index].social || [];
  if (!links.length) return;
  if (links.length === 1) {
    clickAnchor({ href: links[0].url, target: '_blank', rel: 'noopener noreferrer' });
    return;
  }
  openSheet(t.socialTitle, links.map((s) => ({
    icon: socialIcon(s.type),
    title: s.label,
    sub: s.url.replace(/^https?:\/\/(www\.)?/, ''),
    href: s.url,
  })));
}

/* ---------- 放大檢視 ---------- */

let lbLastFocus = null;

function openLightbox() {
  const card = CARDS[index];
  lbImg.src = pick(card, lang).image;
  lbImg.alt = cardAlt(card);
  lbLastFocus = document.activeElement;
  lightbox.hidden = false;
  void lightbox.offsetHeight;
  lightbox.classList.add('open');
  document.body.classList.add('no-scroll');
  lbClose.focus({ preventScroll: true });
  document.addEventListener('keydown', onLbKey);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', onLbKey);
  setTimeout(() => { lightbox.hidden = true; }, 260);
  if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus({ preventScroll: true });
}

function onLbKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
  if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
}

/* ---------- Bottom sheet ---------- */

let lastFocus = null;

function openSheet(title, items) {
  lastFocus = document.activeElement;
  sheetTitle.textContent = title;
  sheetBody.innerHTML = items.map((it, i) => {
    const inner =
      `${icon(it.icon)}<span class="grow">${it.title}` +
      (it.sub ? `<span class="sub">${it.sub}</span>` : '') +
      `</span>` + (it.href ? icon('i-arrow-out', 'ico trail') : (it.current ? icon('i-check', 'ico trail') : ''));
    return it.href
      ? `<a class="sheet-item" href="${it.href}" target="_blank" rel="noopener noreferrer">${inner}</a>`
      : `<button class="sheet-item${it.current ? ' is-current' : ''}" type="button" data-i="${i}">${inner}</button>`;
  }).join('');

  sheetBody.querySelectorAll('button.sheet-item').forEach((b) => {
    b.addEventListener('click', () => {
      const it = items[+b.dataset.i];
      closeSheet();
      if (it && typeof it.onSelect === 'function') it.onSelect();
    });
  });
  sheetBody.querySelectorAll('a.sheet-item').forEach((a) => a.addEventListener('click', closeSheet));

  scrim.hidden = false;
  sheet.hidden = false;
  void sheet.offsetHeight; // 強制 reflow,讓過場從關閉狀態開始(不依賴 rAF)
  scrim.classList.add('open');
  sheet.classList.add('open');
  (sheetBody.querySelector('.sheet-item') || sheetClose).focus({ preventScroll: true });
  document.addEventListener('keydown', onSheetKey);
}

function closeSheet() {
  sheet.classList.remove('open');
  scrim.classList.remove('open');
  document.removeEventListener('keydown', onSheetKey);
  langBtn.setAttribute('aria-expanded', 'false');
  setTimeout(() => { sheet.hidden = true; scrim.hidden = true; }, 300);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}

function onSheetKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
  if (e.key !== 'Tab') return;
  const f = [...sheet.querySelectorAll('a[href],button:not([disabled])')];
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openLangSheet() {
  langBtn.setAttribute('aria-expanded', 'true');
  openSheet(t.language, LANGS.map((code) => ({
    icon: 'i-lang',
    title: I18N[code].label,
    current: code === lang,
    onSelect: () => setLang(code),
  })));
}

/* ---------- i18n 套用 ---------- */

function setLang(code) {
  if (!I18N[code]) return;
  lang = code;
  t = I18N[code].t;
  try { localStorage.setItem(STORE_KEY, code); } catch (_) { /* ignore */ }
  applyLang();
}

function applyLang() {
  const meta = I18N[lang];
  document.documentElement.lang = meta.htmlLang;
  document.title = t.docTitle;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', t.metaDesc);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t[el.dataset.i18n];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const v = t[el.dataset.i18nAria];
    if (v) el.setAttribute('aria-label', v);
  });

  langBtnLabel.textContent = LANG_SHORT[lang] || lang;
  langBtn.setAttribute('aria-label', t.language);
  syncCardImages();
  renderInfo(CARDS[index]);
}

/* ---------- 3D 傾斜(僅滑鼠裝置) ---------- */

function initTilt() {
  if (!CAN_HOVER || REDUCED) return;
  slides.forEach((slide) => {
    const tilt = slide.querySelector('.tilt');
    slide.addEventListener('pointermove', (e) => {
      if (!slide.classList.contains('is-active')) return;
      const r = slide.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      tilt.style.setProperty('--ry', `${px * 13}deg`);
      tilt.style.setProperty('--rx', `${-py * 9}deg`);
      tilt.style.transition = 'transform .08s linear';
    });
    const reset = () => {
      tilt.style.transition = '';
      tilt.style.setProperty('--ry', '0deg');
      tilt.style.setProperty('--rx', '0deg');
    };
    slide.addEventListener('pointerleave', reset);
    slide.addEventListener('pointercancel', reset);
  });
}

/* ---------- 點擊 / 滑動判定 ---------- */

function initTaps() {
  slides.forEach((slide, i) => {
    let x0 = 0, y0 = 0, t0 = 0, sl0 = 0, dragged = false;

    slide.addEventListener('pointerdown', (e) => {
      x0 = e.clientX; y0 = e.clientY; t0 = e.timeStamp;
      sl0 = cardsEl.scrollLeft; dragged = false;
    });
    slide.addEventListener('pointermove', (e) => {
      if (Math.abs(e.clientX - x0) > 8 || Math.abs(e.clientY - y0) > 8) dragged = true;
    });
    slide.addEventListener('pointercancel', () => { dragged = true; });
    slide.addEventListener('pointerup', (e) => {
      const scrolled = Math.abs(cardsEl.scrollLeft - sl0) > 4;
      if (dragged || scrolled || e.timeStamp - t0 > 700) return;
      if (i !== index) goTo(i);
      else openLightbox();
    });

    slide.querySelector('.zoom-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (i !== index) goTo(i); else openLightbox();
    });
  });
}

/* ---------- 啟動 ---------- */

function init() {
  buildSlides();
  index = initialIndex();
  applyLang();          // 內含 syncCardImages + renderInfo
  setIndex(index, { animate: false });
  initTilt();
  initTaps();
  if (index > 0) {
    // 先讓版面完成佈局再置中,避免圖片尚未載入時算錯位置
    requestAnimationFrame(() => {
      const s = slides[index];
      if (s) cardsEl.scrollLeft = s.offsetLeft - (cardsEl.clientWidth - s.offsetWidth) / 2;
    });
  }

  let raf = 0;
  cardsEl.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const n = nearestIndex();
      if (n !== index) setIndex(n);
    });
  }, { passive: true });

  cardsEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  btnContact.addEventListener('click', addToContact);
  btnDownload.addEventListener('click', downloadCard);
  btnSocial.addEventListener('click', openSocial);
  langBtn.addEventListener('click', openLangSheet);
  sheetClose.addEventListener('click', closeSheet);
  scrim.addEventListener('click', closeSheet);
  lightbox.addEventListener('click', closeLightbox);
  lbClose.addEventListener('click', closeLightbox);

  // 視窗尺寸改變時,把目前這張重新置中
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const s = slides[index];
      if (s) cardsEl.scrollLeft = s.offsetLeft - (cardsEl.clientWidth - s.offsetWidth) / 2;
    }, 120);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
