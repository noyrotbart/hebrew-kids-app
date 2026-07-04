// אולפן ההקלטות — parent recording booth, hidden behind /#studio (dev only).
// Walks through every clip the app can speak: words, story sentences, host
// lines, and the letters. Records from the mic, trims silence, peak-normalizes,
// encodes 16-bit WAV, and saves straight into public/audio/<dir>/<id>.wav via
// the dev server (originals are backed up once to public/audio/_backup/).
// Parent-recorded WAVs outrank every TTS file (see audio.js), so each saved
// take immediately becomes the app's voice.

import { useEffect, useMemo, useRef, useState } from 'react';
import { WORDS } from '../data/words.js';
import { SCENES } from '../data/scenes.js';
import { UI_LINES } from '../data/uiLines.js';
import { ALPHABET } from '../data/letters.js';
import { playWord, playScene, playLetter, sayLine, stopAudio, clearAudioCache } from '../lib/audio.js';

const GROUPS = [
  { key: 'words',   label: 'מִלִּים',    items: WORDS.map(w => ({ dir: 'words', id: w.id, text: w.he, sub: `${w.roman} · ${w.en}`, play: () => playWord(w) })) },
  { key: 'scenes',  label: 'מִשְׁפָּטִים', items: SCENES.map(s => ({ dir: 'scenes', id: s.id, text: s.sentence, sub: s.id, play: () => playScene(s) })) },
  { key: 'ui',      label: 'קְרִיָּנוּת',  items: UI_LINES.map(l => ({ dir: 'ui', id: l.id, text: l.text, sub: l.id, play: () => sayLine(l) })) },
  { key: 'letters', label: 'אוֹתִיּוֹת',  items: ALPHABET.map(l => ({ dir: 'letters', id: l.id, text: l.nameHe, sub: l.nameEn, play: () => playLetter(l.id) })) },
];
const ITEMS = GROUPS.flatMap(g => g.items.map(it => ({ ...it, group: g.key })));

// Decode any MediaRecorder blob → mono, silence-trimmed, peak-normalized
// 16-bit PCM WAV. Same-browser decode of its own recording format is safe.
const blobToWav = async (blob) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
  const ch = buf.numberOfChannels;
  const n = buf.length;
  const mono = new Float32Array(n);
  for (let c = 0; c < ch; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) mono[i] += d[i] / ch;
  }
  ctx.close();

  // Trim silence (threshold 1% peak), keep 120ms pads.
  const sr = buf.sampleRate;
  const pad = Math.round(sr * 0.12);
  let start = 0, end = n - 1;
  while (start < n && Math.abs(mono[start]) < 0.01) start++;
  while (end > start && Math.abs(mono[end]) < 0.01) end--;
  start = Math.max(0, start - pad);
  end = Math.min(n - 1, end + pad);
  const trimmed = mono.subarray(start, end + 1);
  if (trimmed.length < sr * 0.1) return null; // essentially silence

  // Peak-normalize to 0.9 so takes sit at a consistent volume.
  let peak = 0;
  for (let i = 0; i < trimmed.length; i++) peak = Math.max(peak, Math.abs(trimmed[i]));
  const gain = peak > 0.001 ? 0.9 / peak : 1;

  const out = new DataView(new ArrayBuffer(44 + trimmed.length * 2));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); out.setUint32(4, 36 + trimmed.length * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
  out.setUint32(24, sr, true); out.setUint32(28, sr * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true);
  str(36, 'data'); out.setUint32(40, trimmed.length * 2, true);
  for (let i = 0; i < trimmed.length; i++) {
    const v = Math.max(-1, Math.min(1, trimmed[i] * gain));
    out.setInt16(44 + i * 2, v * 0x7FFF, true);
  }
  return new Blob([out.buffer], { type: 'audio/wav' });
};

