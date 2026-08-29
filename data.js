/* ------------------------------------------------------------------
 * data.js — 唯一設定來源 (single source of truth)
 *
 * 名片文字、五國語系文案、vCard 產生器都在這裡。
 * 改完之後:
 *   node tools/build-cards.mjs   → 重新產生 assets/*-card-*.png(名片圖)
 *   node tools/build-vcf.mjs     → 重新產生 vcf/*.vcf
 * ------------------------------------------------------------------ */

/** 支援語系,順序 = 語言選單順序。en 同時是所有 fallback */
export const LANGS = ['zh-Hant', 'zh-Hans', 'en', 'ja', 'ko'];

/** 共用的聊天連結(Chat 按鈕) */
export const CHAT_URL = 'https://pinchat.app/mujou';

const TAIPEI = {
  'zh-Hant': '110 臺北市信義區忠孝東路5段1之3號7樓',
  'zh-Hans': '110 台北市信义区忠孝东路5段1之3号7楼',
  en: '7F., No. 1-3, Sec. 5, Zhongxiao E. Rd., Xinyi Dist., Taipei City 110, Taiwan',
  ja: '台湾 台北市信義区忠孝東路5段1-3号 7階(110)',
  ko: '대만 타이베이시 신이구 중샤오둥로 5가 1-3호 7층 (110)',
};

/** vCard 用的結構化地址。非英文語系整串放 street 欄位,聯絡人 App 一樣會正確顯示 */
const TAIPEI_ADR = {
  en: {
    street: '7F., No. 1-3, Sec. 5, Zhongxiao E. Rd.',
    locality: 'Xinyi Dist., Taipei City',
    postal: '110',
    country: 'Taiwan',
  },
  other: (lang) => ({ street: TAIPEI[lang], locality: '', postal: '', country: 'Taiwan' }),
};

const NAME = {
  'zh-Hant': 'Mu Jou 周書丞',
  'zh-Hans': 'Mu Jou 周書丞',
  en: 'Mu Jou',            // 英文版不出現中文名
  ja: 'Mu Jou 周書丞',
  ko: 'Mu Jou 周書丞',
};

/** 公司中文名,只在中文版名片出現 */
const CN_NAME = {
  funtek:  { 'zh-Hant': '樂堤科技有限公司', 'zh-Hans': '乐堤科技有限公司' },
  pinchat: { 'zh-Hant': '堤安移動股份有限公司', 'zh-Hans': '堤安移动股份有限公司' },
};

const ROLE_BD = {
  'zh-Hant': '商務副總',
  'zh-Hans': '商务副总',
  en: 'VP of Business Development',
  ja: 'ビジネス担当バイスプレジデント',
  ko: '비즈니스 부사장',
};

/** 產生一張名片的五語系設定 */
function officeL10n(idPrefix, company) {
  const out = {};
  for (const lang of LANGS) {
    out[lang] = {
      image: `assets/${idPrefix}-card-${lang.toLowerCase()}.png`,
      name: NAME[lang],
      role: ROLE_BD[lang],
      company,
      cnName: (CN_NAME[idPrefix] || {})[lang] || null,
      address: TAIPEI[lang],
      adr: lang === 'en' ? TAIPEI_ADR.en : TAIPEI_ADR.other(lang),
    };
  }
  return out;
}

/**
 * 名片清單。順序 = 左右滑動的順序。
 * brand   : 給 tools/build-cards.mjs 產圖用;null = 使用現成圖檔,不重新產生
 * social  : [] 空陣列 = 隱藏 Social 按鈕;1 筆 = 直接開啟;多筆 = 跳出選單
 * l10n    : 每個語系的名片圖與文字,找不到語系時 fallback 到 en
 */
