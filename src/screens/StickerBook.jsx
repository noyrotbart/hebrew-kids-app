import { WORLDS } from '../data/worlds.js';
import Mascot from '../components/Mascot.jsx';

export default function StickerBook({ progress, onBack }) {
  const earned = progress.stickers;
  return (
    <div className="screen sticker-book">
      <header className="node-player__bar">
        <button type="button" className="node-player__exit" onClick={onBack} aria-label="חזרה">✕</button>
        <div className="node-player__title">🏆 אַלְבּוֹם הַמַּדְבֵּקוֹת</div>
      </header>

      <Mascot
        mood={earned.length === WORLDS.length ? 'cheer' : 'happy'}
        size={100}
        bubble={earned.length === WORLDS.length
          ? 'אָסַפְתֶּם אֶת כֻּלָּן!'
          : `עוֹד ${WORLDS.length - earned.length} וְסִיַּמְתֶּם!`}
      />

      <div className="sticker-book__grid">
        {WORLDS.map(world => {
          const has = earned.includes(world.id);
          return (
            <div key={world.id} className={`sticker-tile ${has ? 'sticker-tile--earned' : ''}`} style={{ '--island-color': world.color }}>
              <span className="sticker-tile__emoji">{has ? world.sticker.emoji : '❔'}</span>
              <span className="sticker-tile__name">{has ? world.sticker.name : world.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
