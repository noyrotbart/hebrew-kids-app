// Story Mountain: hear a full Hebrew sentence, build it from word chips in
// order. Decoy chips are deliberately close (gendered noun, nearby verb) so
// the kid has to really read. Completing a scene replays the sentence over
// the finished sentence — a tiny "I read that!" moment.

import { useEffect, useMemo, useRef, useState } from 'react';
import { SCENES_BY_ID } from '../data/scenes.js';
import { playScene, stopAudio } from '../lib/audio.js';
import { shuffle } from '../lib/util.js';
import { sfxFlip, sfxComplete, sfxWrong } from '../lib/sfx.js';
import { celebrate } from '../lib/celebrate.js';
import ProgressDots from '../components/ProgressDots.jsx';

const SCENE_EMOJI = {
  'boy-reading': '👦📖',
  'cat-sleeping': '🐱💤',
  'sun-shining': '🌞☁️',
  'girl-eating-apple': '👧🍎',
  'dog-running': '🐶🌿',
};

const buildRound = (scene) => ({
  scene,
  filled: 0,
  chips: shuffle([...scene.words, ...scene.decoys]).map((w, i) => ({
    ...w,
    key: `${w.id}-${i}`,
    used: false,
    wrong: false,
  })),
});

export default function StoryBuilder({ node, onDone }) {
  const scenes = useMemo(() => node.sceneIds.map(id => SCENES_BY_ID[id]), [node]);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [round, setRound] = useState(() => buildRound(scenes[0]));
  const errorsRef = useRef(0);
  const correctRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    playScene(round.scene);
    return stopAudio;
  }, [sceneIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const complete = round.filled >= round.scene.words.length;

  useEffect(() => {
    if (!complete) return;
    sfxComplete();
    celebrate('small');
    playScene(round.scene);
    const t = setTimeout(() => {
      if (sceneIdx + 1 >= scenes.length) {
        const total = correctRef.current;
        onDoneRef.current?.(total / (total + errorsRef.current));
      } else {
        const next = sceneIdx + 1;
        setSceneIdx(next);
        setRound(buildRound(scenes[next]));
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [complete]); // eslint-disable-line react-hooks/exhaustive-deps

  const tapChip = (key) => {
    if (complete) return;
    const chip = round.chips.find(c => c.key === key);
    if (!chip || chip.used) return;
    const expected = round.scene.words[round.filled];
    if (chip.bare === expected.bare) {
      sfxFlip();
      correctRef.current++;
      setRound(r => ({
        ...r,
        filled: r.filled + 1,
        chips: r.chips.map(c => (c.key === key ? { ...c, used: true } : c)),
      }));
    } else {
      sfxWrong();
      errorsRef.current++;
      setRound(r => ({
        ...r,
        chips: r.chips.map(c => (c.key === key ? { ...c, wrong: true } : c)),
      }));
    }
  };

  const clearWrong = (key) => {
    setRound(r => ({ ...r, chips: r.chips.map(c => (c.key === key ? { ...c, wrong: false } : c)) }));
  };

  return (
    <div className="story">
      <ProgressDots total={scenes.length} done={sceneIdx + (complete ? 1 : 0)} />
      <div className="activity-prompt">
        <button type="button" className="speaker-btn" onClick={() => playScene(round.scene)} aria-label="השמיעו שוב">🔊</button>
        <span>הַקְשִׁיבוּ וּבְנוּ אֶת הַמִּשְׁפָּט!</span>
      </div>

      <div className="story__scene">{SCENE_EMOJI[round.scene.id] ?? '📖'}</div>

      <div className={`story__slots ${complete ? 'story__slots--done' : ''}`}>
        {round.scene.words.map((w, i) => (
          <div key={w.id} className={`story-slot ${i < round.filled ? 'story-slot--filled' : ''} ${i === round.filled ? 'story-slot--next' : ''}`}>
            {i < round.filled ? w.he : ''}
          </div>
        ))}
      </div>

      <div className="story__tray">
        {round.chips.map(chip => (
          <button
            key={chip.key}
            type="button"
            className={[
              'story-chip',
              chip.used && 'story-chip--used',
              chip.wrong && 'story-chip--wrong shake',
            ].filter(Boolean).join(' ')}
            onClick={() => tapChip(chip.key)}
            onAnimationEnd={() => chip.wrong && clearWrong(chip.key)}
            disabled={chip.used || complete}
          >
            {chip.he}
          </button>
        ))}
      </div>
    </div>
  );
}
