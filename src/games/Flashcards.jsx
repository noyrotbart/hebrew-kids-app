import { useEffect, useState } from 'react';
import { playLetter, playWord } from '../lib/audio.js';
import { LETTER_COLOR } from '../data/alphabet.js';
import { WORDS_BY_ID } from '../data/words.js';
import { useMic } from '../lib/useMic.js';
import { stripNikud } from '../data/alphabet.js';
import { sayPraise, sayTryAgain } from '../lib/encourage.js';
import WordImage from '../components/WordImage.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import MicButton from '../components/MicButton.jsx';
import Button from '../components/Button.jsx';
import './Flashcards.css';

// Pedagogy: introduce each new letter of the lesson with its sound + an example word
// (using a real photo + the word's recorded audio). Auto-plays the letter sound on entry.
//
// Reports score = 1.0 (this is a learn-only stage; effort is rewarded).
export default function Flashcards({ lesson, onDone }) {
  // Each letter pins its own canonical example word — no more brittle lesson.words.find()
  // that would land on degenerate picks like ב → אבא.
  const cards = lesson.letters.map(letter => ({
    letter,
    word: WORDS_BY_ID[letter.wordId],
  })).filter(c => c.word);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx];

  // Mic listens automatically: after the letter is spoken, the recognizer fires
  // with no tap required. Saying the letter correctly auto-flips the card and
  // unlocks the example word, with vocal praise — the speech IS the interaction.
  const targets = card ? [card.letter.nameEn.toLowerCase(), stripNikud(card.letter.nameHe)] : [];
  const mic = useMic({
    targets,
    onMatch: () => {
      setTimeout(() => sayPraise(), 250);
      setTimeout(() => setFlipped(true), 700);
    },
  });

  // Auto-play the letter audio, then auto-start the mic. Cancellation guard so
  // a fast "next" doesn't leave a stray mic.start() pointing at the old card.
  // Audio failures (cold-starts, network) MUST NOT block the mic — the kid
  // can still try to say the letter even if the host audio glitched.
  useEffect(() => {
    setFlipped(false);
    mic.reset();
    let cancelled = false;
    const t = setTimeout(async () => {
      if (cancelled) return;
      try { await playLetter(card.letter.id); } catch {}
      if (cancelled) return;
      // Brief pause so the kid hears silence between "letter audio" and "your turn".
      setTimeout(() => { if (!cancelled) mic.start(); }, 350);
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [idx]);

  // When the card flips to the back face, auto-play the example word.
  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => playWord(card.word), 600);
      return () => clearTimeout(t);
    }
  }, [flipped, idx]);

  // If mic registered something but it didn't match, give one quiet "נסה שוב" cue
  // — without restarting automatically (kid taps to retry on their own pace).
  useEffect(() => {
    if (mic.state === 'wrong') sayTryAgain();
  }, [mic.state]);

  const next = () => {
    mic.stop();
    if (idx + 1 >= cards.length) onDone(1);
    else setIdx(idx + 1);
  };

  const matchedLetter = mic.state === 'matched';

  return (
    <div className="flashcards">
      <div className="flashcards__intro">
        <h2>{flipped ? 'מילה לדוגמה' : 'אות חדשה'}</h2>
        <div className="flashcards__counter" dir="ltr">{idx + 1} / {cards.length}</div>
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
              <span>בסוף מילה:</span>
              <span className="heb-display">{card.letter.final}</span>
            </div>
          )}
          <div className="flashcards__glyph heb-display">{card.letter.heb}</div>
          <div className="flashcards__sound">{card.letter.sound !== '—' ? `נשמעת ${card.letter.sound}` : 'אות שקטה'}</div>
          <div className="flashcards__flip-hint" aria-hidden>↻</div>
        </div>
        <div className="flashcards__face flashcards__face--back">
          <WordImage word={card.word} size="lg" rounded="lg" />
          <div className="flashcards__word heb-display">{card.word.he}</div>
        </div>
      </button>

      <div className="flashcards__actions">
        {mic.supported && !flipped ? (
          <div className="flashcards__mic-hero">
            <MicButton
              size="lg"
              state={mic.state}
              transcript={mic.transcript}
              hint={mic.state === 'wrong' ? 'נסו שוב' : 'אמרו אחרי'}
              onClick={mic.toggle}
            />
            <button className="flashcards__listen-link" onClick={() => playLetter(card.letter.id)} aria-label="שמעו שוב">
              <SpeakerIcon /> שמעו שוב
            </button>
          </div>
        ) : (
          <div className="flashcards__actions-row">
            <SpeakButton
              label={flipped ? 'שמעו מילה' : 'שמעו אות'}
              size="md"
              onClick={() => flipped ? playWord(card.word) : playLetter(card.letter.id)}
            />
          </div>
        )}
        <Button
          variant={matchedLetter ? 'accent' : 'primary'}
          size="lg"
          full
          onClick={next}
          aria-label={idx + 1 >= cards.length ? 'הבא' : 'הבא'}
        >
          {matchedLetter ? '🎉 ' : ''}
          {idx + 1 >= cards.length ? 'סיימתי' : 'המשך'}
          <ArrowIcon />
        </Button>
      </div>

      <div className="flashcards__dots">
        {cards.map((_, i) => (
          <span key={i} className={`dot ${i === idx ? 'on' : i < idx ? 'done' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5L7 9H4a1 1 0 0 0-1 1z"/>
    </svg>
  );
}

function ArrowIcon() {
  // Arrow points "forward" in RTL — visually leftward
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5M11 19l-7-7 7-7"/>
    </svg>
  );
}
