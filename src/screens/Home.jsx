import { useMemo } from 'react';
import { LESSONS } from '../data/lessons.js';
import { getProfileProgress, saveActiveProfile } from '../lib/storage.js';
import Stars from '../components/Stars.jsx';
import './Home.css';

export default function Home({ profile, onOpenLesson, onSwitchProfile }) {
  const progress = useMemo(() => getProfileProgress(profile.id), [profile.id]);
  const stars = progress.stars ?? {};

  // The first lesson without 3 stars is the "current" lesson, the user's natural next step.
  const currentIdx = LESSONS.findIndex(l => (stars[l.id] ?? 0) < 3);
  const totalStars = Object.values(stars).reduce((s, v) => s + v, 0);

  const switchProfile = () => { saveActiveProfile(null); onSwitchProfile(); };

  return (
    <div className="screen home">
      <div className="home__top">
        <button className="home__profile" onClick={switchProfile} aria-label="החלף שחקן">
          <span className="home__avatar" style={{ background: profile.color }}>{profile.name.slice(0, 1)}</span>
          <span>{profile.name}</span>
        </button>
        <div className="home__xp">
          <span className="home__xp-stars" dir="ltr">⭐ {totalStars}</span>
          <span className="home__xp-divider" aria-hidden>·</span>
          <span className="home__xp-points">{progress.xp ?? 0} נק'</span>
        </div>
      </div>

      <div className="home__greeting">
        <h1>שלום {profile.name} 👋</h1>
        <p className="muted">בואו נמשיך ללמוד.</p>
      </div>

      <div className="home__path">
        {LESSONS.map((lesson, i) => {
          const earned = stars[lesson.id] ?? 0;
          // Lesson unlocks when the previous one has earned ≥1 star — kids don't need
          // to 3-star a lesson before moving on. The first <3-star lesson is "current"
          // (warmly inviting them to perfect it), the rest unlocked behind it.
          const prevEarned = i === 0 ? 1 : (stars[LESSONS[i - 1].id] ?? 0);
          const unlocked = i === 0 || prevEarned >= 1;
          const status = !unlocked ? 'locked'
                       : earned >= 3 ? 'done'
                       : i === currentIdx ? 'current'
                       : 'available';
          return (
            <PathNode
              key={lesson.id}
              lesson={lesson}
              status={status}
              stars={earned}
              side={i % 2 === 0 ? 'right' : 'left'}
              onClick={() => status !== 'locked' && onOpenLesson(lesson.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function PathNode({ lesson, status, stars, side, onClick }) {
  const letters = lesson.letters.map(l => l.heb).join(' · ');
  return (
    <div className={`pathnode pathnode--${side} pathnode--${status}`}>
      <button className="pathnode__bubble" onClick={onClick} disabled={status === 'locked'}>
        <span className="pathnode__num">{lesson.number}</span>
        {status === 'locked' && <LockIcon />}
      </button>
      <div className="pathnode__card card">
        <div className="pathnode__title">{lesson.title}</div>
        <div className="pathnode__letters heb-display">{letters}</div>
        <Stars count={stars} size="sm" />
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ position: 'absolute' }}>
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 1 1 6 0v3z"/>
    </svg>
  );
}
