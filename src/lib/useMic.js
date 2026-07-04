// Web Speech API hook for kid-friendly Hebrew pronunciation practice.
//
// Usage:
//   const mic = useMic({ targets: ['אריה', 'arie'], onMatch: () => ... });
//   mic.supported   // boolean — false on Firefox / restricted contexts
//   mic.state       // 'idle' | 'listening' | 'matched' | 'wrong' | 'error'
//   mic.transcript  // last heard text
//   mic.toggle()    // start / stop listening
//   mic.reset()     // back to idle, clear transcript
//
// Matching is fuzzy:
//   - strips Hebrew nikud from both target and transcript
//   - lowercases for romanized targets
//   - allows 1 char of Levenshtein distance per ~3 chars of length

import { useCallback, useEffect, useRef, useState } from 'react';
import { stripNikud } from '../data/letters.js';
import { levenshtein } from './util.js';

const SR = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

const isHeb = (s) => /[֐-׿]/.test(s);

// Generous tolerance — kids' pronunciation is approximate and the recognizer
// itself is noisy. We'd rather pass a close-enough attempt than block the kid.
// 3-char target → 2 distance, 4 → 2, 5 → 3, 6 → 3, 8 → 4. Combined with the
// phonetic-normalization step below this lets things like "alef" / "ulef" /
// "aluf" all match a target of "alef".
const tolerance = (target) => Math.max(2, Math.ceil(target.length / 2));

// Collapse only consonants kids and the recognizer routinely confuse —
// vowels stay distinct so "hello" doesn't accidentally match "alef".
const PHONETIC_MAP = {
  // Hebrew — variants that share a phoneme post-nikud-strip
  'ש': 'ס', 'ת': 'ט', 'כ': 'ק',
  // Latin — collapse only similar consonants, leave vowels alone
  'q': 'k', 'c': 'k',
  'z': 's',
  'd': 't',
  'b': 'v', 'p': 'v', 'f': 'v',
  'j': 'y',
  // Silent-ish: drop h's and punctuation so "ah" can match "alef".
  'h': '',
  ' ': '', '-': '', "'": '', '"': '', '.': '', ',': '',
};
const phon = (s) => s.split('').map(c => PHONETIC_MAP[c] ?? c).join('');

const matches = (heard, targets) => {
  if (!heard) return false;
  const heardClean = stripNikud(heard).trim().toLowerCase();
  if (heardClean.length === 0) return false;
  const heardPhon  = phon(heardClean);
  for (const t of targets) {
    const targetClean = stripNikud(t).trim().toLowerCase();
    if (!targetClean) continue;
    const targetPhon = phon(targetClean);

    // 1. Exact / substring on the raw form.
    if (heardClean.includes(targetClean) || targetClean.includes(heardClean)) return true;

    // 2. Substring on the phonetic-normalized form.
    if (heardPhon && targetPhon && (heardPhon.includes(targetPhon) || targetPhon.includes(heardPhon))) return true;

    // 3. First two characters share + length within 50% — kid started right.
    if (targetClean.length >= 3 && heardClean.length >= 2
        && phon(heardClean.slice(0, 2)) === phon(targetClean.slice(0, 2))
        && Math.abs(heardClean.length - targetClean.length) <= Math.ceil(targetClean.length / 2)) return true;

    // 4. Levenshtein on raw clean strings.
    if (levenshtein(heardClean, targetClean) <= tolerance(targetClean)) return true;

    // 5. Levenshtein on phonetic-normalized strings — most tolerant pass.
    if (heardPhon && targetPhon && levenshtein(heardPhon, targetPhon) <= tolerance(targetPhon)) return true;

    // 6. Hebrew prefix tolerance (ה־, ב־, ל־).
    if (isHeb(targetClean) && heardClean.length > 1 && heardClean.slice(1) === targetClean) return true;
    if (isHeb(targetClean) && targetClean.length > 1 && targetClean.slice(1) === heardClean) return true;
  }
  return false;
};

export function useMic({ targets = [], onMatch, lang = 'he-IL' } = {}) {
  const [state, setState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const recRef = useRef(null);
  const targetsRef = useRef(targets);
  const onMatchRef = useRef(onMatch);
  targetsRef.current = targets;
  onMatchRef.current = onMatch;

  const supported = !!SR;

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    setState((s) => (s === 'listening' ? 'idle' : s));
  }, []);

  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setState('idle');
  }, [stop]);

  const start = useCallback(() => {
    if (!supported) { setState('error'); return; }
    stop();
    const r = new SR();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 3;
    let bestHeard = '';
    let matched = false;

    const tryMatch = (text) => {
      if (matches(text, targetsRef.current)) {
        matched = true;
        setState('matched');
        onMatchRef.current?.(text);
        try { r.stop(); } catch {}
      }
    };

    r.onresult = (ev) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        const candidates = [];
        for (let j = 0; j < result.length; j++) candidates.push(result[j].transcript);
        const top = candidates[0] ?? '';
        bestHeard = top;
        setTranscript(top);
        for (const c of candidates) tryMatch(c);
        if (matched) break;
      }
    };
    r.onerror = (e) => {
      // 'no-speech' / 'aborted' are normal; ignore. Otherwise show error state.
      if (e.error && !['no-speech', 'aborted'].includes(e.error)) setState('error');
    };
    r.onend = () => {
      recRef.current = null;
      setState((s) => {
        if (s === 'matched') return 'matched';
        // If we got something but it didn't match, show wrong; if nothing, return to idle
        return bestHeard ? 'wrong' : 'idle';
      });
    };

    try {
      r.start();
      recRef.current = r;
      setState('listening');
      setTranscript('');
    } catch {
      setState('error');
    }
  }, [lang, stop, supported]);

  const toggle = useCallback(() => {
    if (state === 'listening') stop();
    else start();
  }, [state, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { supported, state, transcript, start, stop, toggle, reset };
}
