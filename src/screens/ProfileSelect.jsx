import { useEffect, useState } from 'react';
import { loadProfiles, saveProfiles, saveActiveProfile, getProfileProgress } from '../lib/storage.js';
import './ProfileSelect.css';

const COLORS = ['#FF7A59', '#3DB7B0', '#FFB930', '#7C5CFF', '#3FB87E', '#E36464'];

export default function ProfileSelect({ onSelect }) {
  const [profiles, setProfiles] = useState(loadProfiles);
  const [adding, setAdding] = useState(false);

  const choose = (id) => {
    saveActiveProfile(id);
    onSelect(id);
  };

  const addProfile = (name, color) => {
    const id = `p_${Date.now().toString(36)}`;
    const next = [...profiles, { id, name, color }];
    setProfiles(next); saveProfiles(next);
    setAdding(false);
    choose(id);
  };

  return (
    <div className="screen profile-select">
      <div className="profile-select__hero">
        <div className="profile-select__brand">
          <span className="heb-display">א</span>
          <span className="heb-display">ב</span>
          <span className="heb-display">ג</span>
        </div>
        <h1>אלפבית</h1>
        <p className="muted">לומדים עברית בכיף</p>
      </div>

      <div className="profile-select__list">
        {profiles.map(p => <ProfileCard key={p.id} p={p} onClick={() => choose(p.id)} />)}
        {!adding && (
          <button className="profile-card profile-card--add" onClick={() => setAdding(true)}>
            <div className="profile-card__avatar profile-card__avatar--ghost">＋</div>
            <div className="profile-card__name">חדש</div>
          </button>
        )}
      </div>

      {adding && <AddProfile onCancel={() => setAdding(false)} onSave={addProfile} canCancel={profiles.length > 0} />}

      <div className="spacer" />
      <p className="profile-select__footnote muted">מי משחק היום?</p>
    </div>
  );
}

function ProfileCard({ p, onClick }) {
  const progress = getProfileProgress(p.id);
  const totalStars = Object.values(progress.stars ?? {}).reduce((s, v) => s + v, 0);
  return (
    <button className="profile-card" onClick={onClick}>
      <div className="profile-card__avatar" style={{ background: p.color }}>
        {p.name.slice(0, 1)}
      </div>
      <div className="profile-card__name">{p.name}</div>
      <div className="profile-card__meta">
        <span>⭐ {totalStars}</span>
        <span>·</span>
        <span>{progress.xp ?? 0} נק'</span>
      </div>
    </button>
  );
}

function AddProfile({ onCancel, onSave, canCancel }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  useEffect(() => {
    const t = setTimeout(() => document.querySelector('.profile-add input')?.focus(), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="profile-add card">
      <input
        placeholder="איך קוראים לך?"
        value={name}
        maxLength={12}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onSave(name.trim(), color); }}
      />
      <div className="profile-add__colors">
        {COLORS.map(c => (
          <button
            key={c}
            className={`profile-add__color ${color === c ? 'on' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label="צבע"
          />
        ))}
      </div>
      <div className="profile-add__actions">
        {canCancel && <button className="btn btn--ghost btn--md" onClick={onCancel}>ביטול</button>}
        <button
          className="btn btn--primary btn--md"
          disabled={!name.trim()}
          onClick={() => onSave(name.trim(), color)}
        >
          להתחיל →
        </button>
      </div>
    </div>
  );
}
