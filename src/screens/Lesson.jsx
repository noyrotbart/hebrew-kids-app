import { useEffect, useState } from 'react';
import { LESSON_BY_ID } from '../data/lessons.js';
import { recordLessonStars } from '../lib/storage.js';
import { stopAudio } from '../lib/audio.js';
import { celebrate } from '../lib/celebrate.js';
import TopBar from '../components/TopBar.jsx';
import Stars from '../components/Stars.jsx';
import Flashcards from '../games/Flashcards.jsx';
import Listen from '../games/Listen.jsx';
import Matching from '../games/Matching.jsx';
import Spelling from '../games/Spelling.jsx';
import './Lesson.css';

// A lesson is a sequence of 4 stages (the 4 games). Each stage reports a "score 0..1"
// when finished. The final star count = round(avg(scores) * 3).
const STAGES = [
  { key: 'flashcards', Component: Flashcards },
  { key: 'listen',     Component: Listen },
  { key: 'matching',   Component: Matching },
  { key: 'spelling',   Component: Spelling },
];

export default function Lesson({ lessonId, profile, onExit, onComplete }) {
  const lesson = LESSON_BY_ID[lessonId];
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState([]);

  useEffect(() => () => stopAudio(), [stage]);

  if (!lesson) return null;

  const handleStageDone = (score) => {
    const nextScores = [...scores, score];
    if (stage + 1 >= STAGES.length) {
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

  const Stage = STAGES[stage].Component;
  const totalProgress = stage / STAGES.length;

  return (
    <div className="screen lesson">
      <TopBar onBack={onExit} progress={totalProgress} right={
        <div className="lesson__hearts">
          <Stars count={STAGES.length - stage} total={STAGES.length} size="sm" />
        </div>
      } />
      <div className="lesson__stage">
        <Stage key={STAGES[stage].key} lesson={lesson} onDone={handleStageDone} />
      </div>
    </div>
  );
}
