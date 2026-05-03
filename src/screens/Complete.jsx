import { useEffect } from 'react';
import Stars from '../components/Stars.jsx';
import Button from '../components/Button.jsx';
import Mascot from '../components/Mascot.jsx';
import { sayLessonDone } from '../lib/encourage.js';
import { sfxComplete } from '../lib/sfx.js';
import './Complete.css';

const TITLES = [
  'יפה!',         // 1 star
  'נהדר!',        // 2 stars
  'מושלם!',       // 3 stars
];

export default function Complete({ result, profile, onContinue, onHome }) {
  const { lesson, stars, earned } = result;
  const title = TITLES[Math.max(0, Math.min(2, stars - 1))];
  const heroText = lesson.level === 'intermediate'
    ? '🎉'
    : lesson.letters.map(l => l.heb).join(' · ');

  // Sound effect immediately + voice line after a beat — the SFX gives the
  // celebration moment its first hit, the spoken praise lands behind it.
  useEffect(() => {
    sfxComplete();
    const t = setTimeout(() => sayLessonDone(profile?.name), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen complete">
      <div className="complete__hero">
        <Mascot state="cheer" size="xl" />
        <div className="complete__letters heb-display">{heroText}</div>
        <h1>{title}</h1>
        <p className="muted">{lesson.title} הושלם</p>
        <Stars count={stars} total={3} size="lg" />
      </div>

      {earned > 0 && (
        <div className="complete__xp">
          <span dir="ltr">+{earned}</span>
          <span className="muted">נקודות</span>
        </div>
      )}

      <div className="complete__actions">
        <Button variant="primary" size="lg" full onClick={onContinue}>
          השיעור הבא
        </Button>
        <Button variant="soft" size="md" onClick={onHome}>חזרה למסלול</Button>
      </div>
    </div>
  );
}
