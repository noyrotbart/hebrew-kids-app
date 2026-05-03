import './MicButton.css';

// Big, friendly mic button. Pulses red while listening, glows green on match,
// shakes on wrong. `transcript` is shown as a live caption underneath when listening.
export default function MicButton({ state = 'idle', transcript, hint, onClick, size = 'md' }) {
  const cls = ['mic', `mic--${size}`, `mic--${state}`];
  const label = state === 'listening' ? 'מקשיב…'
              : state === 'matched'   ? '🎉 כל הכבוד!'
              : state === 'wrong'     ? 'שוב'
              : state === 'error'     ? 'שגיאה'
              : (hint || 'דברו');
  return (
    <div className="mic-wrap">
      <button className={cls.join(' ')} onClick={onClick} aria-label="הקלטה">
        <Icon state={state} />
      </button>
      <div className="mic-caption">
        {transcript ? <span className="mic-transcript">{transcript}</span> : <span className="mic-hint">{label}</span>}
      </div>
    </div>
  );
}

function Icon({ state }) {
  if (state === 'matched') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3z"/>
      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"/>
    </svg>
  );
}
