// Letter hunt: 9 floating bubbles, pop every bubble carrying the target glyph.
// Decoys are visually-confusable letters, so the game trains discrimination.
// Reused for base letters (letter nodes) and final forms (Story Mountain).

import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../lib/util.js';
import { sfxPop, sfxWrong, sfxComplete } from '../lib/sfx.js';

const BUBBLE_COUNT = 9;

const buildBubbles = (targetGlyph, decoyGlyphs, copies) => {
  const glyphs = [];
  for (let i = 0; i < copies; i++) glyphs.push({ glyph: targetGlyph, isTarget: true });
  for (let i = 0; glyphs.length < BUBBLE_COUNT; i++) {
    glyphs.push({ glyph: decoyGlyphs[i % decoyGlyphs.length], isTarget: false });
  }
  return shuffle(glyphs).map((g, i) => ({
    ...g,
    key: i,
    popped: false,
    wrong: false,
    bob: { delay: `${(i * 0.37) % 2}s`, duration: `${2.6 + (i % 4) * 0.5}s` },
  }));
};

export default function BubblePop({ prompt, targetGlyph, decoyGlyphs, copies = 3, playTarget, onDone }) {
  const [bubbles, setBubbles] = useState(() => buildBubbles(targetGlyph, decoyGlyphs, copies));
  const errorsRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finishedRef = useRef(false);

  useEffect(() => { playTarget?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = useMemo(() => bubbles.filter(b => b.isTarget && !b.popped).length, [bubbles]);

  useEffect(() => {
    if (remaining > 0 || finishedRef.current) return;
    finishedRef.current = true;
    sfxComplete();
    const score = copies / (copies + errorsRef.current);
    const t = setTimeout(() => onDoneRef.current?.(score), 900);
    return () => clearTimeout(t);
  }, [remaining, copies]);

  const tap = (key) => {
    setBubbles(prev => prev.map(b => {
      if (b.key !== key || b.popped) return b;
      if (b.isTarget) {
        sfxPop();
        return { ...b, popped: true };
      }
      errorsRef.current++;
      sfxWrong();
      return { ...b, wrong: true };
    }));
  };

  const clearWrong = (key) => {
    setBubbles(prev => prev.map(b => (b.key === key ? { ...b, wrong: false } : b)));
  };

  return (
    <div className="bubble-pop">
      <div className="activity-prompt">
        <button type="button" className="speaker-btn" onClick={() => playTarget?.()} aria-label="השמיעו שוב">🔊</button>
        <span>{prompt}</span>
      </div>
      <div className="bubble-pop__grid">
        {bubbles.map(b => (
          <button
            key={b.key}
            type="button"
            className={[
              'bubble',
              b.popped && 'bubble--popped',
              b.wrong && 'bubble--wrong',
            ].filter(Boolean).join(' ')}
            style={{ animationDelay: b.bob.delay, animationDuration: b.bob.duration }}
            onClick={() => tap(b.key)}
            onAnimationEnd={() => b.wrong && clearWrong(b.key)}
            disabled={b.popped}
          >
            <span className="bubble__glyph">{b.glyph}</span>
          </button>
        ))}
      </div>
      <div className="bubble-pop__count">
        {Array.from({ length: copies }, (_, i) => (
          <span key={i} className={`bubble-pop__pip ${i < copies - remaining ? 'bubble-pop__pip--on' : ''}`}>●</span>
        ))}
      </div>
    </div>
  );
}
