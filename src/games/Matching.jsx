import { useEffect, useMemo, useState } from 'react';
import { ALPHABET_BY_HEB } from '../data/alphabet.js';
import { playLetter } from '../lib/audio.js';
import { shuffle } from '../lib/util.js';
import LetterTile from '../components/LetterTile.jsx';
import './Matching.css';

// Match letter chips (right column) to their letter names (left column).
// Tap a letter, then tap its name. Lights up green/red. Finish when all matched.
//
// Score = correct / (correct + mistakes).
export default function Matching({ lesson, onDone }) {
  const items = useMemo(() => {
    // Use up to 6 letters from this lesson's cumulative set, biased to the new ones.
    const cumulative = lesson.cumulativeLetters.map(h => ALPHABET_BY_HEB[h]);
    const newOnes = lesson.letters;
    const seen = new Set(newOnes.map(l => l.id));
    const fillers = cumulative.filter(l => !seen.has(l.id));
    const picked = shuffle([...newOnes, ...shuffle(fillers).slice(0, Math.max(0, 6 - newOnes.length))]);
    return picked.slice(0, 6);
  }, [lesson.id]);

  const [letters] = useState(() => shuffle(items));
  const [names] = useState(() => shuffle(items));

  const [pickedLetter, setPickedLetter] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null); // { letter, name }
  const [mistakes, setMistakes] = useState(0);

  const isDone = matched.size === items.length;

  useEffect(() => {
    if (isDone) {
      const score = items.length / (items.length + mistakes);
      const t = setTimeout(() => onDone(score), 600);
      return () => clearTimeout(t);
    }
  }, [isDone]);

  const tapLetter = (letter) => {
    if (matched.has(letter.id)) return;
    setPickedLetter(letter.id);
    playLetter(letter.id);
  };

  const tapName = (letter) => {
    if (!pickedLetter || matched.has(letter.id)) return;
    if (pickedLetter === letter.id) {
      const next = new Set(matched); next.add(letter.id);
      setMatched(next);
      setPickedLetter(null);
    } else {
      setWrong({ letter: pickedLetter, name: letter.id });
      setMistakes(m => m + 1);
      setTimeout(() => {
        setWrong(null);
        setPickedLetter(null);
      }, 500);
    }
  };

  return (
    <div className="matching">
      <div className="matching__intro">
        <h2>התאימו אותיות לשמות</h2>
        <p className="muted">לחצו על אות, אחר כך על השם שלה</p>
      </div>

      <div className="matching__grid">
        <div className="matching__col">
          {letters.map(l => {
            const isMatched = matched.has(l.id);
            const isPicked  = pickedLetter === l.id;
            const isWrong   = wrong?.letter === l.id;
            return (
              <LetterTile
                key={`L-${l.id}`}
                letter={l.heb}
                colorSlot={l.color}
                size="md"
                state={isMatched ? 'placed' : isWrong ? 'wrong' : isPicked ? 'selected' : undefined}
                onClick={() => tapLetter(l)}
                disabled={isMatched}
              />
            );
          })}
        </div>
        <div className="matching__col">
          {names.map(l => {
            const isMatched = matched.has(l.id);
            const isWrong   = wrong?.name === l.id;
            return (
              <button
                key={`N-${l.id}`}
                className={`matching__name ${isMatched ? 'is-matched' : ''} ${isWrong ? 'is-wrong' : ''}`}
                onClick={() => tapName(l)}
                disabled={isMatched}
              >
                <span className="matching__name-he">{l.nameHe}</span>
                <span className="matching__name-en">{l.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="matching__footer muted">
        {matched.size} / {items.length}
      </div>
    </div>
  );
}
