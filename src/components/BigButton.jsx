// Chunky toy-style button. variant: primary | ghost | round.

export default function BigButton({ children, onClick, variant = 'primary', disabled, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      className={`big-btn big-btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
