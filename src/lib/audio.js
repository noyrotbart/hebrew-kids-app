// Audio playback with three-tier fallback:
//   1. Pre-generated static file in public/audio/{kind}/{id}.{ext}     (instant)
//   2. /api/tts (serverless Phonikud proxy)                            (slow first call)
//   3. Web Speech API ('he-IL')                                        (always available)
//
// We cache HTMLAudioElement instances so repeat playback is gapless.

import { stripNikud } from '../data/alphabet.js';

const cache = new Map();
let current = null;

const stop = () => {
  if (current) {
    try { current.pause(); current.currentTime = 0; } catch {}
    current = null;
  }
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
};

const playUrl = (url) => new Promise((resolve, reject) => {
  let a = cache.get(url);
  if (!a) {
    a = new Audio(url);
    a.preload = 'auto';
    cache.set(url, a);
  }
  a.currentTime = 0;
  current = a;
  a.onended = () => resolve();
  a.onerror = (e) => reject(e);
  a.play().catch(reject);
});

const speakNative = (text) => new Promise((resolve) => {
  if (typeof speechSynthesis === 'undefined') return resolve();
  const u = new SpeechSynthesisUtterance(stripNikud(text));
  u.lang = 'he-IL';
  u.rate = 0.9;
  const voices = speechSynthesis.getVoices();
  const heVoice = voices.find(v => v.lang?.startsWith('he'));
  if (heVoice) u.voice = heVoice;
  u.onend = () => resolve();
  u.onerror = () => resolve();
  speechSynthesis.speak(u);
});

const fetchTtsBlob = async (text) => {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: stripNikud(text) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`tts ${res.status}`);
  return res.blob();
};

// Play a letter by its alphabet id (uses pre-recorded m4a in public/audio/letters/).
export const playLetter = async (id) => {
  stop();
  const url = `/audio/letters/${id}.m4a`;
  try { await playUrl(url); }
  catch { await speakNative(id); }
};

// Play a word by its id (uses pre-generated wav in public/audio/words/).
// Falls back to the runtime tts proxy, then to native speech synthesis.
export const playWord = async (word) => {
  stop();
  const url = `/audio/words/${word.id}.wav`;
  try {
    await playUrl(url);
    return;
  } catch {}
  try {
    const blob = await fetchTtsBlob(word.he);
    const blobUrl = URL.createObjectURL(blob);
    cache.set(url, new Audio(blobUrl)); // promote into cache
    await playUrl(url);
    return;
  } catch {}
  await speakNative(word.he);
};

// Play arbitrary Hebrew text — uses tts proxy → native fallback.
export const speak = async (text) => {
  stop();
  try {
    const blob = await fetchTtsBlob(text);
    const u = URL.createObjectURL(blob);
    const a = new Audio(u);
    current = a;
    await a.play();
    return new Promise(r => { a.onended = () => r(); });
  } catch {
    await speakNative(text);
  }
};

export const stopAudio = stop;