export const CARDS = [
  {
    id: 'funtek',
    accent: '#5694B5',
    accentText: '#8FC6E4',
    brand: { logo: 'tools/logos/funtek.png', logoWidth: 262 },
    email: 'mujou@funtek.co',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://funtek.co',
    websiteLabel: 'funtek.co',
    vat: '54156129',
    chatUrl: CHAT_URL,
    social: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/mujou0612' },
    ],
    vcard: { first: 'Mu', last: 'Jou', org: 'FUNTEK Software Inc.' },
    l10n: officeL10n('funtek', 'FUNTEK Software Inc.'),
  },
  {
    id: 'pinchat',
    accent: '#02B13F',
    accentText: '#35D46E',
    brand: { logo: 'tools/logos/pinchat.png', logoWidth: 250 },
    email: 'mujou@pinchatcorp.com',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://pinchat.app',
    websiteLabel: 'pinchat.app',
    vat: '83144762',
    chatUrl: CHAT_URL,
    social: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/mujou0612' },
    ],
    vcard: { first: 'Mu', last: 'Jou', org: 'PinChat Inc.' },
    l10n: officeL10n('pinchat', 'PinChat Inc.'),
  },
  {
    id: 'futuremode',
    accent: '#8FA3B8',
    accentText: '#CBD5E1',
    brand: null, // 使用原始名片圖,不重新產生
    email: 'mujou0612@gmail.com',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://futuremode.onboardtheworld.com',
    websiteLabel: 'futuremode.onboardtheworld.com',
    vat: null,
    chatUrl: CHAT_URL,
    social: [
      { type: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/mujou0612' },
    ],
    vcard: { first: 'Mu', last: 'Jou', org: 'Futuremode;Onboard the World' },
    // 這張只有英文版(依需求保留原樣)
    l10n: {
      en: {
        image: 'assets/futuremode-card.jpg',
        name: 'Mu Jou',
        role: 'Partnerships',
        cnName: null,
        company: 'Futuremode · Taipei Blockchain Week',
        address: null,
        adr: null,
      },
    },
  },
];

/** 取得某張名片在某語系下的內容,找不到就用英文 */
export function pick(card, lang) {
  return card.l10n[lang] || card.l10n.en;
}

export const FALLBACK_LANG = 'en';

/** 介面文案。key = 語言碼,htmlLang = <html lang> 用的值 */
export const I18N = {
  'zh-Hant': {
    label: '繁體中文',
    htmlLang: 'zh-Hant',
    t: {
      docTitle: 'Mu Jou · 數位名片',
      metaDesc: '掃描後即可儲存 Mu Jou 的聯絡資訊、下載名片、直接開始對話。',
      kicker: '數位名片',
      addContact: '聯絡人',
      download: '下載名片',
      saveToPhotos: '存到相簿',
      chat: '線上聊聊',
      social: 'Social',
      language: '語言',
      close: '關閉',
      copy: '複製',
      copied: '已複製',
      copyFailed: '複製失敗,請長按文字手動複製',
      emailLabel: '電子郵件',
      phoneLabel: '電話',
      webLabel: '網站',
      vatLabel: '統一編號',
      zoomAria: '放大檢視名片',
      savingContact: '正在開啟聯絡人…',
      downloadStarted: '名片圖片下載中…',
      downloadFailed: '下載失敗,請長按圖片另存',
      longPressHint: '長按名片圖片,選「加入照片」就會存進相簿',
      socialTitle: 'Social',
      prev: '上一張',
      next: '下一張',
    },
  },
  'zh-Hans': {
    label: '简体中文',
    htmlLang: 'zh-Hans',
    t: {
      docTitle: 'Mu Jou · 数字名片',
      metaDesc: '扫描后即可保存 Mu Jou 的联系方式、下载名片、直接开始对话。',
      kicker: '数字名片',
      addContact: '联系人',
      download: '下载名片',
      saveToPhotos: '存到相册',
      chat: '在线聊聊',
      social: 'Social',
      language: '语言',
      close: '关闭',
      copy: '复制',
      copied: '已复制',
      copyFailed: '复制失败,请长按文字手动复制',
      emailLabel: '电子邮件',
      phoneLabel: '电话',
      webLabel: '网站',
      vatLabel: '统一编号',
      zoomAria: '放大查看名片',
      savingContact: '正在打开联系人…',
      downloadStarted: '名片图片下载中…',
      downloadFailed: '下载失败,请长按图片另存',
      longPressHint: '长按名片图片,选「添加到照片」就会存进相册',
      socialTitle: 'Social',
      prev: '上一张',
      next: '下一张',
    },
  },
  en: {
    label: 'English',
    htmlLang: 'en',
    t: {
      docTitle: 'Mu Jou · Digital Business Card',
      metaDesc: "Save Mu Jou's contact details, download the card, or start a chat right away.",
      kicker: 'Digital Business Card',
      addContact: 'Contact',
      download: 'Download',
      saveToPhotos: 'Save to Photos',
      chat: 'Chat',
      social: 'Social',
      language: 'Language',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed — please select the text manually',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      webLabel: 'Website',
      vatLabel: 'VAT',
      zoomAria: 'Enlarge business card',
      savingContact: 'Opening contact card…',
      downloadStarted: 'Downloading card image…',
      downloadFailed: 'Download failed — long-press the card to save it',
      longPressHint: 'Press and hold the card, then choose “Add to Photos”',
      socialTitle: 'Social',
      prev: 'Previous card',
      next: 'Next card',
    },
  },
  ja: {
    label: '日本語',
    htmlLang: 'ja',
    t: {
      docTitle: 'Mu Jou · デジタル名刺',
      metaDesc: 'Mu Jou の連絡先を保存したり、名刺をダウンロードしたり、そのままチャットを始められます。',
      kicker: 'デジタル名刺',
      addContact: '連絡先',
      download: '名刺を保存',
      saveToPhotos: '写真に保存',
      chat: 'チャット',
      social: 'Social',
      language: '言語',
      close: '閉じる',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーできませんでした。長押しで選択してください',
      emailLabel: 'メール',
      phoneLabel: '電話',
      webLabel: 'ウェブサイト',
      vatLabel: 'VAT',
      zoomAria: '名刺を拡大表示',
      savingContact: '連絡先を開いています…',
      downloadStarted: '名刺画像をダウンロード中…',
      downloadFailed: '保存に失敗しました。画像を長押しして保存してください',
      longPressHint: '名刺を長押しして「“写真”に追加」を選んでください',
      socialTitle: 'Social',
      prev: '前の名刺',
      next: '次の名刺',
    },
  },
  ko: {
    label: '한국어',
    htmlLang: 'ko',
    t: {
      docTitle: 'Mu Jou · 디지털 명함',
      metaDesc: 'Mu Jou의 연락처를 저장하고, 명함을 내려받고, 바로 대화를 시작하세요.',
      kicker: '디지털 명함',
      addContact: '연락처',
      download: '명함 저장',
      saveToPhotos: '사진에 저장',
      chat: '채팅하기',
      social: 'Social',
      language: '언어',
      close: '닫기',
      copy: '복사',
      copied: '복사됨',
      copyFailed: '복사에 실패했습니다. 길게 눌러 직접 복사해 주세요',
      emailLabel: '이메일',
      phoneLabel: '전화',
      webLabel: '웹사이트',
      vatLabel: 'VAT',
      zoomAria: '명함 확대 보기',
      savingContact: '연락처를 여는 중…',
      downloadStarted: '명함 이미지를 내려받는 중…',
      downloadFailed: '저장에 실패했습니다. 이미지를 길게 눌러 저장해 주세요',
      longPressHint: '명함을 길게 눌러 “사진”에 추가를 선택하세요',
      socialTitle: 'Social',
      prev: '이전 명함',
      next: '다음 명함',
    },
  },
};

