// Word lab: hear a word, see its picture, build it from letter tiles.
// Slots follow the bare spelling (including final forms — so ים is built with
// a real ם). Tray holds the word's letters plus a few decoys from letters the
// kid has already learned. Two wrong taps in a row pulse the correct tile.

import { useEffect, useMemo, useRef, useState } from 'react';
import { playWord, stopAudio } from '../lib/audio.js';
import { sample, shuffle } from '../lib/util.js';
import { sfxFlip, sfxComplete, sfxWrong } from '../lib/sfx.js';
import WordCard from '../components/WordCard.jsx';
import ProgressDots from '../components/ProgressDots.jsx';

const MAX_ROUNDS = 4;

const buildRound = (word, world) => {
  const target = word.bare.split('');
  const decoyPool = world.cumulativeLetters.map(l => l.heb).filter(g => !target.includes(g));
  const decoys = sample(decoyPool, target.length <= 3 ? 3 : 2);
  const tiles = shuffle([...target, ...decoys]).map((glyph, i) => ({ key: i, glyph, used: false, wrong: false }));
  return { word, target, tiles, filled: 0 };
};

export default function WordBuilder({ world, onDone }) {
  const words = useMemo(() => shuffle(world.words).slice(0, MAX_ROUNDS), [world]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [round, setRound] = useState(() => buildRound(words[0], world));
  const [hintKey, setHintKey] = useState(null);
  const errorsRef = useRef(0);
  const lettersRef = useRef(0);
  const wrongStreakRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    playWord(round.word);
    return stopAudio;
  }, [roundIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const complete = round.filled >= round.target.length;

  useEffect(() => {
    if (!complete) return;
    sfxComplete();
    playWord(round.word);
    const t = setTimeout(() => {
      if (roundIdx + 1 >= words.length) {
        const total = lettersRef.current;
        onDoneRef.current?.(total / (total + errorsRef.current));
      } else {
        const next = roundIdx + 1;
        setRoundIdx(next);
        setRound(buildRound(words[next], world));
        setHintKey(null);
        wrongStreakRef.current = 0;
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [complete]); // eslint-disable-line react-hooks/exhaustive-deps

  const tapTile = (key) => {
    if (complete) return;
    const tile = round.tiles.find(t => t.key === key);
    if (!tile || tile.used) return;
    const expected = round.target[round.filled];
    if (tile.glyph === expected) {
      sfxFlip();
      lettersRef.current++;
      wrongStreakRef.current = 0;
      setHintKey(null);
      setRound(r => ({
        ...r,
        filled: r.filled + 1,
        tiles: r.tiles.map(t => (t.key === key ? { ...t, used: true, wrong: false } : t)),
      }));
    } else {
      sfxWrong();
      errorsRef.current++;
      if (++wrongStreakRef.current >= 2) {
        const correct = round.tiles.find(t => !t.used && t.glyph === expected);
        if (correct) setHintKey(correct.key);
      }
      setRound(r => ({
        ...r,
        tiles: r.tiles.map(t => (t.key === key ? { ...t, wrong: true } : t)),
      }));
    }
  };

  const clearWrong = (key) => {
    setRound(r => ({ ...r, tiles: r.tiles.map(t => (t.key === key ? { ...t, wrong: false } : t)) }));
  };

  return (
    <div className="word-builder">
      <ProgressDots total={words.length} done={roundIdx + (complete ? 1 : 0)} />
      <div className="activity-prompt">
        <button type="button" className="speaker-btn" onClick={() => playWord(round.word)} aria-label="השמיעו שוב">🔊</button>
        <span>בּוֹנִים אֶת הַמִּלָּה!</span>
      </div>

      <WordCard word={round.word} size="md" onClick={() => playWord(round.word)} />

      <div className={`word-builder__slots ${complete ? 'word-builder__slots--done' : ''}`}>
        {round.target.map((glyph, i) => (
          <div key={i} className={`slot ${i < round.filled ? 'slot--filled' : ''} ${i === round.filled ? 'slot--next' : ''}`}>
            {i < round.filled ? glyph : ''}
          </div>
        ))}
      </div>

      <div className="word-builder__tray">
        {round.tiles.map(tile => (
          <button
            key={tile.key}
            type="button"
            className={[
              'tile',
              tile.used && 'tile--used',
              tile.wrong && 'tile--wrong shake',
              hintKey === tile.key && 'tile--hint',
            ].filter(Boolean).join(' ')}
            onClick={() => tapTile(tile.key)}
            onAnimationEnd={() => tile.wrong && clearWrong(tile.key)}
            disabled={tile.used || complete}
          >
            {tile.glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
