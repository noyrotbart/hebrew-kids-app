#!/usr/bin/env node
// Pre-generate Hebrew audio via the Phonikud HF Space and save to public/audio/.
// Covers vocabulary words (used by Flashcards / Listen / Speak / Spelling) and
// intermediate scene sentences (used by StoryCompose). Run once after editing
// the source data:
//   npm run fetch:audio
//
// HF Spaces sleep after ~15 min idle — first call may take ~30 s while it warms up.

import fs from 'node:fs/promises';
import path from 'node:path';
import { WORDS } from '../src/data/words.js';
import { SCENES } from '../src/data/scenes.js';

const HF_URL = 'https://thewh1teagle-phonikud-tts.hf.space/generate';
const OUT_WORDS  = path.resolve('public/audio/words');
const OUT_SCENES = path.resolve('public/audio/scenes');
await fs.mkdir(OUT_WORDS,  { recursive: true });
await fs.mkdir(OUT_SCENES, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fetchOne = async (id, text, dir) => {
  const dest = path.join(dir, `${id}.wav`);
  try { await fs.access(dest); return { id, status: 'cached' }; } catch {}

  const fd = new FormData();
  fd.append('mode', 'text');
  fd.append('text', text); // include nikud for accurate pronunciation

  const res = await fetch(HF_URL, { method: 'POST', body: fd, signal: AbortSignal.timeout(90_000) });
  if (!res.ok) return { id, status: `hf-${res.status}` };
  const json = await res.json();
  const data = json.audio;
  if (!data) return { id, status: 'no-audio' };
  const base64 = data.replace(/^data:audio\/wav;base64,/, '');
  const buf = Buffer.from(base64, 'base64');
  await fs.writeFile(dest, buf);
  return { id, status: 'ok' };
};

const runBatch = async (label, items, dir) => {
  console.log(`\nGenerating ${items.length} ${label} → ${dir}`);
  for (const { id, text } of items) {
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      result = await fetchOne(id, text, dir);
      if (result.status === 'ok' || result.status === 'cached') break;
      await sleep(2500);
    }
    console.log(`  ${id.padEnd(14)} ${text.padEnd(30)} ${result.status}`);
    await sleep(300);
  }
};

console.log('First call may take ~30 s while the HF Space wakes up.');

await runBatch(
  'word audios',
  WORDS.map(w => ({ id: w.id, text: w.he })),
  OUT_WORDS,
);

await runBatch(
  'scene audios',
  SCENES.map(s => ({ id: s.id, text: s.sentence })),
  OUT_SCENES,
);

console.log('\nDone.');
