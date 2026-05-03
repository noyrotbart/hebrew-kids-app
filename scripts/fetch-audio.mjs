#!/usr/bin/env node
// Pre-generate Hebrew word audio via the Phonikud HF Space and save to
// public/audio/words/{id}.wav. Run once after editing words.js:
//   npm run fetch:audio
//
// HF Spaces sleep after ~15 min idle — first call may take ~30 s while it warms up.

import fs from 'node:fs/promises';
import path from 'node:path';
import { WORDS } from '../src/data/words.js';

const HF_URL = 'https://thewh1teagle-phonikud-tts.hf.space/generate';
const OUT = path.resolve('public/audio/words');
await fs.mkdir(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fetchOne = async (word) => {
  const dest = path.join(OUT, `${word.id}.wav`);
  try {
    await fs.access(dest);
    return { id: word.id, status: 'cached' };
  } catch {}

  const fd = new FormData();
  fd.append('mode', 'text');
  fd.append('text', word.he); // include nikud for accurate pronunciation

  const res = await fetch(HF_URL, { method: 'POST', body: fd, signal: AbortSignal.timeout(60_000) });
  if (!res.ok) return { id: word.id, status: `hf-${res.status}` };
  const json = await res.json();
  const data = json.audio;
  if (!data) return { id: word.id, status: 'no-audio' };
  const base64 = data.replace(/^data:audio\/wav;base64,/, '');
  const buf = Buffer.from(base64, 'base64');
  await fs.writeFile(dest, buf);
  return { id: word.id, status: 'ok' };
};

console.log(`Generating audio for ${WORDS.length} words → ${OUT}`);
console.log('First call may take ~30 s while the HF Space wakes up.');
for (const w of WORDS) {
  let result;
  for (let attempt = 0; attempt < 3; attempt++) {
    result = await fetchOne(w);
    if (result.status === 'ok' || result.status === 'cached') break;
    await sleep(2000);
  }
  console.log(`  ${w.id.padEnd(10)} ${w.he.padEnd(10)} ${result.status}`);
  await sleep(300);
}
console.log('Done.');
