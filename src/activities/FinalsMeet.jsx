// Story Mountain, node 1: the five final forms (אותיות סופיות).
// Phase 1 — meet each pair: base glyph morphs into its final, with an example
// word whose last letter is the final form, highlighted.
// Phase 2 — two bubble hunts: find the final among its base form + friends.

import { useEffect, useMemo, useRef, useState } from 'react';
import { FINAL_FORMS } from '../data/worlds.js';
import { WORDS_BY_ID } from '../data/words.js';
import { ALPHABET_BY_ID, LETTER_COLOR } from '../data/letters.js';
import { playWord, sayLine, stopAudio } from '../lib/audio.js';
import { finalLine } from '../data/uiLines.js';
import { sample, shuffle } from '../lib/util.js';
import WordCard from '../components/WordCard.jsx';
import ProgressDots from '../components/ProgressDots.jsx';
import BubblePop from './BubblePop.jsx';

export default function FinalsMeet({ onDone }) {
  const [phase, setPhase] = useState('meet'); // meet | hunt
  const [cardIdx, setCardIdx] = useState(0);
  const [huntIdx, setHuntIdx] = useState(0);
  const huntScoresRef = useRef([]);
  const hunts = useMemo(() => sample(FINAL_FORMS, 2), []);

  const final = FINAL_FORMS[cardIdx];
  const word = WORDS_BY_ID[final.exampleWordId];
  const color = LETTER_COLOR(ALPHABET_BY_ID[final.baseId].color);

  useEffect(() => {
    if (phase !== 'meet') return;
    let cancelled = false;
    (async () => {
      await sayLine(finalLine(final.baseId));
      if (!cancelled) await playWord(word);
    })();
    return () => { cancelled = true; stopAudio(); };
  }, [cardIdx, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextCard = () => {
    if (cardIdx + 1 >= FINAL_FORMS.length) setPhase('hunt');
    else setCardIdx(cardIdx + 1);
  };

  const huntDone = (score) => {
    huntScoresRef.current.push(score);
    if (huntIdx + 1 >= hunts.length) {
      const s = huntScoresRef.current;
      onDone(s.reduce((a, b) => a + b, 0) / s.length);
    } else {
      setHuntIdx(huntIdx + 1);
    }
  };

  if (phase === 'hunt') {
    const f = hunts[huntIdx];
    const others = FINAL_FORMS.filter(x => x !== f);
    return (
      <div className="finals">
        <ProgressDots total={hunts.length} done={huntIdx} />
        <BubblePop
          key={f.final}
          prompt={<>מִצְאוּ אֶת <b>{f.nameHe}</b> ({f.final})</>}
          targetGlyph={f.final}
          decoyGlyphs={shuffle([f.base, f.base, f.base, ...sample(others, 3).map(x => x.final)])}
          playTarget={() => sayLine(finalLine(f.baseId))}
          onDone={huntDone}
        />
      </div>
    );
  }

  const bareChars = word.bare.split('');
  return (
    <div className="finals">
      <ProgressDots total={FINAL_FORMS.length} done={cardIdx} />
      <div className="activity-prompt"><span>אוֹת מִשְׁתַּנָּה בְּסוֹף מִלָּה!</span></div>

      <button type="button" className="finals__pair" onClick={() => sayLine(finalLine(final.baseId))}>
        <span className="finals__glyph" style={{ background: color }}>{final.base}</span>
        <span className="finals__arrow">←</span>
        <span className="finals__glyph finals__glyph--final" style={{ background: color }}>{final.final}</span>
      </button>
      <div className="finals__name">{final.nameHe}</div>

      <button type="button" className="letter-meet__word" onClick={() => playWord(word)}>
        <WordCard word={word} size="sm" />
        <div className="letter-meet__word-text">
          {bareChars.map((ch, i) => (
            <span key={i} className={ch === final.final ? 'letter-meet__hl' : undefined} style={ch === final.final ? { color } : undefined}>
              {ch}
            </span>
          ))}
        </div>
      </button>

      <button type="button" className="big-btn big-btn--primary" onClick={nextCard}>
        {cardIdx + 1 >= FINAL_FORMS.length ? 'לְמִשְׂחָק! ←' : 'הָאוֹת הַבָּאָה ←'}
      </button>
    </div>
  );
}
