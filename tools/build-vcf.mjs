/**
 * 由 data.js 產生每個語系的 vCard(iOS 需要真實檔案才能跳出「加入聯絡人」)
 * 用法:node tools/build-vcf.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, LANGS, buildVCard, vcfPath } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const seen = new Set();

for (const card of CARDS) {
  for (const lang of LANGS) {
    const rel = vcfPath(card, lang);
    if (seen.has(rel)) continue;      // 該張名片沒有此語系版本,已由 en 產生過
    seen.add(rel);
    const out = resolve(root, rel);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buildVCard(card, card.l10n[lang] ? lang : 'en'), 'utf8');
    console.log('✓', rel);
  }
}
console.log(`\n${seen.size} 個 vCard 產生完成`);
