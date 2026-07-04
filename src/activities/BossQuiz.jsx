// Island boss: a mixed quick-fire quiz over everything the island taught.
//   letter  — hear a letter name, tap its glyph (decoys are look-alikes)
//   picture — hear a word, tap its photo
//   read    — see a photo, tap the written word (real reading!)
// Wrong answers just grey out — the kid keeps going until right, but only
// first-try answers count toward stars. Story Mountain's boss quizzes the
// final forms + reading across the whole corpus.

import { useEffect, useMemo, useRef, useState } from 'react';
import { WORDS, WORDS_BY_ID } from '../data/words.js';
import { FINAL_FORMS } from '../data/worlds.js';
import { playLetter, playWord, sayLine, stopAudio } from '../lib/audio.js';
import { finalLine } from '../data/uiLines.js';
import { sample, shuffle } from '../lib/util.js';
import { sfxCorrect, sfxWrong } from '../lib/sfx.js';
import WordCard from '../components/WordCard.jsx';
import ProgressDots from '../components/ProgressDots.jsx';

const MAX_QUESTIONS = 8;

const uniq = (arr) => [...new Set(arr)];

const letterQuestion = (letter, world) => {
  const pool = uniq([
    ...letter.similar,
    ...world.cumulativeLetters.map(l => l.heb),
  ]).filter(g => g !== letter.heb);
  const options = shuffle([letter.heb, ...sample(pool, 3)]);
  return {
    type: 'letter',
    play: () => playLetter(letter.id),
    prompt: 'אֵיזוֹ אוֹת שׁוֹמְעִים?',
    options: options.map(g => ({ key: g, glyph: g, correct: g === letter.heb })),
  };
};

const finalQuestion = (final) => {
  const others = FINAL_FORMS.filter(f => f !== final).map(f => f.final);
  const options = shuffle([final.final, final.base, ...sample(others, 2)]);
  return {
    type: 'letter',
    play: () => sayLine(finalLine(final.baseId)),
    prompt: 'אֵיזוֹ אוֹת שׁוֹמְעִים?',
    options: options.map(g => ({ key: g, glyph: g, correct: g === final.final })),
  };
};

const pictureQuestion = (word) => {
  const decoys = sample(WORDS.filter(w => !w.noImage && w.id !== word.id), 3);
  return {
    type: 'picture',
    play: () => playWord(word),
    prompt: 'אֵיזוֹ תְּמוּנָה מַתְאִימָה?',
    options: shuffle([word, ...decoys]).map(w => ({ key: w.id, word: w, correct: w.id === word.id })),
  };
};

const readQuestion = (word, decoyPool) => {
  const decoys = sample(decoyPool.filter(w => w.id !== word.id), 3);
  return {
    type: 'read',
    play: () => playWord(word),
    prompt: 'אֵיזוֹ מִלָּה כְּתוּבָה כָּאן?',
    visual: word,
    options: shuffle([word, ...decoys]).map(w => ({ key: w.id, text: w.bare, correct: w.id === word.id })),
  };
};

const buildQuestions = (world) => {
  if (world.id === 'stories') {
    const finals = sample(FINAL_FORMS, 4).map(finalQuestion);
    const readable = WORDS.filter(w => !w.noImage);
    const reads = sample(readable, 4).map(w => readQuestion(w, readable));
    return shuffle([...finals, ...reads]);
  }
  const cumulativeWords = world.cumulativeWordIds.map(id => WORDS_BY_ID[id]);
  const qs = [
    ...world.letters.map(l => letterQuestion(l, world)),
    ...sample(world.words, Math.min(3, world.words.length)).map(pictureQuestion),
    ...sample(world.words, Math.min(3, world.words.length)).map(w => readQuestion(w, cumulativeWords)),
  ];
  return shuffle(qs).slice(0, MAX_QUESTIONS);
};

export default function BossQuiz({ world, onDone }) {
  const questions = useMemo(() => buildQuestions(world), [world]);
  const [qIdx, setQIdx] = useState(0);
  const [wrongKeys, setWrongKeys] = useState([]);
  const [rightKey, setRightKey] = useState(null);
  const firstTryRef = useRef(0);
  const missedThisQRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const q = questions[qIdx];

  useEffect(() => {
    missedThisQRef.current = false;
    if (q.type !== 'read') q.play();
    return stopAudio;
  }, [qIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (opt) => {
    if (rightKey != null || wrongKeys.includes(opt.key)) return;
    if (opt.correct) {
      sfxCorrect();
      if (!missedThisQRef.current) firstTryRef.current++;
      setRightKey(opt.key);
      setTimeout(() => {
        if (qIdx + 1 >= questions.length) {
          onDoneRef.current?.(firstTryRef.current / questions.length);
        } else {
          setQIdx(qIdx + 1);
          setRightKey(null);
          setWrongKeys([]);
        }
      }, 900);
    } else {
      sfxWrong();
      missedThisQRef.current = true;
      setWrongKeys(prev => [...prev, opt.key]);
    }
  };

  const optClass = (opt, base) => [
    base,
    rightKey === opt.key && `${base}--right`,
    wrongKeys.includes(opt.key) && `${base}--dim`,
  ].filter(Boolean).join(' ');

  return (
    <div className="boss">
      <ProgressDots total={questions.length} done={qIdx + (rightKey != null ? 1 : 0)} />
      <div className="activity-prompt">
        <button type="button" className="speaker-btn" onClick={() => q.play()} aria-label="השמיעו שוב">🔊</button>
        <span>{q.prompt}</span>
      </div>

      {q.type === 'read' && (
        <WordCard word={q.visual} size="md" onClick={() => q.play()} />
      )}

      {q.type === 'letter' && (
        <div className="boss__glyph-options">
          {q.options.map(opt => (
            <button key={opt.key} type="button" className={optClass(opt, 'glyph-opt')} onClick={() => answer(opt)}>
              {opt.glyph}
            </button>
          ))}
        </div>
      )}

      {q.type === 'picture' && (
        <div className="boss__card-options">
          {q.options.map(opt => (
            <WordCard
              key={opt.key}
              word={opt.word}
              size="sm"
              onClick={() => answer(opt)}
              selected={rightKey === opt.key}
              wrong={wrongKeys.includes(opt.key)}
              ariaLabel="תמונה"
            />
          ))}
        </div>
      )}

      {q.type === 'read' && (
        <div className="boss__text-options">
          {q.options.map(opt => (
            <button key={opt.key} type="button" className={optClass(opt, 'text-opt')} onClick={() => answer(opt)}>
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
