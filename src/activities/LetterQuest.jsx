// A letter node: three quick phases — meet the letter (big card, audio,
// example word with the letter highlighted), trace it, then hunt it among
// look-alike bubbles. Node score = mean of trace + hunt.

import { useEffect, useMemo, useState } from 'react';
import { LETTER_COLOR } from '../data/letters.js';
import { WORDS_BY_ID } from '../data/words.js';
import { playLetter, playWord, stopAudio } from '../lib/audio.js';
import { sample } from '../lib/util.js';
import WordCard from '../components/WordCard.jsx';
import ProgressDots from '../components/ProgressDots.jsx';
import LetterTrace from './LetterTrace.jsx';
import BubblePop from './BubblePop.jsx';

// Split a nikud-ed string into base-char clusters so we can highlight the
// target letter without breaking the vowel marks off their consonants.
const clusterize = (s) => {
  const out = [];
  for (const ch of s) {
    if (/[֑-ׇ]/.test(ch) && out.length) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
};

export default function LetterQuest({ world, letter, onDone }) {
  const [phase, setPhase] = useState(0); // 0 meet, 1 trace, 2 pop
  const [scores, setScores] = useState([]);
  const word = WORDS_BY_ID[letter.wordId];
  const color = LETTER_COLOR(letter.color);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await playLetter(letter.id);
      if (!cancelled) await playWord(word);
    })();
    return () => { cancelled = true; stopAudio(); };
  }, [letter.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const decoys = useMemo(() => {
    const pool = world.cumulativeLetters
      .map(l => l.heb)
      .filter(g => g !== letter.heb && !letter.similar.includes(g));
    return [...letter.similar, ...sample(pool, 3)];
  }, [world, letter]);

  const advance = (score) => {
    const next = [...scores, score];
    if (phase === 2) {
      const graded = next.filter(s => s != null);
      onDone(graded.reduce((s, v) => s + v, 0) / Math.max(1, graded.length));
      return;
    }
    setScores(next);
    setPhase(phase + 1);
  };

  return (
    <div className="letter-quest">
      <ProgressDots total={3} done={phase} />

      {phase === 0 && (
        <div className="letter-meet">
          <button
            type="button"
            className="letter-meet__tile"
            style={{ background: color }}
            onClick={() => playLetter(letter.id)}
            aria-label={`השמיעו את האות ${letter.nameEn}`}
          >
            {letter.heb}
          </button>
          <div className="letter-meet__name">{letter.nameHe}</div>
          <div className="letter-meet__sound">{letter.sound}</div>
          {letter.final && (
            <div className="letter-meet__final">בְּסוֹף מִלָּה: <b>{letter.final}</b></div>
          )}
          <button type="button" className="letter-meet__word" onClick={() => playWord(word)}>
            <WordCard word={word} size="sm" />
            <div className="letter-meet__word-text">
              {clusterize(word.he).map((cluster, i) => (
                <span
                  key={i}
                  style={cluster[0] === letter.heb || cluster[0] === letter.final ? { color } : undefined}
                  className={cluster[0] === letter.heb || cluster[0] === letter.final ? 'letter-meet__hl' : undefined}
                >
                  {cluster}
                </span>
              ))}
            </div>
          </button>
          <button type="button" className="big-btn big-btn--primary" onClick={() => advance(null)}>
            מַמְשִׁיכִים! ←
          </button>
        </div>
      )}

      {phase === 1 && (
        <div className="letter-quest__phase">
          <div className="activity-prompt">
            <span>עַכְשָׁו כּוֹתְבִים אֶת {letter.nameHe}!</span>
          </div>
          <LetterTrace glyph={letter.heb} color={color} onDone={advance} />
        </div>
      )}

      {phase === 2 && (
        <BubblePop
          prompt={<>מִצְאוּ אֶת הָאוֹת <b style={{ color }}>{letter.heb}</b></>}
          targetGlyph={letter.heb}
          decoyGlyphs={decoys}
          playTarget={() => playLetter(letter.id)}
          onDone={advance}
        />
      )}
    </div>
  );
}
