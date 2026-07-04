import { useEffect } from 'react';
import { nodeAfter } from '../data/worlds.js';
import { celebrate } from '../lib/celebrate.js';
import { sayLine } from '../lib/audio.js';
import { cheerLine } from '../data/uiLines.js';
import { sfxSticker } from '../lib/sfx.js';
import Mascot from '../components/Mascot.jsx';
import StarMeter from '../components/StarMeter.jsx';
import BigButton from '../components/BigButton.jsx';

export default function Celebrate({ result, onNext, onMap }) {
  const { world, node, stars, earned, newSticker } = result;
  const next = nodeAfter(node.id);

  useEffect(() => {
    celebrate(stars >= 3 || newSticker ? 'big' : 'small');
    if (newSticker) sfxSticker();
    sayLine(cheerLine());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="screen celebrate" style={{ '--island-color': world.color }}>
      <Mascot mood="cheer" size={140} bubble="כָּל הַכָּבוֹד!" />
      <StarMeter stars={stars} size="lg" animated />
      {earned > 0 && <div className="celebrate__xp">+{earned} ⭐</div>}

      {newSticker && (
        <div className="celebrate__sticker">
          <div className="celebrate__sticker-emoji">{world.sticker.emoji}</div>
          <div className="celebrate__sticker-name">מַדְבֵּקָה חֲדָשָׁה: {world.sticker.name}!</div>
        </div>
      )}

      <div className="celebrate__actions">
        {next && (
          <BigButton onClick={() => onNext(next.id)}>קָדִימָה! ←</BigButton>
        )}
        <BigButton variant="ghost" onClick={onMap}>לַמַּפָּה 🗺️</BigButton>
      </div>
    </div>
  );
}
