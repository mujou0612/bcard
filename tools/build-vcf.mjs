/**
 * 由 data.js 產生 vcf/*.vcf(iOS 需要真實檔案才能跳出「加入聯絡人」)
 * 用法:node tools/build-vcf.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, buildVCard } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const card of CARDS) {
  const out = resolve(root, card.vcf);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buildVCard(card), 'utf8');
  console.log('✓', card.vcf);
}
