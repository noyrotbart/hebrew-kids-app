import { useEffect, useMemo, useRef, useState } from 'react';
import { playWord } from '../lib/audio.js';
import { useMic } from '../lib/useMic.js';
import { sample } from '../lib/util.js';
import WordImage from '../components/WordImage.jsx';
import MicButton from '../components/MicButton.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import Button from '../components/Button.jsx';
import { celebrate } from '../lib/celebrate.js';
import './Speak.css';

const ROUNDS = 4;

// "See and say": kid sees a photo + (optionally) the Hebrew word, hears it once,
// and says the word out loud. Web Speech API verifies the pronunciation.
// Always offers a "skip" path so a missing/blocked mic never stalls progress.
//
// Score = matchedRounds / totalRounds.
export default function Speak({ lesson, onDone }) {
  const rounds = useMemo(() => sample(lesson.words, Math.min(ROUNDS, lesson.words.length)), [lesson.id]);
  const [idx, setIdx] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [advanceQueued, setAdvanceQueued] = useState(false);
  const playedRef = useRef(false);

  const word = rounds[idx];
  const targets = word ? [word.he, word.bare, word.roman] : [];
  const mic = useMic({
    targets,
    onMatch: () => {
      celebrate('small');
      setMatchedCount(c => c + 1);
      setAdvanceQueued(true);
    },
  });

  useEffect(() => {
    playedRef.current = false;
    mic.reset();
    const t = setTimeout(() => {
      if (!playedRef.current) { playedRef.current = true; playWord(word); }
    }, 350);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    if (!advanceQueued) return;
    const t = setTimeout(() => {
      setAdvanceQueued(false);
      goNext();
    }, 1200);
    return () => clearTimeout(t);
  }, [advanceQueued]);

  const goNext = () => {
    mic.stop();
    if (idx + 1 >= rounds.length) {
      onDone(matchedCount / rounds.length);
    } else {
      setIdx(idx + 1);
    }
  };

  const skip = () => {
    mic.stop();
    goNext();
  };

  if (!word) return null;

  return (
    <div className="speak">
      <div className="speak__intro">
        <h2>אמרו את המילה</h2>
        <p className="muted">לחצו על המיקרופון ודברו</p>
      </div>

      <div className="speak__hero">
        <WordImage word={word} size="lg" rounded="lg" />
        <div className="speak__word heb-display">{word.he}</div>
        <div className="speak__roman">{word.roman} — {word.en}</div>
        <SpeakButton size="md" label="שמעו שוב" onClick={() => playWord(word)} />
      </div>

      <div className="speak__mic">
        {mic.supported ? (
          <MicButton
            size="lg"
            state={mic.state}
            transcript={mic.transcript}
            hint="לחצו ודברו"
            onClick={mic.toggle}
          />
        ) : (
          <div className="speak__no-mic">
            <p className="muted">המיקרופון לא נתמך בדפדפן זה</p>
            <Button variant="primary" onClick={skip}>הבא</Button>
          </div>
        )}
      </div>

      {mic.supported && (
        <div className="speak__actions">
          {mic.state === 'wrong' && (
            <Button variant="soft" onClick={mic.start}>נסו שוב</Button>
          )}
          <Button variant="ghost" onClick={skip}>דלגו</Button>
        </div>
      )}

      <div className="speak__progress">
        {rounds.map((_, i) => (
          <span key={i} className={`dot ${i < idx ? 'done' : i === idx ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
