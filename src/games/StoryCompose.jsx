import { useEffect, useMemo, useState } from 'react';
import { playScene, stopAudio } from '../lib/audio.js';
import { sayPraise, sayTryAgain } from '../lib/encourage.js';
import { sfxCorrect, sfxWrong } from '../lib/sfx.js';
import { shuffle } from '../lib/util.js';
import { celebrate } from '../lib/celebrate.js';
import WordImage from '../components/WordImage.jsx';
import './StoryCompose.css';

// Intermediate game: kid sees a photo + hears a 4-word Hebrew sentence and
// assembles it from a tray of 8 word tiles (4 correct + 4 distractors).
// Hebrew is RTL, so the build row fills right→left with the next-empty slot
// pulsing for visual guidance.
//
// Score = correctRounds / totalRounds, with -0.1 per mistake (floored at 0).
export default function StoryCompose({ scenes, onDone }) {
  const rounds = useMemo(() => scenes ?? [], [scenes]);
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);   // [{ word, trayKey }]
  const [tray, setTray]     = useState([]);   // [{ key, word, used, shake }]
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [scoreSum, setScoreSum] = useState(0);

  const scene = rounds[idx];

  // Build the tray when the scene changes; auto-play the sentence.
  useEffect(() => {
    if (!scene) return;
    setPlaced([]);
    setSolved(false);
    setMistakes(0);

    const all = shuffle([...scene.words, ...scene.decoys]).map((w, i) => ({
      key: `${i}-${w.id}`,
      word: w,
      used: false,
      shake: false,
    }));
    setTray(all);

    let cancelled = false;
    const t = setTimeout(async () => {
      if (cancelled) return;
      try { await playScene(scene); } catch {}
    }, 400);
    return () => { cancelled = true; clearTimeout(t); stopAudio(); };
  }, [idx, scene?.id]);

  if (!scene) return null;

  const expected = scene.words[placed.length];

  const advance = (roundScore) => {
    setSolved(true);
    setScoreSum(s => s + roundScore);
    if (roundScore > 0.5) {
      sfxCorrect();
      celebrate('small');
      setTimeout(() => sayPraise(), 250);
    }
    // Replay the sentence as a sealing reward, then advance.
    setTimeout(() => playScene(scene), 1100);
    setTimeout(() => {
      if (idx + 1 >= rounds.length) {
        onDone(Math.min(1, (scoreSum + roundScore) / rounds.length));
      } else {
        setIdx(idx + 1);
      }
    }, 2700);
  };

  const tapTray = (item) => {
    if (item.used || solved) return;
    if (item.word.id === expected.id) {
      const next = [...placed, { word: item.word, trayKey: item.key }];
      setPlaced(next);
      setTray(t => t.map(x => x.key === item.key ? { ...x, used: true } : x));
      if (next.length >= scene.words.length) {
        advance(Math.max(0, 1 - mistakes * 0.1));
      }
    } else {
      sfxWrong();
      const m = mistakes + 1;
      setMistakes(m);
      setTray(t => t.map(x => x.key === item.key ? { ...x, shake: true } : x));
      setTimeout(() => setTray(t => t.map(x => ({ ...x, shake: false }))), 400);
      if (m % 2 === 1) setTimeout(() => sayTryAgain(), 200);
    }
  };

  const undo = () => {
    if (solved || placed.length === 0) return;
    const last = placed[placed.length - 1];
    setPlaced(p => p.slice(0, -1));
    setTray(t => t.map(x => x.key === last.trayKey ? { ...x, used: false } : x));
  };

  return (
    <div className="story">
      <div className="story__intro">
        <h2>בנו את המשפט</h2>
        <div className="story__counter" dir="ltr">{idx + 1} / {rounds.length}</div>
      </div>

      <button className="story__hero" onClick={() => playScene(scene)} aria-label="שמעו שוב">
        <div className="story__hero-image">
          <WordImage word={{ id: scene.id, en: scene.bareSentence, wiki: scene.wiki, imageQuery: scene.imageQuery }} size="lg" rounded="lg" />
          <span className="story__replay-badge" aria-hidden>
            <SpeakerIcon />
          </span>
        </div>
      </button>

      <div className="story__direction" aria-hidden>
        <ArrowRtl /><span>מימין לשמאל</span><ArrowRtl />
      </div>

      <div className={`story__build ${solved ? 'is-solved' : ''}`}>
        {scene.words.map((_, i) => {
          const p = placed[i];
          const isNext = !solved && i === placed.length;
          return (
            <div key={i} className={`story__slot ${isNext ? 'is-next' : ''}`}>
              {p
                ? <span className="story__slot-word heb-display">{p.word.he}</span>
                : <div className="story__slot-empty" />}
            </div>
          );
        })}
      </div>

      <div className="story__tray">
        {tray.map(item => (
          <button
            key={item.key}
            className={`story__tile ${item.used ? 'is-used' : ''} ${item.shake ? 'is-wrong' : ''}`}
            onClick={() => tapTray(item)}
            disabled={item.used || solved}
          >
            <span className="heb-display">{item.word.he}</span>
          </button>
        ))}
      </div>

      <div className="story__actions">
        <button className="btn btn--ghost btn--sm" onClick={undo} disabled={solved || placed.length === 0}>
          בטל
        </button>
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

function ArrowRtl() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5M11 19l-7-7 7-7"/>
    </svg>
  );
}
