# bcard — Mu Jou 的數位名片 Landing Page

掃描 QR Code 後導向的一頁式名片頁,靜態網站,部署於 GitHub Pages。

**線上網址:** https://mujou0612.github.io/bcard/

## 功能

- **多張名片左右滑動切換** — FUNTEK / PinChat / Futuremode(Taipei Blockchain Week),切換時下方資訊與主色同步變化
- **名片跟著語系換** — FUNTEK 與 PinChat 各有繁中 / 简中 / English / 日本語 / 한국어 五個版本的名片圖;Futuremode 依需求維持英文
- **點名片放大檢視** — 維持名片原本方向放大到滿版,可再用手勢縮放細看
- **動態名片效果** — 光澤掃過、緩慢浮動,桌機滑鼠移入時 3D 傾斜
- **i18n** — 依瀏覽器語系自動切換,右上角可手動切換(記憶於 localStorage)
- **Add to Contact** — iOS 直接開啟該語系的 `.vcf` 跳出「加入聯絡人」;Android / 桌機以 Blob 下載 vCard 3.0(CRLF、UTF-8)
- **Download** — 下載目前這張名片的高解析圖片(2376×1452)
- **Chat** — 開啟 https://pinchat.app/mujou
- **Social** — 單一連結直接開啟,多筆連結則跳出選單
- **RWD** — 手機優先,≥980px 切換為左右兩欄桌機版型

## 檔案結構

```
index.html          頁面結構 + SVG icon sprite
styles.css          全部樣式(手機優先,斷點 560 / 980 / 1240px)
app.js              行為邏輯(輪播、i18n、放大檢視、vCard、下載、bottom sheet)
data.js             ★ 唯一設定來源:名片資料 + 五國語系文案 + vCard 產生器
assets/             名片圖(每語系一張)與 icon
vcf/                產生出來的 vCard 檔(每張名片 × 每語系)
tools/
  build-cards.mjs   由 data.js 產生 assets/*-card-*.png
  build-vcf.mjs     由 data.js 產生 vcf/*.vcf
  logos/            產名片圖用的 logo 素材
```

## 常見修改

**所有內容都改 `data.js`,改完跑這兩行:**

```bash
node tools/build-cards.mjs   # 重產名片圖(需要 macOS 上的 Google Chrome)
node tools/build-vcf.mjs     # 重產 vCard
```

只想重產某幾個語系:`node tools/build-cards.mjs ja ko`

### 改職稱 / 地址 / 統一編號
- 職稱:`data.js` 最上方的 `ROLE_BD`
- 地址:`TAIPEI`(顯示用)與 `TAIPEI_ADR`(vCard 結構化欄位)
- 統一編號:各張名片的 `vat` 欄位。標籤中文是「統一編號」,其他語系是 `VAT`(見 `I18N[*].t.vatLabel`)

### 加社群連結
在該張名片的 `social` 陣列加一筆即可。空陣列 = 隱藏 Social 按鈕;1 筆 = 點擊直接開啟;2 筆以上 = 跳出選單。

```js
social: [
  { type: 'linkedin',  label: 'LinkedIn',  url: 'https://linkedin.com/in/mujou0612' },
  { type: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/mujou0612' },
],
```

`type` 目前支援 `linkedin` / `instagram` 專屬 icon,其他值會用通用連結 icon。

### 加一張新名片
在 `CARDS` 加一個物件(`brand` 填 logo 路徑就能自動產圖,填 `null` 則使用你自己準備的圖),跑上面兩個 build 指令。輪播、圓點、主色都會自動跟著長出來。

## 本機預覽

必須用 HTTP 伺服器(頁面使用 ES modules,`file://` 會被 CORS 擋):

```bash
python3 -m http.server 4173
# 開 http://localhost:4173/
```

## 深連結

`?card=` 可以指定一開啟就顯示哪一張名片,方便不同場合印不同 QR code;`?lang=` 可強制語系。

| 網址 | 開啟時顯示 |
| --- | --- |
| `https://mujou0612.github.io/bcard/` | FUNTEK(預設) |
| `https://mujou0612.github.io/bcard/?card=pinchat` | PinChat |
| `https://mujou0612.github.io/bcard/?card=futuremode` | Futuremode |

可併用:`?card=pinchat&lang=ja`。語系參數:`zh-Hant` / `zh-Hans` / `en` / `ja` / `ko`

## 部署

推到 `main` 分支即由 GitHub Pages 自動發布(根目錄)。`.nojekyll` 用來略過 Jekyll 建置。
