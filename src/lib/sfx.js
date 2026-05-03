// Synthesized sound effects via Web Audio API. No audio files — small,
// instant, and consistent across devices. Volume is intentionally gentle
// (peak gain 0.18) so it sits behind the host voice without competing.
//
// AudioContext is created lazily on first use because some browsers throw if
// it's instantiated before a user gesture.

let ctx = null;

const ensureContext = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // If the page hasn't had a user gesture yet, the context will be in 'suspended'.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

// Schedule a single tone at offset `at` (seconds from now).
const scheduleTone = (freq, duration, at = 0, { type = 'sine', peak = 0.18 } = {}) => {
  const c = ensureContext();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + at);
  osc.connect(gain).connect(c.destination);

  const start = c.currentTime + at;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
};

// ---- Public effects ------------------------------------------------------

// Quick rising two-note "ding" — used on correct answers.
export const sfxCorrect = () => {
  scheduleTone(660, 0.12, 0,    { type: 'triangle' });
  scheduleTone(880, 0.18, 0.08, { type: 'triangle' });
};

// Soft descending two-note "uh-oh" — used on a miss. Quiet so it doesn't sting.
export const sfxWrong = () => {
  scheduleTone(330, 0.12, 0,    { type: 'sine', peak: 0.12 });
  scheduleTone(247, 0.18, 0.08, { type: 'sine', peak: 0.12 });
};

// Major-triad chord arpeggio — used on lesson complete. Stays under 1s.
export const sfxComplete = () => {
  scheduleTone(523, 0.18, 0,    { type: 'triangle' }); // C5
  scheduleTone(659, 0.18, 0.10, { type: 'triangle' }); // E5
  scheduleTone(784, 0.30, 0.20, { type: 'triangle' }); // G5
  scheduleTone(1047, 0.4, 0.32, { type: 'triangle', peak: 0.22 }); // C6 — the cap
};

// Short chirp — used when the mic opens for listening.
export const sfxMicOpen = () => {
  scheduleTone(1100, 0.05, 0,    { type: 'sine', peak: 0.10 });
  scheduleTone(1500, 0.08, 0.04, { type: 'sine', peak: 0.10 });
};

// Distinct chime — used the moment the mic recognises a correct word.
export const sfxMicMatch = () => {
  scheduleTone(880, 0.10, 0,    { type: 'triangle' });
  scheduleTone(1320, 0.18, 0.08, { type: 'triangle' });
};
