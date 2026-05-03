import { useEffect, useMemo, useState } from 'react';
import { ALPHABET_BY_HEB } from '../data/alphabet.js';
import { playWord } from '../lib/audio.js';
import { shuffle, sample } from '../lib/util.js';
import { sayPraise, sayTryAgain } from '../lib/encourage.js';
import LetterTile from '../components/LetterTile.jsx';
import WordImage from '../components/WordImage.jsx';
import './Spelling.css';

const ROUNDS = 3;
const HINT_AFTER_MISTAKES = 3;

// "Spell the word": kid sees the photo + hears the word, and assembles the spelling
// from a tray of scrambled letters. Hebrew is RTL, so the build slot fills right→left.
//
// The next-empty slot pulses so non-Hebrew-readers see where to start. After 3 mistakes
// in a round, a "?" hint button appears that reveals the answer (round counts as 0).
//
// Score = correctRounds / totalRounds, with -0.15 per mistake (floored at 0).
export default function Spelling({ lesson, onDone }) {
  const rounds = useMemo(() => {
    const pool = lesson.spellableWords.length > 0 ? lesson.spellableWords : lesson.words;
    return sample(pool, Math.min(ROUNDS, pool.length));
  }, [lesson.id]);

  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [tray, setTray]     = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scoreSum, setScoreSum] = useState(0);

  const word = rounds[idx];

  useEffect(() => {
    setPlaced([]);
    setSolved(false);
    setRevealed(false);
    setMistakes(0);
    const distractors = sample(
      lesson.cumulativeLetters.filter(h => !word.letters.includes(h)),
      Math.max(0, 7 - word.letters.length),
    ).slice(0, 3);
    const all = shuffle([...word.letters, ...distractors]).map((l, i) => ({
      key: `${i}-${l}`,
      letter: l,
      used: false,
    }));
    setTray(all);
    const t = setTimeout(() => playWord(word), 350);
    return () => clearTimeout(t);
  }, [idx]);

  const completeRound = (roundScore) => {
    setSolved(true);
    setScoreSum(s => s + roundScore);
    if (roundScore > 0) setTimeout(() => sayPraise(), 200);
    setTimeout(() => playWord(word), 900);
    setTimeout(() => {
      if (idx + 1 >= rounds.length) {
        onDone(Math.min(1, (scoreSum + roundScore) / rounds.length));
      } else {
        setIdx(idx + 1);
      }
    }, 2000);
  };

  const tapTrayLetter = (item) => {
    if (item.used || solved) return;
    if (placed.length >= word.letters.length) return;
    const expected = word.letters[placed.length];
    if (item.letter === expected) {
      setPlaced(p => [...p, { letter: item.letter, trayKey: item.key }]);
      setTray(t => t.map(x => x.key === item.key ? { ...x, used: true } : x));
      if (placed.length + 1 >= word.letters.length) {
        completeRound(Math.max(0, 1 - mistakes * 0.15));
      }
    } else {
      setMistakes(m => m + 1);
      setTray(t => t.map(x => x.key === item.key ? { ...x, shake: true } : x));
      setTimeout(() => setTray(t => t.map(x => ({ ...x, shake: false }))), 400);
      // Quiet vocal cue, but only on alternating misses so it doesn't spam.
      if ((mistakes + 1) % 2 === 1) setTimeout(() => sayTryAgain(), 200);
    }
  };

  const undo = () => {
    if (solved || placed.length === 0) return;
    const last = placed[placed.length - 1];
    setPlaced(p => p.slice(0, -1));
    setTray(t => t.map(x => x.key === last.trayKey ? { ...x, used: false } : x));
  };

  const reveal = () => {
    if (solved) return;
    setRevealed(true);
    setPlaced(word.letters.map((l, i) => ({ letter: l, trayKey: `revealed-${i}` })));
    setTray(t => t.map(x => ({ ...x, used: true })));
    completeRound(0);
  };

  const showHint = !solved && mistakes >= HINT_AFTER_MISTAKES;
  const nextSlotIdx = placed.length;

  return (
    <div className="spelling">
      <div className="spelling__intro">
        <h2>בנו את המילה</h2>
        <div className="spelling__counter" dir="ltr">{idx + 1} / {rounds.length}</div>
      </div>

      {/* Tap the photo card to replay — same affordance as the Speak stage. */}
      <button className="spelling__hero" onClick={() => playWord(word)} aria-label="שמעו שוב">
        <div className="spelling__hero-image">
          <WordImage word={word} size="lg" rounded="lg" />
          <span className="spelling__replay-badge" aria-hidden>
            <SpeakerIcon />
          </span>
        </div>
      </button>

      <div className="spelling__direction" aria-hidden>
        <ArrowRtl />
        <span>מימין לשמאל</span>
        <ArrowRtl />
      </div>

      <div className={`spelling__build ${solved ? 'is-solved' : ''} ${revealed ? 'is-revealed' : ''}`}>
        {word.letters.map((expected, i) => {
          const p = placed[i];
          const isNext = !solved && i === nextSlotIdx;
          return (
            <div key={i} className={`spelling__slot ${isNext ? 'is-next' : ''}`}>
              {p ? (
                <LetterTile
                  letter={p.letter}
                  colorSlot={ALPHABET_BY_HEB[p.letter]?.color ?? 1}
                  size="md"
                  state={solved ? 'correct' : undefined}
                />
              ) : (
                <div className="spelling__placeholder" />
              )}
            </div>
          );
        })}
      </div>

      <div className="spelling__tray">
        {tray.map(item => (
          <LetterTile
            key={item.key}
            letter={item.letter}
            colorSlot={ALPHABET_BY_HEB[item.letter]?.color ?? 1}
            size="md"
            state={item.used ? 'placed' : item.shake ? 'wrong' : undefined}
            onClick={() => tapTrayLetter(item)}
            disabled={item.used || solved}
          />
        ))}
      </div>

      <div className="spelling__actions">
        <button className="btn btn--ghost btn--sm" onClick={undo} disabled={solved || placed.length === 0}>
          בטל
        </button>
        {showHint && (
          <button className="btn btn--soft btn--sm spelling__hint-btn" onClick={reveal}>
            ? הראו תשובה
          </button>
        )}
      </div>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5L7 9H4a1 1 0 0 0-1 1z"/>
      <path d="M16 8.5a4 4 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function ArrowRtl() {
  // Visual arrow pointing left — the direction of writing in Hebrew (right→left).
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5M11 19l-7-7 7-7"/>
    </svg>
  );
}
