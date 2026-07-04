// Hosts a single map node's activity, translates its 0..1 score into stars,
// records progress, and hands off to the celebrate screen.

import { NODE_BY_ID, WORLD_BY_ID, NODE_META } from '../data/worlds.js';
import { ALPHABET_BY_ID } from '../data/letters.js';
import { recordNode } from '../lib/storage.js';
import { stopAudio } from '../lib/audio.js';
import LetterQuest from '../activities/LetterQuest.jsx';
import WordBuilder from '../activities/WordBuilder.jsx';
import EchoSpeak from '../activities/EchoSpeak.jsx';
import MemoryMatch from '../activities/MemoryMatch.jsx';
import BossQuiz from '../activities/BossQuiz.jsx';
import FinalsMeet from '../activities/FinalsMeet.jsx';
import StoryBuilder from '../activities/StoryBuilder.jsx';

const starsFor = (score) => (score >= 0.85 ? 3 : score >= 0.55 ? 2 : 1);

export default function NodePlayer({ nodeId, profile, onExit, onComplete }) {
  const node = NODE_BY_ID[nodeId];
  const world = WORLD_BY_ID[node.worldId];

  const handleDone = (score) => {
    stopAudio();
    const stars = starsFor(score);
    const result = recordNode(profile.id, node.id, stars, {
      stickerWorldId: node.type === 'boss' ? world.id : undefined,
    });
    onComplete({ node, world, stars, ...result });
  };

  const title = node.type === 'letter'
    ? `הָאוֹת ${ALPHABET_BY_ID[node.letterId].nameHe}`
    : NODE_META[node.type].label;

  return (
    <div className="screen node-player" style={{ '--island-color': world.color }}>
      <header className="node-player__bar">
        <button type="button" className="node-player__exit" onClick={() => { stopAudio(); onExit(); }} aria-label="חזרה למפה">
          ✕
        </button>
        <div className="node-player__title">{world.emoji} {title}</div>
      </header>
      <div className="node-player__stage">
        {node.type === 'letter' && (
          <LetterQuest world={world} letter={ALPHABET_BY_ID[node.letterId]} onDone={handleDone} />
        )}
        {node.type === 'lab' && <WordBuilder world={world} onDone={handleDone} />}
        {node.type === 'echo' && <EchoSpeak world={world} onDone={handleDone} />}
        {node.type === 'memory' && <MemoryMatch world={world} onDone={handleDone} />}
        {node.type === 'boss' && <BossQuiz world={world} onDone={handleDone} />}
        {node.type === 'finals' && <FinalsMeet onDone={handleDone} />}
        {node.type === 'story' && <StoryBuilder node={node} onDone={handleDone} />}
      </div>
    </div>
  );
}
