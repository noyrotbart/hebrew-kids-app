import { useEffect, useState } from 'react';
import { resolveWikiImage } from '../lib/wikiImage.js';
import './WordImage.css';

// Image resolution chain:
//   1. /images/words/{id}.jpg       — checked-in via scripts/fetch-images.mjs (Pexels)
//   2. Wikipedia REST API thumbnail — runtime fetch, free, cached in localStorage
//   3. Gradient placeholder         — neutral fallback that never reveals the answer
export default function WordImage({ word, size = 'md', rounded = 'lg' }) {
  const cls = ['word-image', `word-image--${size}`, `word-image--r-${rounded}`];

  // 'static'  – trying public/images/words/{id}.jpg
  // 'wiki'    – static failed, trying Wikipedia thumbnail (`wikiSrc`)
  // 'placeholder' – both failed
  const [phase, setPhase] = useState('static');
  const [wikiSrc, setWikiSrc] = useState(null);

  // Reset chain when the word changes (otherwise a stale phase from a prior word
  // sticks around and shows the wrong placeholder for the new word).
  useEffect(() => {
    setPhase('static');
    setWikiSrc(null);
  }, [word.id]);

  // When we move into the 'wiki' phase, fetch from the Wikipedia REST endpoint.
  useEffect(() => {
    let cancelled = false;
    if (phase !== 'wiki' || wikiSrc) return;
    resolveWikiImage(word).then(src => {
      if (cancelled) return;
      if (src) setWikiSrc(src);
      else setPhase('placeholder');
    });
    return () => { cancelled = true; };
  }, [phase, word.id]);

  let content;
  if (phase === 'placeholder') {
    content = <Placeholder word={word} />;
  } else if (phase === 'wiki' && wikiSrc) {
    content = (
      <img
        src={wikiSrc}
        alt={word.en}
        loading="lazy"
        onError={() => setPhase('placeholder')}
        className="word-image__img word-image__img--wiki"
      />
    );
  } else if (phase === 'wiki') {
    // Wiki fetch in flight — keep a quiet placeholder visible.
    content = <Placeholder word={word} loading />;
  } else {
    // 'static'
    content = (
      <img
        src={`/images/words/${word.id}.jpg`}
        alt={word.en}
        loading="lazy"
        onError={() => setPhase(word.wiki ? 'wiki' : 'placeholder')}
        className="word-image__img"
      />
    );
  }

  return <div className={cls.join(' ')}>{content}</div>;
}

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

function Placeholder({ word, loading }) {
  return (
    <div className="word-image__placeholder" style={{ background: gradientFor(word.id) }}>
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden style={{ color: 'rgba(21,25,44,0.18)' }}>
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
        <path d="M3 17l5-5 4 4 3-3 6 6"/>
      </svg>
      {loading && <div className="word-image__loading" aria-hidden />}
    </div>
  );
}
