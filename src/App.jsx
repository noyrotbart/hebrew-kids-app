import { useEffect, useState } from 'react';
import {
  loadActiveProfile,
  loadProfiles,
  saveActiveProfile,
} from './lib/storage.js';
import { LESSONS, NUM_LESSONS } from './data/lessons.js';
import ProfileSelect from './screens/ProfileSelect.jsx';
import Home from './screens/Home.jsx';
import Lesson from './screens/Lesson.jsx';
import Complete from './screens/Complete.jsx';
import './styles/globals.css';

export default function App() {
  // route shapes: 'profile' | { name: 'home' } | { name: 'lesson', id } | { name: 'complete', result }
  const [activeId, setActiveId] = useState(loadActiveProfile);
  const [route, setRoute] = useState(activeId ? { name: 'home' } : 'profile');

  useEffect(() => {
    if (!activeId) setRoute('profile');
  }, [activeId]);

  const profiles = loadProfiles();
  const profile = profiles.find(p => p.id === activeId) ?? null;

  const goHome = () => setRoute({ name: 'home' });
  const openLesson = (id) => setRoute({ name: 'lesson', id });
  const onLessonComplete = (result) => setRoute({ name: 'complete', result });

  const continueAfterComplete = (result) => {
    const idx = LESSONS.findIndex(l => l.id === result.lesson.id);
    const next = LESSONS[Math.min(NUM_LESSONS - 1, idx + 1)];
    if (next && next.id !== result.lesson.id) openLesson(next.id);
    else goHome();
  };

  const switchProfile = () => {
    saveActiveProfile(null);
    setActiveId(null);
    setRoute('profile');
  };

  return (
    <div className="app">
      {route === 'profile' && (
        <ProfileSelect onSelect={(id) => { setActiveId(id); setRoute({ name: 'home' }); }} />
      )}
      {route?.name === 'home' && profile && (
        <Home profile={profile} onOpenLesson={openLesson} onSwitchProfile={switchProfile} />
      )}
      {route?.name === 'lesson' && profile && (
        <Lesson
          key={route.id}
          lessonId={route.id}
          profile={profile}
          onExit={goHome}
          onComplete={onLessonComplete}
        />
      )}
      {route?.name === 'complete' && profile && (
        <Complete
          result={route.result}
          onHome={goHome}
          onContinue={() => continueAfterComplete(route.result)}
        />
      )}
    </div>
  );
}