export default function Studio() {
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [take, setTake] = useState(null); // { blob, url }
  const [saved, setSaved] = useState({}); // id -> true this session
  const [status, setStatus] = useState('');
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const takeAudioRef = useRef(null);

  const item = ITEMS[idx];
  const doneCount = Object.keys(saved).length;

  useEffect(() => () => { stopAudio(); takeAudioRef.current?.pause(); }, []);
  useEffect(() => { setTake(null); setStatus(''); }, [idx]);

  const startRec = async () => {
    stopAudio();
    setTake(null);
    setStatus('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        const wav = await blobToWav(blob).catch(() => null);
        if (!wav) { setStatus('לא שמעתי כלום — נסו שוב'); return; }
        setTake({ blob: wav, url: URL.createObjectURL(wav) });
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      setStatus('אין גישה למיקרופון');
    }
  };

  const stopRec = () => { try { recRef.current?.stop(); } catch {} };

  const playTake = () => {
    stopAudio();
    takeAudioRef.current?.pause();
    const a = new Audio(take.url);
    takeAudioRef.current = a;
    a.play();
  };

  const save = async () => {
    if (!take) return;
    setStatus('שומר…');
    try {
      const res = await fetch(`/__studio/save?dir=${item.dir}&id=${item.id}`, { method: 'POST', body: take.blob });
      const json = await res.json();
      if (!json.ok) throw new Error();
      clearAudioCache();
      setSaved(s => ({ ...s, [item.id]: true }));
      setStatus('נשמר! ✓');
      setTimeout(() => { if (idx + 1 < ITEMS.length) setIdx(idx + 1); }, 500);
    } catch {
      setStatus('שגיאה בשמירה — האולפן עובד רק בשרת הפיתוח');
    }
  };

  return (
    <div className="screen studio">
      <header className="node-player__bar">
        <div className="node-player__title">🎙️ אוּלְפַן הַהַקְלָטוֹת</div>
        <div className="studio__count">{doneCount}/{ITEMS.length}</div>
      </header>

      <div className="studio__groups">
        {GROUPS.map(g => {
          const first = ITEMS.findIndex(it => it.group === g.key);
          const groupDone = g.items.filter(it => saved[it.id]).length;
          return (
            <button
              key={g.key}
              type="button"
              className={`studio__group ${item.group === g.key ? 'studio__group--active' : ''}`}
              onClick={() => setIdx(first)}
            >
              {g.label} <small>{groupDone}/{g.items.length}</small>
            </button>
          );
        })}
      </div>

      <div className="studio__card">
        <div className="studio__text">{item.text}</div>
        <div className="studio__sub">{item.sub}</div>
        {saved[item.id] && <div className="studio__saved-flag">הוקלט ✓</div>}
      </div>

      <div className="studio__controls">
        <button type="button" className="big-btn big-btn--ghost" onClick={() => { stopAudio(); item.play(); }}>
          🔊 הַנּוֹכְחִי
        </button>
        {!recording ? (
          <button type="button" className="studio__rec-btn" onClick={startRec} aria-label="הקלטה">🔴</button>
        ) : (
          <button type="button" className="studio__rec-btn studio__rec-btn--live" onClick={stopRec} aria-label="עצירה">⏹</button>
        )}
        <button type="button" className="big-btn big-btn--ghost" onClick={playTake} disabled={!take}>
          ▶ הַהַקְלָטָה
        </button>
      </div>

      <button type="button" className="big-btn big-btn--primary studio__save" onClick={save} disabled={!take}>
        💾 שׁוֹמְרִים וּמַמְשִׁיכִים
      </button>
      <div className="studio__status">{status || (recording ? 'מַקְלִיט… דַּבְּרוּ!' : ' ')}</div>

      <div className="studio__nav">
        <button type="button" className="big-btn big-btn--ghost" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>→ הַקּוֹדֵם</button>
        <span className="studio__pos">{idx + 1} / {ITEMS.length}</span>
        <button type="button" className="big-btn big-btn--ghost" onClick={() => setIdx(Math.min(ITEMS.length - 1, idx + 1))} disabled={idx === ITEMS.length - 1}>הַבָּא ←</button>
      </div>

      <p className="studio__hint">
        טִיפּ: מַקְלִיטִים בְּחֶדֶר שָׁקֵט, קָרוֹב לַמִּיקְרוֹפוֹן. הַשֶּׁקֶט נֶחְתָּךְ וְהָעֹצְמָה מִתְאַזֶּנֶת אוֹטוֹמָטִית.
        הַקְלָטָה שֶׁלָּכֶם גּוֹבֶרֶת עַל כָּל קוֹל מְמֻחְשָׁב, וְהַמָּקוֹר נִשְׁמָר בְּגִבּוּי.
      </p>
    </div>
  );
}
