// The kingdom map: islands stacked as a scrolling trail. Node states —
// done (stars), open (pulsing, tap to play), locked (dimmed). The view
// auto-scrolls to the first open node so the kid lands where they left off.

import { useEffect, useMemo, useRef } from 'react';
import { WORLDS, NODE_META, nodeStatus } from '../data/worlds.js';
import { LETTER_COLOR, ALPHABET_BY_ID } from '../data/letters.js';
import { sayLine } from '../lib/audio.js';
import { praiseLine } from '../data/uiLines.js';
import StarMeter from '../components/StarMeter.jsx';
import Mascot from '../components/Mascot.jsx';

const nodeIcon = (node) => {
  if (node.type === 'letter') return ALPHABET_BY_ID[node.letterId].heb;
  return NODE_META[node.type].icon;
};

export default function WorldMap({ profile, progress, onOpenNode, onOpenStickers, onSwitchProfile }) {
  const doneStars = progress.nodes;
  const openRef = useRef(null);

  const statuses = useMemo(() => {
    const map = {};
    for (const w of WORLDS) for (const n of w.nodes) map[n.id] = nodeStatus(n.id, doneStars);
    return map;
  }, [doneStars]);

  useEffect(() => {
    openRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  let openSeen = false;

  return (
    <div className="screen map">
      <header className="map__header">
        <button type="button" className="map__profile" onClick={onSwitchProfile}>
          <span className="map__avatar">{profile.avatar}</span>
          <span>{profile.name}</span>
        </button>
        <div className="map__xp">⭐ {progress.xp}</div>
        <button type="button" className="map__stickers-btn" onClick={onOpenStickers} aria-label="אלבום מדבקות">
          🏆 <span className="map__stickers-count">{progress.stickers.length}/{WORLDS.length}</span>
        </button>
      </header>

      <div className="map__trail">
        {WORLDS.map(world => {
          const worldLocked = statuses[world.nodes[0].id] === 'locked';
          const hasSticker = progress.stickers.includes(world.id);
          return (
            <section
              key={world.id}
              className={`island ${worldLocked ? 'island--locked' : ''}`}
              style={{ '--island-color': world.color }}
            >
              <div className="island__header">
                <span className="island__emoji">{world.emoji}</span>
                <div>
                  <div className="island__name">{world.name}</div>
                  {world.letters.length > 0 && (
                    <div className="island__letters">
                      {world.letters.map(l => (
                        <span key={l.id} style={{ color: LETTER_COLOR(l.color) }}>{l.heb}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`island__sticker ${hasSticker ? '' : 'island__sticker--empty'}`}>
                  {hasSticker ? world.sticker.emoji : '❔'}
                </span>
              </div>

              <div className="island__nodes">
                {world.nodes.map((node, i) => {
                  const status = statuses[node.id];
                  const isFirstOpen = status === 'open' && !openSeen;
                  if (isFirstOpen) openSeen = true;
                  const offset = Math.round(Math.sin(i * 1.9) * 60);
                  return (
                    <div key={node.id} className="map-node-row" style={{ transform: `translateX(${offset}px)` }}>
                      <button
                        type="button"
                        ref={isFirstOpen ? openRef : undefined}
                        className={`map-node map-node--${status} ${node.type === 'boss' ? 'map-node--boss' : ''}`}
                        style={node.type === 'letter'
                          ? { color: LETTER_COLOR(ALPHABET_BY_ID[node.letterId].color) }
                          : undefined}
                        onClick={() => status !== 'locked' && onOpenNode(node.id)}
                        disabled={status === 'locked'}
                        aria-label={NODE_META[node.type].label ?? node.type}
                      >
                        <span className="map-node__icon">{status === 'locked' ? '🔒' : nodeIcon(node)}</span>
                      </button>
                      {status === 'done' && <StarMeter stars={doneStars[node.id]} size="sm" />}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="map__end">
          <Mascot mood="cheer" size={110} bubble="אֵיזֶה מַסָּע!" onBoop={() => sayLine(praiseLine())} />
        </div>
      </div>
    </div>
  );
}
