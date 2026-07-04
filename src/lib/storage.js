// localStorage persistence. Three fixed player characters; per-player progress
// is { nodes: { [nodeId]: bestStars 1..3 }, xp, stickers: [worldId] }.

const KEY_ACTIVE = 'lk.active.v1';
const KEY_PROGRESS = 'lk.progress.v1';

const safeGet = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? fallback; }
  catch { return fallback; }
};
const safeSet = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

export const PROFILES = [
  { id: 'alma', name: 'עַלְמָה', say: 'עלמה', avatar: '🦊', color: '#FF7A59' },
  { id: 'max',  name: 'מַקְס',   say: 'מקס',  avatar: '🐼', color: '#3DB7B0' },
  { id: 'noah', name: 'נֹחַ',    say: 'נח',   avatar: '🦖', color: '#FFB930' },
];
export const PROFILE_BY_ID = Object.fromEntries(PROFILES.map(p => [p.id, p]));

export const loadActiveProfile = () => safeGet(KEY_ACTIVE, null);
export const saveActiveProfile = (id) => safeSet(KEY_ACTIVE, id);

const emptyProgress = () => ({ nodes: {}, xp: 0, stickers: [] });

export const getProgress = (profileId) => {
  const all = safeGet(KEY_PROGRESS, {});
  return all[profileId] ?? emptyProgress();
};

const putProgress = (profileId, progress) => {
  const all = safeGet(KEY_PROGRESS, {});
  safeSet(KEY_PROGRESS, { ...all, [profileId]: progress });
};

// Record a node run. Stars only ever improve; XP is granted for the delta so
// replaying a node for a better score still feels rewarding but isn't farmable.
export const recordNode = (profileId, nodeId, stars, { stickerWorldId } = {}) => {
  const cur = getProgress(profileId);
  const prev = cur.nodes[nodeId] ?? 0;
  const best = Math.max(prev, stars);
  let earned = (best - prev) * 10;

  const stickers = [...cur.stickers];
  let newSticker = false;
  if (stickerWorldId && !stickers.includes(stickerWorldId)) {
    stickers.push(stickerWorldId);
    earned += 50;
    newSticker = true;
  }

  const next = {
    ...cur,
    nodes: { ...cur.nodes, [nodeId]: best },
    xp: (cur.xp ?? 0) + earned,
    stickers,
  };
  putProgress(profileId, next);
  return { earned, totalXp: next.xp, best, newSticker };
};
