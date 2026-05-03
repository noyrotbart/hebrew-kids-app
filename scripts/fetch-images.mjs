#!/usr/bin/env node
// Download one curated Pexels photo per vocabulary word, save to public/images/words/{id}.jpg.
// Pexels has a free tier — sign up at https://www.pexels.com/api and set:
//   export PEXELS_API_KEY=your_key
// Then run: npm run fetch:images

import fs from 'node:fs/promises';
import path from 'node:path';
import { WORDS } from '../src/data/words.js';

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error('Missing PEXELS_API_KEY. Get a free one at https://www.pexels.com/api');
  process.exit(1);
}

const OUT = path.resolve('public/images/words');
await fs.mkdir(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fetchOne = async (word) => {
  const dest = path.join(OUT, `${word.id}.jpg`);
  try {
    await fs.access(dest);
    return { id: word.id, status: 'cached' };
  } catch {}

  const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(word.imageQuery)}&per_page=5&orientation=square`;
  const res = await fetch(u, { headers: { Authorization: KEY } });
  if (!res.ok) return { id: word.id, status: `pexels-${res.status}` };
  const json = await res.json();
  const photo = json.photos?.[0];
  if (!photo) return { id: word.id, status: 'no-result' };

  const imgUrl = photo.src?.large || photo.src?.medium || photo.src?.original;
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) return { id: word.id, status: `download-${imgRes.status}` };
  const buf = Buffer.from(await imgRes.arrayBuffer());
  await fs.writeFile(dest, buf);
  return { id: word.id, status: 'ok', credit: `${photo.photographer} (Pexels)` };
};

console.log(`Fetching ${WORDS.length} images → ${OUT}`);
const credits = [];
for (const w of WORDS) {
  const r = await fetchOne(w);
  console.log(`  ${w.id.padEnd(10)} ${r.status}${r.credit ? ` — ${r.credit}` : ''}`);
  if (r.credit) credits.push(`${w.id}: ${r.credit}`);
  await sleep(200);
}
await fs.writeFile(path.join(OUT, 'CREDITS.txt'), credits.join('\n') + '\n');
console.log('Done.');
