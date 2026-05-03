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

function Placeholder({ word }) {
  return (
    <div className="word-image__placeholder">
      <div className="word-image__placeholder-glyph heb-display">{word.bare}</div>
      <div className="word-image__placeholder-caption">{word.en}</div>
    </div>
  );
}
