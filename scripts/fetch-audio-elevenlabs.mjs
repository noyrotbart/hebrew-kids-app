#!/usr/bin/env node
// Premium option: generate the full corpus with ElevenLabs (great Hebrew as
// of eleven_v3 / multilingual v2). Also the path to ONE consistent voice —
// including a clone of a parent's voice (Creator plan) so new content
// auto-generates in it.
//
// Usage:
//   ELEVENLABS_API_KEY=...                node scripts/fetch-audio-elevenlabs.mjs --list-voices
//   ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=<id> node scripts/fetch-audio-elevenlabs.mjs [--replace-wav] [--force]
//
// Targets: all words + scenes + UI lines → mp3.
// --replace-wav  also displace existing WAVs (Phonikud/GCP) into
//                public/audio/_backup so the new mp3 actually plays.
//                DO NOT use after recording your own WAVs in /#studio —
//                parent recordings are WAVs too and would be displaced.

import fs from 'node:fs/promises';
import path from 'node:path';
import { WORDS } from '../src/data/words.js';
import { SCENES } from '../src/data/scenes.js';
import { UI_LINES } from '../src/data/uiLines.js';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error('Missing ELEVENLABS_API_KEY — get one at https://elevenlabs.io (free tier is enough for this corpus).');
  process.exit(1);
}

if (process.argv.includes('--list-voices')) {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': KEY } });
  const { voices } = await res.json();
  for (const v of voices) console.log(`${v.voice_id}  ${v.name}  [${v.labels?.gender ?? '?'}] ${v.labels?.accent ?? ''}`);
  console.log('\nPick a male voice (or clone your own), then set ELEVENLABS_VOICE_ID and rerun.');
  process.exit(0);
}

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
if (!VOICE_ID) {
  console.error('Missing ELEVENLABS_VOICE_ID — run with --list-voices to choose one.');
  process.exit(1);
}
const MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2';
const force = process.argv.includes('--force');
const replaceWav = process.argv.includes('--replace-wav');

const exists = (p) => fs.access(p).then(() => true, () => false);

const synth = async (text, dest) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.6, similarity_boost: 0.8 } }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error('tiny output');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  return buf.length;
};

const displaceWav = async (dir, id) => {
  const wav = path.resolve(`public/audio/${dir}/${id}.wav`);
  if (!(await exists(wav))) return;
  const bakDir = path.resolve(`public/audio/_backup/${dir}`);
  await fs.mkdir(bakDir, { recursive: true });
  const bak = path.join(bakDir, `${id}.wav`);
  if (!(await exists(bak))) await fs.copyFile(wav, bak);
  await fs.rm(wav);
};

const TARGETS = [
  ...WORDS.map(w => ({ dir: 'words', id: w.id, text: w.he })),
  ...SCENES.map(s => ({ dir: 'scenes', id: s.id, text: s.sentence })),
  ...UI_LINES.map(l => ({ dir: 'ui', id: l.id, text: l.text })),
];

console.log(`Voice ${VOICE_ID}, model ${MODEL}, ${TARGETS.length} clips${replaceWav ? ', displacing existing WAVs' : ''}`);
for (const t of TARGETS) {
  const dest = path.resolve(`public/audio/${t.dir}/${t.id}.mp3`);
  if (!force && await exists(dest)) { console.log(`  ${t.id.padEnd(18)} skip (exists)`); continue; }
  try {
    const bytes = await synth(t.text, dest);
    if (replaceWav) await displaceWav(t.dir, t.id);
    console.log(`  ${t.id.padEnd(18)} ${t.text.padEnd(30)} ok (${bytes}B)`);
  } catch (e) {
    console.log(`  ${t.id.padEnd(18)} FAILED — ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 250));
}
console.log('\nDone. Scenes note: playScene prefers wav — use --replace-wav so the mp3s play.');
