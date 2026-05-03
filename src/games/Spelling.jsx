import { useEffect, useMemo, useState } from 'react';
import { ALPHABET_BY_HEB } from '../data/alphabet.js';
import { playWord } from '../lib/audio.js';
import { shuffle, sample } from '../lib/util.js';
import LetterTile from '../components/LetterTile.jsx';
import WordImage from '../components/WordImage.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import './Spelling.css';

const ROUNDS = 3;

// "Spell the word": kid sees the photo + hears the word, and assembles the spelling
// from a tray of scrambled letters. Hebrew is RTL, so the build slot fills right→left.
//
// Score = correctRounds / totalRounds, with -0.1 per mistake (floored at 0).
export default function Spelling({ lesson, onDone }) {
  const rounds = useMemo(() => {
    const pool = lesson.spellableWords.length > 0 ? lesson.spellableWords : lesson.words;
    return sample(pool, Math.min(ROUNDS, pool.length));
  }, [lesson.id]);

  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);   // array of { letter, trayKey }
  const [tray, setTray]     = useState([]);   // { key, letter, used }
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [scoreSum, setScoreSum] = useState(0);

  const word = rounds[idx];

  useEffect(() => {
    setPlaced([]);
    setSolved(false);
    // Build the tray: word letters + 3 random distractors from the cumulative letters
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

  const tapTrayLetter = (item) => {
    if (item.used || solved) return;
    if (placed.length >= word.letters.length) return;
    const expected = word.letters[placed.length];
    if (item.letter === expected) {
      setPlaced(p => [...p, { letter: item.letter, trayKey: item.key }]);
      setTray(t => t.map(x => x.key === item.key ? { ...x, used: true } : x));
      // Check completion:
      if (placed.length + 1 >= word.letters.length) {
        setSolved(true);
        const round = Math.max(0, 1 - mistakes * 0.15);
        setScoreSum(s => s + round);
        setTimeout(() => playWord(word), 250);
        setTimeout(() => {
          if (idx + 1 >= rounds.length) {
            onDone(Math.min(1, (scoreSum + round) / rounds.length));
          } else {
            setMistakes(0);
            setIdx(idx + 1);
          }
        }, 1400);
      }
    } else {
      setMistakes(m => m + 1);
      // Shake the tray item briefly
      setTray(t => t.map(x => x.key === item.key ? { ...x, shake: true } : x));
      setTimeout(() => setTray(t => t.map(x => ({ ...x, shake: false }))), 400);
    }
  };

  const undo = () => {
    if (solved || placed.length === 0) return;
    const last = placed[placed.length - 1];
    setPlaced(p => p.slice(0, -1));
    setTray(t => t.map(x => x.key === last.trayKey ? { ...x, used: false } : x));
  };

  return (
    <div className="spelling">
      <div className="spelling__intro">
        <h2>בנו את המילה</h2>
        <p className="muted">לפי הסדר: מימין לשמאל</p>
      </div>

      <div className="spelling__hero">
        <WordImage word={word} size="lg" rounded="lg" />
        <div className="spelling__hint muted">{word.en}</div>
        <SpeakButton size="md" label="שמעו שוב" onClick={() => playWord(word)} />
      </div>

      <div className={`spelling__build ${solved ? 'is-solved' : ''}`}>
        {word.letters.map((expected, i) => {
          const p = placed[i];
          return (
            <div key={i} className="spelling__slot">
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
        <button className="btn btn--ghost btn--md" onClick={undo} disabled={solved || placed.length === 0}>
          בטל
        </button>
        <span className="muted">שיעור {idx + 1} / {rounds.length}</span>
      </div>
    </div>
  );
}
