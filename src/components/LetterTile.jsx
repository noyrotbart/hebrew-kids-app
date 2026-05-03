import { LETTER_COLOR } from '../data/alphabet.js';
import './LetterTile.css';

// A single Hebrew letter on a colored chip — used in flashcards, matching, spelling.
// `tone` is one of 'solid' | 'soft' | 'ghost'. `state` adds correct/wrong styling.
export default function LetterTile({
  letter,
  colorSlot = 1,
  size = 'md',
  tone = 'solid',
  state,
  onClick,
  disabled,
  ...rest
}) {
  const cls = ['letter-tile', `letter-tile--${size}`, `letter-tile--${tone}`];
  if (state) cls.push(`letter-tile--${state}`);
  if (onClick && !disabled) cls.push('letter-tile--interactive');

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={cls.join(' ')}
      style={{ '--tile-color': LETTER_COLOR(colorSlot) }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...rest}
    >
      <span className="letter-tile__glyph heb-display">{letter}</span>
    </Tag>
  );
}
