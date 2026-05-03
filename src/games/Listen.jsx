import { useEffect, useMemo, useRef, useState } from 'react';
import { playWord } from '../lib/audio.js';
import { WORDS } from '../data/words.js';
import { shuffle, sample } from '../lib/util.js';
import WordImage from '../components/WordImage.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import './Listen.css';

const ROUNDS = 4;

// "Listen and tap": hear a word, pick the matching photo from 3 choices.
// Pulls answer words from the lesson's vocabulary (cumulative). Distractors come from
// other words in the global corpus, biased toward similar word length.
export default function Listen({ lesson, onDone }) {
  const challenges = useMemo(() => {
    const pool = lesson.words.length >= ROUNDS ? lesson.words : WORDS;
    const targets = sample(pool, ROUNDS);
    return targets.map(target => {
      const otherPool = WORDS.filter(w => w.id !== target.id);
      const distractors = sample(otherPool, 2);
      return { target, options: shuffle([target, ...distractors]) };
    });
  }, [lesson.id]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const playedRef = useRef(false);

  const round = challenges[idx];

  useEffect(() => {
    setPicked(null);
    playedRef.current = false;
    const t = setTimeout(() => {
      if (!playedRef.current) {
        playedRef.current = true;
        playWord(round.target);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [idx]);

  const choose = (word) => {
    if (picked) return;
    const isCorrect = word.id === round.target.id;
    setPicked({ id: word.id, isCorrect });
    if (isCorrect) setCorrect(c => c + 1);
    setTimeout(() => {
      if (idx + 1 >= challenges.length) onDone((correct + (isCorrect ? 1 : 0)) / challenges.length);
      else setIdx(idx + 1);
    }, 850);
  };

  return (
    <div className="listen">
      <div className="listen__intro">
        <h2>איזו תמונה?</h2>
        <p className="muted">לחצו על כפתור ההקשבה</p>
      </div>

      <div className="listen__speak">
        <SpeakButton label="שמעו" size="lg" onClick={() => playWord(round.target)} />
      </div>

      <div className="listen__options">
        {round.options.map(opt => {
          let state = '';
          if (picked) {
            if (picked.id === opt.id) state = picked.isCorrect ? 'is-correct' : 'is-wrong';
            else if (opt.id === round.target.id) state = 'is-correct';
          }
          return (
            <button
              key={opt.id}
              className={`listen__option ${state}`}
              onClick={() => choose(opt)}
              disabled={!!picked}
              aria-label={opt.en}
            >
              <WordImage word={opt} size="lg" rounded="lg" />
              <span className="listen__caption">{opt.en}</span>
            </button>
          );
        })}
      </div>

      <div className="listen__progress">
        {challenges.map((_, i) => (
          <span key={i} className={`dot ${i <= idx ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
