import './Button.css';

export default function Button({ variant = 'primary', size = 'md', full, disabled, children, ...rest }) {
  const cls = ['btn', `btn--${variant}`, `btn--${size}`];
  if (full) cls.push('btn--full');
  if (disabled) cls.push('btn--disabled');
  return (
    <button className={cls.join(' ')} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
