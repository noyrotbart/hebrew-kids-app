// Lightweight typed wrapper around localStorage. Profile is the active player,
// progress is per-profile (lesson stars + total XP).

const KEY_PROFILES = 'hka.profiles.v1';
const KEY_ACTIVE   = 'hka.active.v1';
const KEY_PROGRESS = 'hka.progress.v1'; // { [profileId]: { stars: { [lessonId]: 0..3 }, xp } }

const safeGet = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? fallback; }
  catch { return fallback; }
};
const safeSet = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

// The app always ships with these three characters. Kids pick one as
// "their" player. Names are short so Hebrew TTS reads them cleanly when
// greeting / praising.
const DEFAULT_PROFILES = [
  { id: 'alma', name: 'עלמה', color: '#FF7A59' },
  { id: 'max',  name: 'מקס',  color: '#3DB7B0' },
  { id: 'noah', name: 'נח',   color: '#FFB930' },
];

// Migrate older saved state: if profiles don't include all three defaults,
// splice the missing ones in (preserving custom profiles users may have).
const ensureDefaults = (saved) => {
  if (!Array.isArray(saved)) return [...DEFAULT_PROFILES];
  const haveIds = new Set(saved.map(p => p.id));
  const missing = DEFAULT_PROFILES.filter(p => !haveIds.has(p.id));
  if (missing.length === 0) return saved;
  // Defaults always come first, then any user-added customs.
  const customs = saved.filter(p => !DEFAULT_PROFILES.some(d => d.id === p.id));
  return [...DEFAULT_PROFILES, ...customs];
};

export const loadProfiles = () => ensureDefaults(safeGet(KEY_PROFILES, DEFAULT_PROFILES));
export const saveProfiles = (p) => safeSet(KEY_PROFILES, ensureDefaults(p));

export const loadActiveProfile = () => safeGet(KEY_ACTIVE, null);
export const saveActiveProfile = (id) => safeSet(KEY_ACTIVE, id);

export const loadProgress = () => safeGet(KEY_PROGRESS, {});
export const saveProgress = (p) => safeSet(KEY_PROGRESS, p);

export const getProfileProgress = (profileId) => {
  const all = loadProgress();
  return all[profileId] ?? { stars: {}, xp: 0 };
};

export const recordLessonStars = (profileId, lessonId, stars) => {
  const all = loadProgress();
  const cur = all[profileId] ?? { stars: {}, xp: 0 };
  const prev = cur.stars[lessonId] ?? 0;
  const best = Math.max(prev, stars);
  const earned = (best - prev) * 30; // 30 XP per new star earned
  const next = {
    ...cur,
    stars: { ...cur.stars, [lessonId]: best },
    xp: (cur.xp ?? 0) + earned,
  };
  saveProgress({ ...all, [profileId]: next });
  return { earned, total: next.xp, best };
};
