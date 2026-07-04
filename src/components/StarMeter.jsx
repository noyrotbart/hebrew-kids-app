// 3-star display. `animated` staggers the pop-in for the celebrate screen.

export default function StarMeter({ stars, size = 'md', animated = false }) {
  return (
    <div className={`star-meter star-meter--${size}`} role="img" aria-label={`${stars} כוכבים`}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className={[
            'star-meter__star',
            i < stars && 'star-meter__star--on',
            animated && i < stars && 'star-meter__star--pop',
          ].filter(Boolean).join(' ')}
          style={animated ? { animationDelay: `${0.3 + i * 0.35}s` } : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}
