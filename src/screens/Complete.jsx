import Stars from '../components/Stars.jsx';
import Button from '../components/Button.jsx';
import './Complete.css';

const TITLES = [
  'יפה!',         // 1 star
  'נהדר!',        // 2 stars
  'מושלם!',       // 3 stars
];

export default function Complete({ result, onContinue, onHome }) {
  const { lesson, stars, earned } = result;
  const title = TITLES[Math.max(0, Math.min(2, stars - 1))];
  const hebLetters = lesson.letters.map(l => l.heb).join(' · ');

  return (
    <div className="screen complete">
      <div className="complete__hero">
        <div className="complete__letters heb-display">{hebLetters}</div>
        <h1>{title}</h1>
        <p className="muted">{lesson.title} הושלם</p>
        <Stars count={stars} total={3} size="lg" />
      </div>

      {earned > 0 && (
        <div className="complete__xp">
          <span>+{earned}</span>
          <span className="muted">נקודות</span>
        </div>
      )}

      <div className="spacer" />

      <div className="complete__actions">
        <Button variant="primary" size="lg" full onClick={onContinue}>
          השיעור הבא
        </Button>
        <Button variant="ghost" onClick={onHome}>חזרה למסלול</Button>
      </div>
    </div>
  );
}
