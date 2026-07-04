// Little progress dots for multi-round activities (round 2 of 4 → ●●○○).

export default function ProgressDots({ total, done }) {
  return (
    <div className="progress-dots" aria-label={`${done} מתוך ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`progress-dots__dot ${i < done ? 'progress-dots__dot--on' : ''}`} />
      ))}
    </div>
  );
}
