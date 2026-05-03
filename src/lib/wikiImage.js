// Resolve a word's display image from Wikipedia's REST summary endpoint.
//   GET https://en.wikipedia.org/api/rest_v1/page/summary/{title}
//     → { thumbnail: { source }, originalimage: { source }, ... }
// Free, no API key, CORS-open. Results are cached in localStorage so we hit
// the network at most once per word per device.

const CACHE_KEY = 'hka.wiki-img.v1';

const loadCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}'); }
  catch { return {}; }
};
const saveCache = (cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
};

const inflight = new Map(); // wordId → Promise<string|null>

export const resolveWikiImage = (word) => {
  if (!word?.wiki) return Promise.resolve(null);
  const cache = loadCache();
  if (cache[word.id] !== undefined) {
    return Promise.resolve(cache[word.id]);
  }
  if (inflight.has(word.id)) return inflight.get(word.id);

  const p = (async () => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word.wiki)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error(`wiki ${res.status}`);
      const json = await res.json();
      // Prefer originalimage when available — usually higher resolution.
      const src = json.originalimage?.source || json.thumbnail?.source || null;
      const c = loadCache();
      c[word.id] = src;
      saveCache(c);
      return src;
    } catch {
      const c = loadCache();
      c[word.id] = null; // negative cache so we don't retry hot
      saveCache(c);
      return null;
    } finally {
      inflight.delete(word.id);
    }
  })();
  inflight.set(word.id, p);
  return p;
};
