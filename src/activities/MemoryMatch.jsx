// Memory, rebuilt as a proper learning game:
//   letter pairs — the letter glyph matches the PICTURE of its example word
//                  (א ↔ photo of אבא): pure sound-association, no reading needed
//   word pairs   — a picture matches its WRITTEN word: a real reading task
// Every flip speaks the card (letter name or word), so even a miss teaches
// something. A letter match replays "א... אבא!" as a mini echo. Example words
// are excluded from the word-pair pool so no two cards look alike.

import { useEffect, useMemo, useRef, useState } from 'react';
import { LETTER_COLOR } from '../data/letters.js';
import { WORDS_BY_ID } from '../data/words.js';
import { playLetter, playWord, stopAudio } from '../lib/audio.js';
import { sample, shuffle } from '../lib/util.js';
import { sfxCorrect, sfxComplete } from '../lib/sfx.js';
import { celebrate } from '../lib/celebrate.js';
import WordCard from '../components/WordCard.jsx';

const TOTAL_PAIRS = 6;

const buildCards = (world) => {
  const cards = [];
  const letters = sample(world.letters, Math.min(3, world.letters.length));
  const usedWordIds = new Set();

  for (const letter of letters) {
    const word = WORDS_BY_ID[letter.wordId];
    usedWordIds.add(word.id);
    cards.push({ kind: 'letter', matchKey: `letter:${letter.id}`, letter, word });
    cards.push({ kind: 'photo', matchKey: `letter:${letter.id}`, letter, word });
  }

  const pool = world.allWords.filter(w => !usedWordIds.has(w.id));
  const words = sample(pool, Math.min(TOTAL_PAIRS - letters.length, pool.length));
  for (const word of words) {
    cards.push({ kind: 'photo', matchKey: `word:${word.id}`, word });
    cards.push({ kind: 'text', matchKey: `word:${word.id}`, word });
  }

  return shuffle(cards).map((c, i) => ({ ...c, key: i, up: false, matched: false }));
};

// A flip speaks the card; a letter-pair match replays letter → word.
const speakCard = async (card) => {
  if (card.kind === 'letter') await playLetter(card.letter.id);
  else await playWord(card.word);
};

const speakMatch = async (card) => {
  if (card.letter) {
    await playLetter(card.letter.id);
    await playWord(card.word);
  } else {
    await playWord(card.word);
  }
};

export default function MemoryMatch({ world, onDone }) {
  const [cards, setCards] = useState(() => buildCards(world));
  const [lock, setLock] = useState(false);
  const firstRef = useRef(null);
  const attemptsRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => stopAudio, []);

  const totalPairs = cards.length / 2;
  const matchedPairs = cards.filter(c => c.matched).length / 2;

  useEffect(() => {
    if (matchedPairs < totalPairs) return;
    sfxComplete();
    celebrate('small');
    const score = Math.min(1, totalPairs / Math.max(totalPairs, attemptsRef.current));
    const t = setTimeout(() => onDoneRef.current?.(score), 1400);
    return () => clearTimeout(t);
  }, [matchedPairs, totalPairs]);

  const flip = (key) => {
    if (lock) return;
    const card = cards.find(c => c.key === key);
    if (!card || card.up || card.matched) return;

    if (firstRef.current == null) {
      firstRef.current = key;
      speakCard(card);
      setCards(prev => prev.map(c => (c.key === key ? { ...c, up: true } : c)));
      return;
    }

    const first = cards.find(c => c.key === firstRef.current);
    firstRef.current = null;
    attemptsRef.current++;
    setCards(prev => prev.map(c => (c.key === key ? { ...c, up: true } : c)));

    if (first.matchKey === card.matchKey) {
      sfxCorrect();
      speakMatch(card);
      setCards(prev => prev.map(c =>
        c.matchKey === card.matchKey ? { ...c, matched: true, up: true } : c
      ));
    } else {
      speakCard(card);
      setLock(true);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.key === key || c.key === first.key ? { ...c, up: false } : c
        ));
        setLock(false);
      }, 750);
    }
  };

  return (
    <div className="memory">
      <div className="activity-prompt"><span>מִצְאוּ אֶת הַזּוּגוֹת!</span></div>
      <div className="memory__grid">
        {cards.map(card => (
          <button
            key={card.key}
            type="button"
            className={[
              'mem-card',
              (card.up || card.matched) && 'mem-card--up',
              card.matched && 'mem-card--matched',
            ].filter(Boolean).join(' ')}
            onClick={() => flip(card.key)}
            aria-label={card.up ? undefined : 'קלף הפוך'}
          >
            <span className="mem-card__face mem-card__face--back">{world.emoji}</span>
            <span className="mem-card__face mem-card__face--front">
              {card.kind === 'letter' && (
                <span className="mem-card__glyph" style={{ color: LETTER_COLOR(card.letter.color) }}>
                  {card.letter.heb}
                </span>
              )}
              {card.kind === 'photo' && (
                <>
                  <WordCard word={card.word} size="fill" />
                  {card.matched && card.letter && (
                    <span className="mem-card__badge" style={{ background: LETTER_COLOR(card.letter.color) }}>
                      {card.letter.heb}
                    </span>
                  )}
                </>
              )}
              {card.kind === 'text' && <span className="mem-card__word">{card.word.bare}</span>}
            </span>
          </button>
        ))}
      </div>
      <div className="memory__pips">
        {Array.from({ length: totalPairs }, (_, i) => (
          <span key={i} className={`bubble-pop__pip ${i < matchedPairs ? 'bubble-pop__pip--on' : ''}`}>●</span>
        ))}
      </div>
    </div>
  );
}
