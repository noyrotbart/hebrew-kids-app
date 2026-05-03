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

const DEFAULT_PROFILES = [];

export const loadProfiles = () => safeGet(KEY_PROFILES, DEFAULT_PROFILES);
export const saveProfiles = (p) => safeSet(KEY_PROFILES, p);

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
  // Only improve, never lower:
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
