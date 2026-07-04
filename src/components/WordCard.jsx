import { useState } from 'react';

// Photo card for a word, with a big-emoji fallback when there's no image file
// (or the image fails to load). Never shows the Hebrew text unless asked —
// several games rely on the picture NOT revealing the written answer.

export default function WordCard({ word, label = null, size = 'md', onClick, selected, wrong, ariaLabel }) {
  const [broken, setBroken] = useState(false);
  const useEmoji = word.noImage || broken;

  const className = [
    'word-card',
    `word-card--${size}`,
    onClick && 'word-card--tappable',
    selected && 'word-card--selected',
    wrong && 'word-card--wrong',
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      <div className="word-card__media">
        {useEmoji
          ? <span className="word-card__emoji">{word.emoji}</span>
          : <img src={`/images/words/${word.id}.jpg`} alt="" draggable="false" onError={() => setBroken(true)} />}
      </div>
      {label && <div className="word-card__label">{label}</div>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} aria-label={ariaLabel ?? word.he}>
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}
