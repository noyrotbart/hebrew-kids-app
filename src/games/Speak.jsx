import { useEffect, useMemo, useRef, useState } from 'react';
import { playWord } from '../lib/audio.js';
import { useMic } from '../lib/useMic.js';
import { sample } from '../lib/util.js';
import { sayPraise, sayTryAgain } from '../lib/encourage.js';
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
      setTimeout(() => sayPraise(), 250);
      setMatchedCount(c => c + 1);
      setAdvanceQueued(true);
    },
  });

  // Auto-play the word, then auto-open the mic — no tap required.
  // Audio errors don't block the mic.
  useEffect(() => {
    playedRef.current = false;
    mic.reset();
    let cancelled = false;
    const t = setTimeout(async () => {
      if (cancelled || playedRef.current) return;
      playedRef.current = true;
      try { await playWord(word); } catch {}
      if (cancelled) return;
      setTimeout(() => { if (!cancelled) mic.start(); }, 250);
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [idx]);

  // Quiet "נסה שוב" cue on a miss; kid sees the prompt and decides when to retry.
  useEffect(() => {
    if (mic.state === 'wrong') sayTryAgain();
  }, [mic.state]);

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
        <div className="speak__counter" dir="ltr">{idx + 1} / {rounds.length}</div>
      </div>

      {/* The word block is itself the "replay" affordance — tap anywhere on it to hear again. */}
      <button className="speak__word-block" onClick={() => playWord(word)} aria-label="שמעו שוב">
        <div className="speak__word-image">
          <WordImage word={word} size="lg" rounded="lg" />
          <span className="speak__replay-badge" aria-hidden>
            <SpeakerIcon />
          </span>
        </div>
        <div className="speak__word heb-display">{word.he}</div>
      </button>

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
            <Button variant="soft" size="sm" onClick={mic.start}>נסו שוב</Button>
          )}
          <button className="speak__skip" onClick={skip}>דלגו ←</button>
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

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5L7 9H4a1 1 0 0 0-1 1z"/>
      <path d="M16 8.5a4 4 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
