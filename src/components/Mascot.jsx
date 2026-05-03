import './Mascot.css';

// Friendly host character. Purely SVG, no external assets — small enough to
// inline everywhere it's needed. State-driven expressions:
//   idle       gentle breathing + occasional blink
//   listening  slight head tilt, eyes wide open, "ear" wiggle
//   cheer      bouncy + open smile (used after correct answer / lesson complete)
//   sad        droopy eyes, frown (used after a miss, briefly)
//   think      one eye squinted, head tilted
//
// Sized via the `size` prop: 'sm' | 'md' | 'lg' | 'xl'. The SVG always
// contains the same geometry; CSS scales the wrapper.

export default function Mascot({ state = 'idle', size = 'md' }) {
  return (
    <div className={`mascot mascot--${size} mascot--${state}`} aria-hidden>
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        {/* Drop shadow for warmth */}
        <ellipse cx="60" cy="108" rx="36" ry="5" fill="rgba(21,25,44,0.12)" />

        {/* Two leaf-like tufts on top (the "ears") */}
        <g className="mascot__tufts">
          <path d="M 38 22 Q 36 8 50 14 Q 50 22 42 26 Z" fill="#FFB930" />
          <path d="M 82 22 Q 84 8 70 14 Q 70 22 78 26 Z" fill="#FFB930" />
        </g>

        {/* Body — single round shape so the whole character feels cohesive */}
        <circle cx="60" cy="64" r="40" fill="#FF7A59" />
        <circle cx="60" cy="64" r="40" fill="url(#mascotGloss)" opacity="0.18" />

        {/* Cheek blush */}
        <circle cx="38" cy="74" r="6" fill="#FFB7A2" opacity="0.7" />
        <circle cx="82" cy="74" r="6" fill="#FFB7A2" opacity="0.7" />

        {/* Eyes — same paths in all states; expressions come from CSS transforms */}
        <g className="mascot__eyes">
          <g className="mascot__eye mascot__eye--left">
            <ellipse cx="48" cy="58" rx="8" ry="9" fill="#fff" />
            <circle  cx="49" cy="59" r="4" fill="#15192C" />
            <circle  cx="50" cy="57" r="1.4" fill="#fff" />
          </g>
          <g className="mascot__eye mascot__eye--right">
            <ellipse cx="72" cy="58" rx="8" ry="9" fill="#fff" />
            <circle  cx="73" cy="59" r="4" fill="#15192C" />
            <circle  cx="74" cy="57" r="1.4" fill="#fff" />
          </g>
        </g>

        {/* Mouth — multiple paths, only one visible per state */}
        <g className="mascot__mouth">
          {/* Default neutral smile */}
          <path className="mascot__m mascot__m--smile"  d="M 48 78 Q 60 88 72 78" stroke="#15192C" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Big open cheer */}
          <path className="mascot__m mascot__m--open"   d="M 46 78 Q 60 96 74 78 Q 60 86 46 78 Z" fill="#15192C" />
          {/* Sad frown */}
          <path className="mascot__m mascot__m--frown"  d="M 48 84 Q 60 76 72 84" stroke="#15192C" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Thinking — small flat */}
          <path className="mascot__m mascot__m--flat"   d="M 50 82 L 70 82" stroke="#15192C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        <defs>
          <linearGradient id="mascotGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
