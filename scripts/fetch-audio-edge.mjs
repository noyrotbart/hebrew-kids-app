#!/usr/bin/env node
// Generate audio with Microsoft Edge neural TTS — he-IL-AvriNeural (MALE).
// Free, no API key. Covers everything the old Web-Speech female fallback used
// to say, plus any word that doesn't already ship a GCP Wavenet-D .wav:
//   public/audio/ui/{id}.mp3      — every scripted host line (uiLines.js)
//   public/audio/words/{id}.mp3   — words with no .wav (the newer corpus)
//
// Existing GCP word/scene WAVs are left untouched — that's the male voice the
// kids already know. Run: npm run fetch:audio:edge

import fs from 'node:fs/promises';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { UI_LINES } from '../src/data/uiLines.js';
import { WORDS } from '../src/data/words.js';

const VOICE = 'he-IL-AvriNeural';
const OUT_UI = path.resolve('public/audio/ui');
const OUT_WORDS = path.resolve('public/audio/words');
await fs.mkdir(OUT_UI, { recursive: true });
await fs.mkdir(OUT_WORDS, { recursive: true });

const exists = (p) => fs.access(p).then(() => true, () => false);

const synthToFile = async (text, dest) => {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  let streamRes;
  try {
    streamRes = await tts.toStream(text, { rate: '-12%' }); // kid pacing
  } catch {
    streamRes = await tts.toStream(text); // older lib versions: no prosody opts
  }
  const { audioStream } = streamRes;
  const chunks = [];
  await new Promise((resolve, reject) => {
    audioStream.on('data', (c) => chunks.push(c));
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
    setTimeout(() => reject(new Error('timeout')), 30_000);
  });
  const buf = Buffer.concat(chunks);
  if (buf.length < 1000) throw new Error(`suspiciously small output (${buf.length}B)`);
  await fs.writeFile(dest, buf);
  return buf.length;
};

const run = async (label, items) => {
  console.log(`\n${label} (${items.length})`);
  for (const { id, text, dest, skip } of items) {
    if (skip) { console.log(`  ${id.padEnd(18)} skip (exists)`); continue; }
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const bytes = await synthToFile(text, dest);
        console.log(`  ${id.padEnd(18)} ${text.padEnd(30)} ok (${bytes}B)`);
        ok = true;
      } catch (e) {
        if (attempt === 2) console.log(`  ${id.padEnd(18)} FAILED — ${e.message}`);
        else await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
};

const force = process.argv.includes('--force');

const uiItems = await Promise.all(UI_LINES.map(async (l) => {
  const dest = path.join(OUT_UI, `${l.id}.mp3`);
  return { id: l.id, text: l.text, dest, skip: !force && await exists(dest) };
}));

const wordItems = [];
for (const w of WORDS) {
  const wav = path.join(OUT_WORDS, `${w.id}.wav`);
  const mp3 = path.join(OUT_WORDS, `${w.id}.mp3`);
  if (await exists(wav)) continue; // GCP male voice already ships this word
  wordItems.push({ id: w.id, text: w.he, dest: mp3, skip: !force && await exists(mp3) });
}

console.log(`Voice: ${VOICE}`);
await run('UI lines → public/audio/ui', uiItems);
await run('Words without WAV → public/audio/words', wordItems);
console.log('\nDone.');
