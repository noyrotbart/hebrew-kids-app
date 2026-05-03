import { useEffect, useState } from 'react';
import { playLetter, playWord } from '../lib/audio.js';
import { LETTER_COLOR } from '../data/alphabet.js';
import LetterTile from '../components/LetterTile.jsx';
import WordImage from '../components/WordImage.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import Button from '../components/Button.jsx';
import './Flashcards.css';

// Pedagogy: introduce each new letter of the lesson with its sound + an example word
// (using a real photo + the word's recorded audio). Auto-plays the letter sound on entry.
//
// Reports score = 1.0 (this is a learn-only stage; effort is rewarded).
export default function Flashcards({ lesson, onDone }) {
  const cards = lesson.letters.map(letter => ({
    letter,
    word: lesson.words.find(w => w.letters.includes(letter.heb)) ?? lesson.words[0],
  }));

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx];

  useEffect(() => {
    setFlipped(false);
    const t = setTimeout(() => playLetter(card.letter.id), 250);
    return () => clearTimeout(t);
  }, [idx]);

  const next = () => {
    if (idx + 1 >= cards.length) onDone(1);
    else setIdx(idx + 1);
  };

  return (
    <div className="flashcards">
      <div className="flashcards__intro">
        <h2>אות חדשה</h2>
        <p className="muted">לחצו על הכרטיס כדי לראות מילה</p>
      </div>

      <button
        className={`flashcards__card ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        aria-label="הפוך כרטיס"
      >
        <div className="flashcards__face flashcards__face--front" style={{ '--c': LETTER_COLOR(card.letter.color) }}>
          <div className="flashcards__nameHe">{card.letter.nameHe}</div>
          {card.letter.final && (
            <div className="flashcards__final">
              <span className="muted">בסוף מילה:</span>
              <span className="heb-display">{card.letter.final}</span>
            </div>
          )}
          <div className="flashcards__glyph heb-display">{card.letter.heb}</div>
          <div className="flashcards__sound">{card.letter.sound !== '—' ? `נשמעת ${card.letter.sound}` : 'אות שקטה'}</div>
          <div className="flashcards__nameEn">{card.letter.nameEn}</div>
        </div>
        <div className="flashcards__face flashcards__face--back">
          <WordImage word={card.word} size="lg" rounded="lg" />
          <div className="flashcards__word heb-display">{card.word.he}</div>
          <div className="flashcards__roman">{card.word.roman} — {card.word.en}</div>
        </div>
      </button>

      <div className="flashcards__actions">
        <SpeakButton
          label={flipped ? 'שמעו את המילה' : 'שמעו את האות'}
          size="lg"
          onClick={() => flipped ? playWord(card.word) : playLetter(card.letter.id)}
        />
        <Button variant="accent" size="lg" full onClick={next}>
          {idx + 1 >= cards.length ? 'הבא' : `אות ${idx + 2} מתוך ${cards.length}`}
        </Button>
      </div>

      <div className="flashcards__dots">
        {cards.map((_, i) => (
          <span key={i} className={`dot ${i === idx ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
