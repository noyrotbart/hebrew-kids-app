// Audio playback with a single-source guarantee.
//
// Sources, in order:
//   1. Static files under public/audio/ — words/scenes are GCP Wavenet-D
//      (male), UI lines and newer words are Edge he-IL-AvriNeural (male),
//      letters are the recorded .m4a set. Probed by Content-Type because SPA
//      hosts serve index.html for missing files instead of 404.
//   2. Web Speech API — but ONLY a male he-IL voice. If the device offers no
//      male Hebrew voice (macOS ships only the female "Carmit"), we stay
//      silent rather than let a female voice into the app. Every scripted
//      line is pre-baked, so silence only happens for truly novel text.
//
// Every play() gets a session id; starting a new one invalidates in-flight
// older plays so two voices never overlap.

import { stripNikud } from '../data/letters.js';

const NATIVE_RATE = 0.85;
const POST_PLAY_PAD_MS = 200;

const cache = new Map();
let session = 0;
let current = null;
let currentAbort = null;

const isCurrent = (s) => s === session;

const stop = () => {
  session++;
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
  audio.onended = () => {
    if (!isCurrent(mySession)) return;
    setTimeout(() => { if (isCurrent(mySession)) resolve(); }, POST_PLAY_PAD_MS);
  };
  audio.onerror = (e) => { if (isCurrent(mySession)) reject(e); };
  audio.play().catch((e) => { if (isCurrent(mySession)) reject(e); });
});

const tryStaticUrl = async (url, mySession) => {
  const cached = cache.get(url);
  if (cached) {
    try { await playAudio(cached, mySession); return true; } catch { return false; }
  }
  const ac = new AbortController();
  currentAbort = ac;
  let res;
  try {
    // no-cache = revalidate with the server (ETag 304 when unchanged), so a
    // re-recorded clip is picked up immediately instead of a stale cached one.
    res = await fetch(url, { signal: ac.signal, cache: 'no-cache' });
  } catch {
    return false;
  }
  if (!isCurrent(mySession) || !res.ok) return false;
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('audio/')) return false;
  const blob = await res.blob();
  if (!isCurrent(mySession)) return false;
  const a = new Audio(URL.createObjectURL(blob));
  cache.set(url, a);
  try { await playAudio(a, mySession); return true; } catch { return false; }
};

const tryStaticUrls = async (urls, mySession) => {
  for (const url of urls) {
    if (!isCurrent(mySession)) return false;
    if (await tryStaticUrl(url, mySession)) return true;
  }
  return false;
};

// STRICT male-only voice pick. Never returns a female voice — returning null
// (and staying silent) is preferred over the device's female Hebrew voice.
const pickMaleHebrewVoice = () => {
  if (typeof speechSynthesis === 'undefined') return null;
  const he = speechSynthesis.getVoices().filter(v => v.lang?.startsWith('he'));
  return he.find(v => /male|avri|guy|asaf/i.test(v.name) && !/female/i.test(v.name)) ?? null;
};

const speakNativeMale = (text, mySession, rate = NATIVE_RATE) => new Promise((resolve) => {
  const voice = pickMaleHebrewVoice();
  if (!voice || !isCurrent(mySession)) return resolve();
  const u = new SpeechSynthesisUtterance(stripNikud(text));
  u.lang = 'he-IL';
  u.rate = rate;
  u.voice = voice;
  u.onend = () => resolve();
  u.onerror = () => resolve();
  speechSynthesis.speak(u);
});

// Public API ----------------------------------------------------------------

// Parent-recorded WAVs (made in /#studio) always outrank TTS files, so
// re-recording a clip instantly changes the app's voice for it.

export const playLetter = async (letterId) => {
  stop();
  const mySession = session;
  const ok = await tryStaticUrls([
    `/audio/letters/${letterId}.wav`,
    `/audio/letters/${letterId}.m4a`,
  ], mySession);
  if (ok) return;
  if (isCurrent(mySession)) await speakNativeMale(letterId, mySession);
};

export const playWord = async (word) => {
  stop();
  const mySession = session;
  const ok = await tryStaticUrls([
    `/audio/words/${word.id}.wav`,
    `/audio/words/${word.id}.mp3`,
  ], mySession);
  if (ok) return;
  if (isCurrent(mySession)) await speakNativeMale(word.he, mySession);
};

export const playScene = async (scene) => {
  stop();
  const mySession = session;
  const ok = await tryStaticUrls([
    `/audio/scenes/${scene.id}.wav`,
    `/audio/scenes/${scene.id}.mp3`,
  ], mySession);
  if (ok) return;
  if (isCurrent(mySession)) await speakNativeMale(scene.sentence, mySession);
};

// Host commentary — takes a UI line ({id, text} from uiLines.js). Plays the
// parent recording or pre-baked clip; male native fallback; silence otherwise.
export const sayLine = async (line) => {
  if (!line) return;
  stop();
  const mySession = session;
  const ok = await tryStaticUrls([
    `/audio/ui/${line.id}.wav`,
    `/audio/ui/${line.id}.mp3`,
  ], mySession);
  if (ok) return;
  if (isCurrent(mySession)) await speakNativeMale(line.text, mySession);
};

// The studio calls this after saving a take so the old blob doesn't keep
// playing from the in-memory cache.
export const clearAudioCache = () => cache.clear();

export const stopAudio = stop;
