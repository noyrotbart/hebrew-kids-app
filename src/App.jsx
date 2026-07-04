import { useState } from 'react';
import { PROFILE_BY_ID, loadActiveProfile, saveActiveProfile, getProgress } from './lib/storage.js';
import ProfileSelect from './screens/ProfileSelect.jsx';
import WorldMap from './screens/WorldMap.jsx';
import NodePlayer from './screens/NodePlayer.jsx';
import Celebrate from './screens/Celebrate.jsx';
import StickerBook from './screens/StickerBook.jsx';
import Studio from './screens/Studio.jsx';
import './styles/globals.css';

export default function App() {
  // route: 'profile' | {name:'map'} | {name:'node', id} | {name:'celebrate', result} | {name:'stickers'}
  const [activeId, setActiveId] = useState(loadActiveProfile);
  const [route, setRoute] = useState(activeId ? { name: 'map' } : 'profile');
  // Parent recording booth, kept off the kids' path: open /#studio directly.
  const [studio] = useState(() => window.location.hash === '#studio');

  if (studio) return <div className="app"><Studio /></div>;

  const profile = PROFILE_BY_ID[activeId] ?? null;

  const selectProfile = (id) => {
    saveActiveProfile(id);
    setActiveId(id);
    setRoute({ name: 'map' });
  };

  const switchProfile = () => {
    saveActiveProfile(null);
    setActiveId(null);
    setRoute('profile');
  };

  const goMap = () => setRoute({ name: 'map' });
  const openNode = (id) => setRoute({ name: 'node', id });

  if (route === 'profile' || !profile) {
    return <div className="app"><ProfileSelect onSelect={selectProfile} /></div>;
  }

  return (
    <div className="app">
      {route.name === 'map' && (
        <WorldMap
          profile={profile}
          progress={getProgress(profile.id)}
          onOpenNode={openNode}
          onOpenStickers={() => setRoute({ name: 'stickers' })}
          onSwitchProfile={switchProfile}
        />
      )}
      {route.name === 'node' && (
        <NodePlayer
          key={route.id}
          nodeId={route.id}
          profile={profile}
          onExit={goMap}
          onComplete={(result) => setRoute({ name: 'celebrate', result })}
        />
      )}
      {route.name === 'celebrate' && (
        <Celebrate result={route.result} onNext={openNode} onMap={goMap} />
      )}
      {route.name === 'stickers' && (
        <StickerBook progress={getProgress(profile.id)} onBack={goMap} />
      )}
    </div>
  );
}
