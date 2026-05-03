import './Stars.css';

export default function Stars({ count = 0, total = 3, size = 'md' }) {
  return (
    <div className={`stars stars--${size}`}>
      {Array.from({ length: total }).map((_, i) => (
        <Star key={i} on={i < count} delay={i * 80} />
      ))}
    </div>
  );
}

function Star({ on, delay }) {
  return (
    <svg
      className={`star ${on ? 'star--on' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3 1.1-6.4-4.7-4.6 6.5-1z" />
    </svg>
  );
}
