import { PROFILES } from '../lib/storage.js';
import { sayLine } from '../lib/audio.js';
import { greetingLine, LINE_BY_ID } from '../data/uiLines.js';
import Mascot from '../components/Mascot.jsx';

export default function ProfileSelect({ onSelect }) {
  const choose = (p) => {
    sayLine(greetingLine(p.id));
    onSelect(p.id);
  };

  return (
    <div className="screen profile-select">
      <Mascot mood="cheer" size={130} bubble="מִי מְשַׂחֵק הַיּוֹם?" onBoop={() => sayLine(LINE_BY_ID.hello)} />
      <h1 className="profile-select__title">מַמְלֶכֶת הָאוֹתִיּוֹת</h1>
      <div className="profile-select__cards">
        {PROFILES.map(p => (
          <button
            key={p.id}
            type="button"
            className="profile-card"
            style={{ '--profile-color': p.color }}
            onClick={() => choose(p)}
          >
            <span className="profile-card__avatar">{p.avatar}</span>
            <span className="profile-card__name">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
