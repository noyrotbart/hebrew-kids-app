import { useEffect, useState } from 'react';
import { resolveWikiImage } from '../lib/wikiImage.js';
import './WordImage.css';

// Image resolution chain:
//   1. /images/words/{id}.jpg       — checked-in via scripts/fetch-images.mjs (Pexels)
//   2. Wikipedia REST API thumbnail — runtime fetch, free, cached in localStorage
//   3. Gradient placeholder         — neutral fallback that never reveals the answer
//
// Vercel quirk: missing static files don't return 404 — the SPA index.html (text/html)
// comes back instead, so <img onError> may not fire and we never advance to the wiki
// fallback. We probe via fetch HEAD-style: if content-type isn't image/*, treat as miss.
export default function WordImage({ word, size = 'md', rounded = 'lg' }) {
  const cls = ['word-image', `word-image--${size}`, `word-image--r-${rounded}`];

  // 'probe'   – verifying public/images/words/{id}.jpg via fetch
  // 'static'  – probe succeeded; using local image
  // 'wiki'    – fetching Wikipedia thumbnail
  // 'placeholder' – nothing worked
  const [phase, setPhase] = useState('probe');
  const [src, setSrc] = useState(null);

  useEffect(() => {
    setPhase('probe');
    setSrc(null);
    let cancelled = false;
    const localUrl = `/images/words/${word.id}.jpg`;

    (async () => {
      // Probe the static path. We use HEAD to avoid downloading the SPA HTML.
      try {
        const r = await fetch(localUrl, { method: 'HEAD' });
        if (cancelled) return;
        const ct = r.headers.get('content-type') || '';
        if (r.ok && ct.startsWith('image/')) {
          setSrc(localUrl);
          setPhase('static');
          return;
        }
      } catch {}
      if (cancelled) return;

      // Static missed — try Wikipedia.
      if (word.wiki) {
        setPhase('wiki');
        const wikiUrl = await resolveWikiImage(word);
        if (cancelled) return;
        if (wikiUrl) {
          setSrc(wikiUrl);
          return;
        }
      }
      setPhase('placeholder');
    })();

    return () => { cancelled = true; };
  }, [word.id]);

  let content;
  if (phase === 'placeholder' || (phase === 'wiki' && !src)) {
    content = <Placeholder word={word} loading={phase === 'wiki'} />;
  } else if (src) {
    content = (
      <img
        src={src}
        alt={word.en}
        loading="lazy"
        className="word-image__img"
        onError={() => setPhase('placeholder')}
      />
    );
  } else {
    // Probe in flight — show placeholder; cuts initial flicker on slow networks.
    content = <Placeholder word={word} loading />;
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
