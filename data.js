/* ------------------------------------------------------------------
 * data.js — 唯一設定來源 (single source of truth)
 *
 * 要改名片內容、連結、社群,只要改這個檔案。
 * 改完 vCard 資料後,執行 `node tools/build-vcf.mjs` 重新產生 vcf/*.vcf
 * ------------------------------------------------------------------ */

/** 每個人共用的聊天連結(Chat 按鈕) */
export const CHAT_URL = 'https://pinchat.app/mujou';

/**
 * 名片清單。順序 = 左右滑動的順序。
 * accent      : 主色(用於背景光暈、圓點)
 * accentText  : 主色的亮版(用於文字與主要按鈕,確保深色底上的對比)
 * social      : [] 空陣列 = 隱藏 Social 按鈕;1 筆 = 直接開啟;多筆 = 跳出選單
 */
export const CARDS = [
  {
    id: 'funtek',
    image: 'assets/funtek-card.png',
    imageAlt: 'Mu Jou — FUNTEK Software Inc. business card',
    accent: '#5694B5',
    accentText: '#8FC6E4',
    displayName: 'Mu Jou 周書丞',
    roleKey: 'bd',
    company: 'FUNTEK Software Inc.',
    email: 'mujou@funtek.co',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://funtek.co',
    websiteLabel: 'funtek.co',
    chatUrl: CHAT_URL,
    social: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/mujou0612' },
    ],
    vcf: 'vcf/mujou-funtek.vcf',
    downloadName: 'MuJou-FUNTEK-card.png',
    vcard: {
      first: 'Mu',
      last: 'Jou',
      fn: 'Mu Jou 周書丞',
      org: 'FUNTEK Software Inc.',
      title: 'VP of Business Development',
      adr: {
        street: '2F., No. 189, Gangcian Rd.',
        locality: 'Neihu Dist., Taipei City',
        postal: '114',
        country: 'Taiwan',
      },
    },
  },
  {
    id: 'pinchat',
    image: 'assets/pinchat-card.png',
    imageAlt: 'Mu Jou — PinChat business card',
    accent: '#02B13F',
    accentText: '#35D46E',
    displayName: 'Mu Jou 周書丞',
    roleKey: 'bd',
    company: 'PinChat by FUNTEK Software Inc.',
    email: 'mujou@pinchatcorp.com',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://pinchat.app',
    websiteLabel: 'pinchat.app',
    chatUrl: CHAT_URL,
    social: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/mujou0612' },
    ],
    vcf: 'vcf/mujou-pinchat.vcf',
    downloadName: 'MuJou-PinChat-card.png',
    vcard: {
      first: 'Mu',
      last: 'Jou',
      fn: 'Mu Jou 周書丞',
      org: 'PinChat;FUNTEK Software Inc.',
      title: 'VP of Business Development',
      adr: {
        street: '2F., No. 189, Gangcian Rd.',
        locality: 'Neihu Dist., Taipei City',
        postal: '114',
        country: 'Taiwan',
      },
    },
  },
  {
    id: 'futuremode',
    image: 'assets/futuremode-card.jpg',
    imageAlt: 'Mu Jou — Futuremode / Taipei Blockchain Week business card',
    accent: '#8FA3B8',
    accentText: '#CBD5E1',
    displayName: 'Mu Jou',
    roleKey: 'partnerships',
    company: 'Futuremode · Taipei Blockchain Week',
    email: 'mujou0612@gmail.com',
    phone: '+886 917 209 841',
    phoneRaw: '+886917209841',
    website: 'https://futuremode.onboardtheworld.com',
    websiteLabel: 'futuremode.onboardtheworld.com',
    chatUrl: CHAT_URL,
    social: [
      { type: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/mujou0612' },
    ],
    vcf: 'vcf/mujou-futuremode.vcf',
    downloadName: 'MuJou-Futuremode-card.jpg',
    vcard: {
      first: 'Mu',
      last: 'Jou',
      fn: 'Mu Jou',
      org: 'Futuremode;Onboard the World',
      title: 'Partnerships',
      adr: null,
    },
  },
];

