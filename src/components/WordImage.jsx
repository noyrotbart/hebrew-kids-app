import { useState } from 'react';
import './WordImage.css';

// Renders a real photo per vocabulary word. While the image loads (or if it's
// missing because fetch-images.mjs hasn't been run), a styled placeholder
// shows the Hebrew letters as a tasteful fallback — no icon shortcuts.
export default function WordImage({ word, size = 'md', rounded = 'lg' }) {
  const [error, setError] = useState(false);
  const cls = ['word-image', `word-image--${size}`, `word-image--r-${rounded}`];
  const src = `/images/words/${word.id}.jpg`;

  return (
    <div className={cls.join(' ')}>
      {error ? (
        <Placeholder word={word} />
      ) : (
        <img src={src} alt={word.en} loading="lazy" onError={() => setError(true)} />
      )}
    </div>
  );
}

// Each word maps deterministically to one of six gradient slots, so a Listen-stage
// kid sees four DIFFERENT looking placeholders (and can't read the answer off them)
// while flashcards/spelling still get a coherent fallback.
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #FFE5DC, #FFEFC9)',
  'linear-gradient(135deg, #D9F1EF, #FFEFC9)',
  'linear-gradient(135deg, #E6DFFF, #FFE5DC)',
  'linear-gradient(135deg, #DCF1E5, #D9F1EF)',
  'linear-gradient(135deg, #FFEFC9, #DCF1E5)',
  'linear-gradient(135deg, #FFE5DC, #E6DFFF)',
];

function gradientFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_GRADIENTS[h % PLACEHOLDER_GRADIENTS.length];
}

function Placeholder({ word }) {
  return (
    <div className="word-image__placeholder" style={{ background: gradientFor(word.id) }}>
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden style={{ color: 'rgba(21,25,44,0.18)' }}>
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
        <path d="M3 17l5-5 4 4 3-3 6 6"/>
      </svg>
    </div>
  );
}
