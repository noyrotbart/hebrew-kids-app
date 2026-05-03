// Audio playback with single-source guarantee.
//
// Resolution order:
//   1. Pre-generated static file at public/audio/{kind}/{id}.{ext}    (instant, when present)
//   2. /api/tts (Phonikud serverless proxy)                            (slow first call)
//   3. Web Speech API 'he-IL'                                          (always available)
//
// Anti-doubling: every play() call gets a session id. Any older session is invalidated;
// in-flight TTS fetches from older sessions are aborted and their results discarded so
// you never hear two voices at once.
//
// Vercel quirk: missing static files don't return 404 — they get the SPA index.html with
// content-type: text/html. <audio> would happily fail with onerror, so we still rely on
// that, but we ALSO probe the Content-Type for the static fetch and skip the audio attempt
// entirely if the response isn't audio/*.

import { stripNikud } from '../data/alphabet.js';

const cache = new Map();
let session = 0;
let current = null;
let currentAbort = null;

const isCurrent = (s) => s === session;

const stop = () => {
  session++; // invalidate any in-flight plays
  if (currentAbort) { try { currentAbort.abort(); } catch {} currentAbort = null; }
  if (current) {
    try { current.pause(); current.currentTime = 0; } catch {}
    current.onended = null;
    current.onerror = null;
    current = null;
  }
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
};

const playAudio = (audio, mySession) => new Promise((resolve, reject) => {
  audio.currentTime = 0;
  current = audio;
  audio.onended = () => { if (isCurrent(mySession)) resolve(); };
  audio.onerror = (e) => { if (isCurrent(mySession)) reject(e); };
  audio.play().catch((e) => { if (isCurrent(mySession)) reject(e); });
});

const tryStaticUrl = async (url, mySession) => {
  // Probe content-type before binding it to <audio>. If the host serves SPA fallback
  // (text/html) we abort and let the next tier run.
  const ac = new AbortController();
  currentAbort = ac;
  let res;
  try {
    res = await fetch(url, { method: 'GET', signal: ac.signal, cache: 'force-cache' });
  } catch {
    if (!isCurrent(mySession)) return false;
    return false;
  }
  if (!isCurrent(mySession)) return false;
  if (!res.ok) return false;
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('audio/')) return false;
  // Use the response as a blob → known-good audio source.
  const blob = await res.blob();
  if (!isCurrent(mySession)) return false;
  const blobUrl = URL.createObjectURL(blob);
  const a = new Audio(blobUrl);
  cache.set(url, a);
  await playAudio(a, mySession);
  return true;
};

const tryTts = async (text, cacheKey, mySession) => {
  const ac = new AbortController();
  currentAbort = ac;
  let res;
  try {
    res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: stripNikud(text) }),
      signal: ac.signal,
    });
  } catch {
    return false;
  }
  if (!isCurrent(mySession)) return false;
  if (!res.ok) return false;
  const blob = await res.blob();
  if (!isCurrent(mySession)) return false;
  const blobUrl = URL.createObjectURL(blob);
  const a = new Audio(blobUrl);
  cache.set(cacheKey, a);
  await playAudio(a, mySession);
  return true;
};

const speakNative = (text, mySession) => new Promise((resolve) => {
  if (typeof speechSynthesis === 'undefined') return resolve();
  if (!isCurrent(mySession)) return resolve();
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

// Public API ----------------------------------------------------------------

export const playLetter = async (id) => {
  stop();
  const mySession = session;
  const url = `/audio/letters/${id}.m4a`;
  // Letters DO ship as real audio files — try cached first, else fetch+probe.
  const cached = cache.get(url);
  if (cached) {
    try { await playAudio(cached, mySession); return; } catch {}
  }
  if (!isCurrent(mySession)) return;
  if (await tryStaticUrl(url, mySession)) return;
  if (!isCurrent(mySession)) return;
  await speakNative(id, mySession);
};

export const playWord = async (word) => {
  stop();
  const mySession = session;
  const url = `/audio/words/${word.id}.wav`;
  const cached = cache.get(url);
  if (cached) {
    try { await playAudio(cached, mySession); return; } catch {}
  }
  if (!isCurrent(mySession)) return;
  if (await tryStaticUrl(url, mySession)) return;
  if (!isCurrent(mySession)) return;
  if (await tryTts(word.he, url, mySession)) return;
  if (!isCurrent(mySession)) return;
  await speakNative(word.he, mySession);
};

export const speak = async (text) => {
  stop();
  const mySession = session;
  if (await tryTts(text, `tts:${text}`, mySession)) return;
  if (!isCurrent(mySession)) return;
  await speakNative(text, mySession);
};

export const stopAudio = stop;
