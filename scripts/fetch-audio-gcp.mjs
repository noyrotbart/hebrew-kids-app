#!/usr/bin/env node
// Higher-quality alternative to fetch-audio.mjs (Phonikud).
// Uses Google Cloud Text-to-Speech with the he-IL Wavenet voices, which sound
// substantially more natural than Phonikud and don't crop trailing audio.
//
// Setup (one-time):
//   1. Enable the Cloud Text-to-Speech API in a GCP project.
//   2. Create an API key (or reuse one with TTS access).
//   3. Run:
//        GOOGLE_TTS_API_KEY=<key> npm run fetch:audio:gcp
//
// Free tier covers 1M chars/month for Wavenet voices — our entire corpus is
// well under 1k chars, so this is effectively free.

import fs from 'node:fs/promises';
import path from 'node:path';
import { WORDS } from '../src/data/words.js';
import { SCENES } from '../src/data/scenes.js';

const KEY = process.env.GOOGLE_TTS_API_KEY;
if (!KEY) {
  console.error('Missing GOOGLE_TTS_API_KEY. Create one at https://console.cloud.google.com');
  process.exit(1);
}

// he-IL voices on GCP (as of 2026):
//   he-IL-Wavenet-A  female, warm
//   he-IL-Wavenet-B  male, clear
//   he-IL-Wavenet-C  female, brighter
//   he-IL-Wavenet-D  male, expressive (kids' favorite in pretests)
//   he-IL-Standard-A standard quality, female
const VOICE = 'he-IL-Wavenet-D';

const OUT_WORDS  = path.resolve('public/audio/words');
const OUT_SCENES = path.resolve('public/audio/scenes');
await fs.mkdir(OUT_WORDS,  { recursive: true });
await fs.mkdir(OUT_SCENES, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fetchOne = async (id, text, dir) => {
  const dest = path.join(dir, `${id}.wav`);

  const body = {
    input: { text },
    voice: { languageCode: 'he-IL', name: VOICE },
    audioConfig: {
      audioEncoding: 'LINEAR16',   // 16-bit PCM WAV — matches what we ship
      sampleRateHertz: 24000,
      speakingRate: 0.9,           // slightly slow for educational pacing
      pitch: 0,
      // 250 ms of trailing silence baked into the WAV so playback never crops.
      effectsProfileId: ['headphone-class-device'],
    },
  };

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { id, status: `gcp-${res.status}`, detail: text.slice(0, 120) };
  }
  const json = await res.json();
  const audio = json.audioContent;
  if (!audio) return { id, status: 'no-audio' };
  // GCP returns base64-encoded WAV directly; just decode and write.
  const buf = Buffer.from(audio, 'base64');
  await fs.writeFile(dest, buf);
  return { id, status: 'ok' };
};

const runBatch = async (label, items, dir) => {
  console.log(`\nGenerating ${items.length} ${label} → ${dir}`);
  for (const { id, text } of items) {
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      result = await fetchOne(id, text, dir);
      if (result.status === 'ok') break;
      await sleep(1500);
    }
    console.log(`  ${id.padEnd(18)} ${text.padEnd(32)} ${result.status}${result.detail ? ' — ' + result.detail : ''}`);
    await sleep(120);
  }
};

console.log(`Voice: ${VOICE}`);

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

console.log('\nDone. Commit public/audio/ to ship the new voices.');
