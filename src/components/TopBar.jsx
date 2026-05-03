import './TopBar.css';

// Generic top bar. Right slot (in RTL = visual right) holds the back button,
// left slot holds optional progress / actions.
export default function TopBar({ onBack, title, right, progress }) {
  return (
    <div className="topbar">
      <button className="topbar__btn" onClick={onBack} aria-label="חזרה">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* RTL back arrow points right */}
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>
      <div className="topbar__center">
        {progress != null
          ? <ProgressBar value={progress} />
          : <div className="topbar__title">{title}</div>}
      </div>
      <div className="topbar__right">{right}</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__fill" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}
