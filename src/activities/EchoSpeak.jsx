// Echo cave: hear a word, say it into the mic. Matching is deliberately
// generous (see useMic). Nobody ever gets stuck: after two misses a friendly
// "let's move on" appears, and on devices without speech recognition the kid
// says the word out loud and taps "אמרתי!" (honor system — a grown-up is
// usually next to them anyway).

import { useEffect, useMemo, useRef, useState } from 'react';
import { playWord, stopAudio } from '../lib/audio.js';
import { useMic } from '../lib/useMic.js';
import { sample } from '../lib/util.js';
import { sfxMicOpen, sfxMicMatch } from '../lib/sfx.js';
import { celebrate } from '../lib/celebrate.js';
import WordCard from '../components/WordCard.jsx';
import ProgressDots from '../components/ProgressDots.jsx';

const ROUNDS = 3;

export default function EchoSpeak({ world, onDone }) {
  const words = useMemo(() => sample(world.words, Math.min(ROUNDS, world.words.length)), [world]);
  const [idx, setIdx] = useState(0);
  const [misses, setMisses] = useState(0);
  const [opens, setOpens] = useState(0);
  const [matched, setMatched] = useState(false);
  const scoresRef = useRef([]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const word = words[idx];

  const mic = useMic({
    targets: [word.bare, word.he, word.roman],
    onMatch: () => {
      sfxMicMatch();
      celebrate('small');
      setMatched(true);
    },
  });

  useEffect(() => {
    playWord(word);
    return stopAudio;
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Count a miss each time a listening session ends on 'wrong'.
  useEffect(() => {
    if (mic.state === 'wrong') setMisses(m => m + 1);
  }, [mic.state]);

  const finishWord = (score) => {
    scoresRef.current.push(score);
    mic.reset();
    if (idx + 1 >= words.length) {
      const s = scoresRef.current;
      onDoneRef.current?.(s.reduce((a, b) => a + b, 0) / s.length);
    } else {
      setIdx(idx + 1);
      setMisses(0);
      setOpens(0);
      setMatched(false);
    }
  };

  useEffect(() => {
    if (!matched) return;
    const t = setTimeout(() => finishWord(1), 1200);
    return () => clearTimeout(t);
  }, [matched]); // eslint-disable-line react-hooks/exhaustive-deps

  const micState = matched ? 'matched' : mic.state;

  return (
    <div className="echo">
      <ProgressDots total={words.length} done={idx + (matched ? 1 : 0)} />
      <div className="activity-prompt">
        <button type="button" className="speaker-btn" onClick={() => playWord(word)} aria-label="השמיעו שוב">🔊</button>
        <span>הַקְשִׁיבוּ וְאִמְרוּ בְּקוֹל!</span>
      </div>

      <WordCard word={word} size="md" onClick={() => playWord(word)} />
      <div className="echo__word">{word.he}</div>
      <div className="echo__roman">{word.roman}</div>

      {mic.supported ? (
        <>
          <button
            type="button"
            className={`mic-btn mic-btn--${micState}`}
            onClick={() => {
              if (matched) return;
              if (mic.state !== 'listening') {
                sfxMicOpen();
                setOpens(o => o + 1);
              }
              stopAudio();
              mic.toggle();
            }}
            aria-label="מיקרופון"
          >
            {micState === 'matched' ? '🌟' : '🎤'}
          </button>
          <div className="echo__status">
            {micState === 'listening' && 'מַקְשִׁיבִים... דַּבְּרוּ!'}
            {micState === 'matched' && 'שָׁמַעְנוּ! מְעוּלֶה!'}
            {micState === 'wrong' && 'כִּמְעַט! נַסּוּ שׁוּב 💪'}
            {micState === 'idle' && 'לַחֲצוּ עַל הַמִּיקְרוֹפוֹן וְאִמְרוּ אֶת הַמִּלָּה'}
            {micState === 'error' && 'הַמִּיקְרוֹפוֹן לֹא מַצְלִיחַ לְהַקְשִׁיב כָּרֶגַע'}
          </div>
          {(misses >= 2 || opens >= 3 || micState === 'error') && !matched && (
            <button type="button" className="big-btn big-btn--ghost" onClick={() => finishWord(0.7)}>
              אָמַרְנוּ יַחַד! מַמְשִׁיכִים ←
            </button>
          )}
        </>
      ) : (
        <>
          <div className="echo__status">אִמְרוּ אֶת הַמִּלָּה בְּקוֹל גָּדוֹל!</div>
          {!matched && (
            <button
              type="button"
              className="big-btn big-btn--primary"
              onClick={() => { celebrate('small'); setMatched(true); }}
            >
              אָמַרְתִּי! 😊
            </button>
          )}
        </>
      )}
    </div>
  );
}