/** 該語系的 vCard 檔路徑 */
export function vcfPath(card, lang) {
  return `vcf/${card.id}-${(card.l10n[lang] ? lang : FALLBACK_LANG).toLowerCase()}.vcf`;
}

/** vCard 3.0 值的跳脫:反斜線、分號、逗號、換行 */
function esc(v = '') {
  return String(v).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** 產生 vCard 3.0 字串(CRLF 結尾,iOS / Android 皆可匯入) */
export function buildVCard(card, lang = FALLBACK_LANG) {
  const v = card.vcard;
  const L = pick(card, lang);
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(v.last)};${esc(v.first)};;;`,
    `FN:${esc(L.name)}`,
    // ORG 內的分號是「部門」分隔,屬於結構,不跳脫
    `ORG:${v.org.split(';').map(esc).join(';')}`,
    `TITLE:${esc(L.role)}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${esc(card.email)}`,
    `TEL;TYPE=CELL,VOICE,PREF:${esc(card.phoneRaw)}`,
    `URL:${esc(card.website)}`,
  ];
  if (L.adr) {
    const a = L.adr;
    lines.push(
      `ADR;TYPE=WORK:;;${esc(a.street)};${esc(a.locality)};;${esc(a.postal)};${esc(a.country)}`
    );
  }
  for (const s of card.social || []) {
    lines.push(`X-SOCIALPROFILE;TYPE=${esc(s.label)}:${esc(s.url)}`);
    lines.push(`URL;TYPE=${esc(s.label)}:${esc(s.url)}`);
  }
  if (card.vat) {
    lines.push(`NOTE:${esc(`${I18N[lang] ? I18N[lang].t.vatLabel : 'VAT'} ${card.vat}`)}`);
  }
  lines.push('END:VCARD');
  return lines.join('\r\n') + '\r\n';
}
