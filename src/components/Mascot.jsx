// דְּרָקִי — the kingdom's little flying dragon. Pure inline SVG: he hovers,
// flaps his wings (faster when cheering), blinks, and wiggles when booped.
// Moods: 'happy' (default), 'cheer' (arms up, open smile), 'think' (tilted).

import { useState } from 'react';

export default function Mascot({ mood = 'happy', size = 120, bubble = null, onBoop = null }) {
  const [booped, setBooped] = useState(false);
  const cheer = mood === 'cheer';
  const think = mood === 'think';

  const boop = () => {
    setBooped(true);
    onBoop?.();
  };

  return (
    <div className={`mascot ${booped ? 'mascot--boop' : ''}`} style={{ width: size }}>
      {bubble && <div className="mascot__bubble">{bubble}</div>}
      <button
        type="button"
        className="mascot__body-btn"
        onClick={boop}
        onAnimationEnd={() => setBooped(false)}
        aria-label="דרקי הדרקון"
      >
        <svg
          viewBox="0 0 150 140"
          width={size}
          height={size * (140 / 150)}
          className={`mascot__svg mascot__svg--${mood}`}
          aria-hidden="true"
        >
          {/* wings — behind the body, flapping from the shoulder */}
          <g className="mascot__wing mascot__wing--right">
            <path d="M44 74 Q18 52 12 28 Q34 34 46 50 Q40 46 38 38 Q52 50 52 66 Z" fill="#8FE3C8" stroke="#2E9E82" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g className="mascot__wing mascot__wing--left">
            <path d="M106 74 Q132 52 138 28 Q116 34 104 50 Q110 46 112 38 Q98 50 98 66 Z" fill="#8FE3C8" stroke="#2E9E82" strokeWidth="2.5" strokeLinejoin="round" />
          </g>

          {/* tail — curls out from behind, spade tip */}
          <path d="M104 100 Q128 106 132 88 Q134 78 126 74" stroke="#5BC8AC" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M130 66 L136 78 L122 78 Z" fill="#FF8FAB" stroke="#2E9E82" strokeWidth="2" strokeLinejoin="round" />

          {/* feet */}
          <ellipse cx="60" cy="122" rx="10" ry="7" fill="#3FB08F" />
          <ellipse cx="90" cy="122" rx="10" ry="7" fill="#3FB08F" />

          {/* body */}
          <ellipse cx="75" cy="92" rx="35" ry="31" fill="#5BC8AC" />
          {/* back spikes */}
          <path d="M46 74 L38 66 L50 64 Z" fill="#2E9E82" />
          <path d="M104 74 L112 66 L100 64 Z" fill="#2E9E82" />
          {/* belly */}
          <ellipse cx="75" cy="98" rx="23" ry="21" fill="#DCF7EA" />
          <path d="M60 92 Q75 96 90 92" stroke="#B8E8D2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M61 100 Q75 104 89 100" stroke="#B8E8D2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M63 108 Q75 112 87 108" stroke="#B8E8D2" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* arms */}
          {cheer ? (
            <>
              <path d="M44 84 Q30 72 28 60" stroke="#3FB08F" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d="M106 84 Q120 72 122 60" stroke="#3FB08F" strokeWidth="9" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M46 90 Q40 100 48 106" stroke="#3FB08F" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d="M104 90 Q110 100 102 106" stroke="#3FB08F" strokeWidth="9" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* head */}
          <g transform={think ? 'rotate(-7 75 40)' : undefined}>
            {/* horns */}
            <path d="M56 20 Q52 8 60 6 Q64 14 62 20 Z" fill="#FFD98E" stroke="#E0A458" strokeWidth="2" strokeLinejoin="round" />
            <path d="M94 20 Q98 8 90 6 Q86 14 88 20 Z" fill="#FFD98E" stroke="#E0A458" strokeWidth="2" strokeLinejoin="round" />
            {/* ear frills */}
            <ellipse cx="47" cy="34" rx="6" ry="9" fill="#8FE3C8" stroke="#2E9E82" strokeWidth="2" />
            <ellipse cx="103" cy="34" rx="6" ry="9" fill="#8FE3C8" stroke="#2E9E82" strokeWidth="2" />
            {/* face */}
            <circle cx="75" cy="40" r="27" fill="#5BC8AC" />
            {/* head spike */}
            <path d="M75 12 L70 20 L80 20 Z" fill="#2E9E82" />
            {/* snout */}
            <ellipse cx="75" cy="50" rx="14" ry="9" fill="#DCF7EA" />
            <circle cx="70" cy="48" r="1.6" fill="#3FB08F" />
            <circle cx="80" cy="48" r="1.6" fill="#3FB08F" />
            {/* eyes (blinking) */}
            <g className="mascot__blink">
              <ellipse cx="63" cy="36" rx="7.5" ry="8.5" fill="#fff" />
              <ellipse cx="87" cy="36" rx="7.5" ry="8.5" fill="#fff" />
              <circle cx="64.5" cy="37.5" r="4" fill="#33322E" />
              <circle cx="85.5" cy="37.5" r="4" fill="#33322E" />
              <circle cx="66" cy="35.8" r="1.4" fill="#fff" />
              <circle cx="87" cy="35.8" r="1.4" fill="#fff" />
            </g>
            {/* cheeks */}
            <circle cx="53" cy="46" r="4.5" fill="#FF9FB6" opacity="0.75" />
            <circle cx="97" cy="46" r="4.5" fill="#FF9FB6" opacity="0.75" />
            {/* mouth */}
            {cheer ? (
              <>
                <path d="M67 55 Q75 64 83 55 Q75 60 67 55" fill="#B4552D" stroke="#33322E" strokeWidth="2" strokeLinejoin="round" />
                <path d="M71 59 Q75 62 79 59" fill="#FF8FAB" />
              </>
            ) : think ? (
              <path d="M70 56 Q75 54.5 80 56" stroke="#33322E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            ) : (
              <>
                <path d="M68 55 Q75 60 82 55" stroke="#33322E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M69.5 56 L71 59 L73 56 Z" fill="#fff" />
              </>
            )}
          </g>
        </svg>
        <div className="mascot__shadow" />
      </button>
    </div>
  );
}
