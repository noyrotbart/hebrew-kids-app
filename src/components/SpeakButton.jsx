import { useState } from 'react';
import './SpeakButton.css';

// Big, friendly speak button. Shows a subtle pulse while audio is playing.
export default function SpeakButton({ onClick, label = 'הקשיבו', size = 'md' }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    setBusy(true);
    try { await onClick?.(); } finally { setBusy(false); }
  };
  return (
    <button
      className={`speak-btn speak-btn--${size} ${busy ? 'speak-btn--busy' : ''}`}
      onClick={handle}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5L7 9H4a1 1 0 0 0-1 1z"/>
        <path d="M16 8.5a4 4 0 0 1 0 7M19 5a8 8 0 0 1 0 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
      <span>{label}</span>
    </button>
  );
}
