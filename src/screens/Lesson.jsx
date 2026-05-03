import { useEffect, useState } from 'react';
import { LESSON_BY_ID } from '../data/lessons.js';
import { recordLessonStars } from '../lib/storage.js';
import { stopAudio } from '../lib/audio.js';
import { celebrate } from '../lib/celebrate.js';
import TopBar from '../components/TopBar.jsx';
import Stars from '../components/Stars.jsx';
import Flashcards from '../games/Flashcards.jsx';
import Listen from '../games/Listen.jsx';
import Speak from '../games/Speak.jsx';
import Spelling from '../games/Spelling.jsx';
import StoryCompose from '../games/StoryCompose.jsx';
import './Lesson.css';

// Beginner: Discover (Flashcards) → Receptive (Listen) → Productive (Speak) → Apply (Spell).
// Intermediate: a single StoryCompose run over the lesson's scene set.
const BEGINNER_STAGES = [
  { key: 'flashcards', Component: Flashcards },
  { key: 'listen',     Component: Listen },
  { key: 'speak',      Component: Speak },
  { key: 'spelling',   Component: Spelling },
];

const INTERMEDIATE_STAGES = [
  { key: 'story', Component: StoryCompose },
];

export default function Lesson({ lessonId, profile, onExit, onComplete }) {
  const lesson = LESSON_BY_ID[lessonId];
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState([]);

  useEffect(() => () => stopAudio(), [stage]);

  if (!lesson) return null;

  const stages = lesson.level === 'intermediate' ? INTERMEDIATE_STAGES : BEGINNER_STAGES;

  const handleStageDone = (score) => {
    const nextScores = [...scores, score];
    if (stage + 1 >= stages.length) {
      const avg = nextScores.reduce((s, v) => s + v, 0) / nextScores.length;
      const stars = Math.max(1, Math.min(3, Math.round(avg * 3)));
      const result = recordLessonStars(profile.id, lessonId, stars);
      celebrate(stars >= 3 ? 'big' : 'small');
      onComplete({ lesson, stars, ...result });
      return;
    }
    setStage(stage + 1);
    setScores(nextScores);
  };

  const Stage = stages[stage].Component;
  const totalProgress = stage / stages.length;

  return (
    <div className="screen lesson">
      <TopBar onBack={onExit} progress={totalProgress} right={
        <div className="lesson__hearts">
          <Stars count={stages.length - stage} total={stages.length} size="sm" />
        </div>
      } />
      <div className="lesson__stage">
        {/* StoryCompose takes scenes directly, others take the lesson object */}
        {lesson.level === 'intermediate'
          ? <StoryCompose key={stages[stage].key} scenes={lesson.scenes} onDone={handleStageDone} />
          : <Stage key={stages[stage].key} lesson={lesson} onDone={handleStageDone} />}
      </div>
    </div>
  );
}