/** 支援語系。key = 內部語言碼,htmlLang = <html lang> 用的值 */
export const I18N = {
  'zh-Hant': {
    label: '繁體中文',
    htmlLang: 'zh-Hant',
    t: {
      docTitle: 'Mu Jou · 數位名片',
      metaDesc: '掃描後即可儲存 Mu Jou 的聯絡資訊、下載名片、直接開始對話。',
      kicker: '數位名片',
      hint: '左右滑動,切換名片',
      addContact: '加入通訊錄',
      download: '下載名片',
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
      savingContact: '正在開啟聯絡人…',
      iosHint: '請在跳出的畫面點「加入現有聯絡人 / 建立新聯絡人」',
      androidHint: '下載完成後,點通知列的檔案即可匯入通訊錄',
      downloadStarted: '名片圖片下載中…',
      downloadFailed: '下載失敗,請長按圖片另存',
      socialTitle: 'Social',
      prev: '上一張',
      next: '下一張',
      roles: { bd: '商務開發副總', partnerships: '合作夥伴關係' },
    },
  },
  'zh-Hans': {
    label: '简体中文',
    htmlLang: 'zh-Hans',
    t: {
      docTitle: 'Mu Jou · 数字名片',
      metaDesc: '扫描后即可保存 Mu Jou 的联系方式、下载名片、直接开始对话。',
      kicker: '数字名片',
      hint: '左右滑动,切换名片',
      addContact: '添加到通讯录',
      download: '下载名片',
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
      savingContact: '正在打开联系人…',
      iosHint: '请在弹出的画面点「添加到现有联系人 / 创建新联系人」',
      androidHint: '下载完成后,点通知栏的文件即可导入通讯录',
      downloadStarted: '名片图片下载中…',
      downloadFailed: '下载失败,请长按图片另存',
      socialTitle: 'Social',
      prev: '上一张',
      next: '下一张',
      roles: { bd: '商务开发副总裁', partnerships: '合作伙伴关系' },
    },
  },
  en: {
    label: 'English',
    htmlLang: 'en',
    t: {
      docTitle: 'Mu Jou · Digital Business Card',
      metaDesc: "Save Mu Jou's contact details, download the card, or start a chat right away.",
      kicker: 'Digital Business Card',
      hint: 'Swipe to switch cards',
      addContact: 'Add to Contact',
      download: 'Download',
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
      savingContact: 'Opening contact card…',
      iosHint: 'Tap “Add to Existing Contact” or “Create New Contact” on the next screen',
      androidHint: 'Once downloaded, open the file from your notifications to import it',
      downloadStarted: 'Downloading card image…',
      downloadFailed: 'Download failed — long-press the card to save it',
      socialTitle: 'Social',
      prev: 'Previous card',
      next: 'Next card',
      roles: { bd: 'VP of Business Development', partnerships: 'Partnerships' },
    },
  },
  ja: {
    label: '日本語',
    htmlLang: 'ja',
    t: {
      docTitle: 'Mu Jou · デジタル名刺',
      metaDesc: 'Mu Jou の連絡先を保存したり、名刺をダウンロードしたり、そのままチャットを始められます。',
      kicker: 'デジタル名刺',
      hint: 'スワイプして名刺を切り替え',
      addContact: '連絡先に追加',
      download: '名刺を保存',
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
      savingContact: '連絡先を開いています…',
      iosHint: '次の画面で「既存の連絡先に追加」または「新規連絡先を作成」をタップしてください',
      androidHint: 'ダウンロード後、通知からファイルを開くと連絡先に取り込めます',
      downloadStarted: '名刺画像をダウンロード中…',
      downloadFailed: '保存に失敗しました。画像を長押しして保存してください',
      socialTitle: 'Social',
      prev: '前の名刺',
      next: '次の名刺',
      roles: { bd: '事業開発担当バイスプレジデント', partnerships: 'パートナーシップ' },
    },
  },
  ko: {
    label: '한국어',
    htmlLang: 'ko',
    t: {
      docTitle: 'Mu Jou · 디지털 명함',
      metaDesc: 'Mu Jou의 연락처를 저장하고, 명함을 내려받고, 바로 대화를 시작하세요.',
      kicker: '디지털 명함',
      hint: '좌우로 밀어 명함 전환',
      addContact: '연락처에 추가',
      download: '명함 저장',
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
      savingContact: '연락처를 여는 중…',
      iosHint: '다음 화면에서 “기존 연락처에 추가” 또는 “새로운 연락처 생성”을 누르세요',
      androidHint: '다운로드 후 알림에서 파일을 열면 연락처로 가져올 수 있습니다',
      downloadStarted: '명함 이미지를 내려받는 중…',
      downloadFailed: '저장에 실패했습니다. 이미지를 길게 눌러 저장해 주세요',
      socialTitle: 'Social',
      prev: '이전 명함',
      next: '다음 명함',
      roles: { bd: '사업개발 부사장', partnerships: '파트너십' },
    },
  },
};

export const FALLBACK_LANG = 'en';

/** vCard 3.0 值的跳脫:反斜線、分號、逗號、換行 */
function esc(v = '') {
  return String(v).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** 產生 vCard 3.0 字串(CRLF 結尾,iOS / Android 皆可匯入) */
export function buildVCard(card) {
  const v = card.vcard;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(v.last)};${esc(v.first)};;;`,
    `FN:${esc(v.fn)}`,
    // ORG 內的分號是「部門」分隔,屬於結構,不跳脫
    `ORG:${v.org.split(';').map(esc).join(';')}`,
    `TITLE:${esc(v.title)}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${esc(card.email)}`,
    `TEL;TYPE=CELL,VOICE,PREF:${esc(card.phoneRaw)}`,
    `URL:${esc(card.website)}`,
  ];
  if (v.adr) {
    lines.push(
      `ADR;TYPE=WORK:;;${esc(v.adr.street)};${esc(v.adr.locality)};;${esc(v.adr.postal)};${esc(v.adr.country)}`
    );
  }
  for (const s of card.social || []) {
    lines.push(`X-SOCIALPROFILE;TYPE=${esc(s.label)}:${esc(s.url)}`);
    lines.push(`URL;TYPE=${esc(s.label)}:${esc(s.url)}`);
  }
  lines.push('END:VCARD');
  return lines.join('\r\n') + '\r\n';
}
