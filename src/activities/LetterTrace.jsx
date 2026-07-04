// Finger/mouse tracing over a big guide glyph. No hand-authored stroke data:
// the glyph is rasterized to sample points, and we score by
//   coverage  — how much of the glyph the kid's crayon touched
//   precision — how much of the crayon stayed on the glyph (anti-scribble)
// Checks run continuously while drawing; passing triggers automatically.
// The "סיימתי" button relaxes thresholds a little on each attempt so nobody
// gets stuck, and after 3 attempts it always lets the kid through.

import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from '../lib/util.js';
import { sfxCorrect, sfxWrong } from '../lib/sfx.js';

const W = 320;
const H = 340;
const BRUSH = 15;
const FONT = '900 230px Heebo, sans-serif';
const GRID = 10;           // spatial-hash cell size, px
const COVER_RADIUS = 14;   // guide point counts as covered within this distance
const cellsInRadius = Math.ceil(COVER_RADIUS / GRID);

// Pass thresholds. A single lucky swipe across the glyph used to pass —
// now the kid needs to cover ~90% of the letter and keep ~70% of the crayon
// on it. The "סיימתי" button relaxes these a little per attempt so nobody
// gets stuck, and attempt 3 always goes through.
const AUTO_COVERAGE = 0.88;
const AUTO_PRECISION = 0.70;
const RELAX_PER_ATTEMPT = 0.07;

export default function LetterTrace({ glyph, color = '#7C5CFF', onDone }) {
  const canvasRef = useRef(null);
  const guidePtsRef = useRef([]);
  const guideCellsRef = useRef(new Set());
  const drawnCellsRef = useRef(new Set());
  const drawnCountRef = useRef(0);
  const onGuideCountRef = useRef(0);
  const lastPtRef = useRef(null);
  const movesSinceCheckRef = useRef(0);
  const attemptsRef = useRef(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [coverage, setCoverage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [nudge, setNudge] = useState(false);

  const cellKey = (x, y) => `${Math.floor(x / GRID)},${Math.floor(y / GRID)}`;

  const drawGuide = useCallback((ctx) => {
    ctx.clearRect(0, 0, W, H);
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#EFE6D4';
    ctx.fillText(glyph, W / 2, H / 2 + 8);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#DCCFB4';
    ctx.strokeText(glyph, W / 2, H / 2 + 8);
  }, [glyph]);

  // Rasterize the glyph offscreen and sample guide points every few px.
  const buildGuide = useCallback(() => {
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(glyph, W / 2, H / 2 + 8);
    const data = ctx.getImageData(0, 0, W, H).data;
    const pts = [];
    const cells = new Set();
    for (let y = 0; y < H; y += 5) {
      for (let x = 0; x < W; x += 5) {
        if (data[(y * W + x) * 4 + 3] > 100) {
          pts.push([x, y]);
          cells.add(cellKey(x, y));
        }
      }
    }
    guidePtsRef.current = pts;
    guideCellsRef.current = cells;
  }, [glyph]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const ready = () => {
      if (cancelled) return;
      buildGuide();
      drawGuide(ctx);
    };
    if (document.fonts?.load) {
      document.fonts.load(FONT).then(ready, ready);
    } else {
      ready();
    }
    return () => { cancelled = true; };
  }, [buildGuide, drawGuide]);

  const scores = () => {
    const guidePts = guidePtsRef.current;
    const drawnCells = drawnCellsRef.current;
    if (!guidePts.length || !drawnCells.size) return { coverage: 0, precision: 0 };
    let covered = 0;
    for (const [x, y] of guidePts) {
      const cx = Math.floor(x / GRID);
      const cy = Math.floor(y / GRID);
      let hit = false;
      for (let dy = -cellsInRadius; dy <= cellsInRadius && !hit; dy++) {
        for (let dx = -cellsInRadius; dx <= cellsInRadius && !hit; dx++) {
          if (drawnCells.has(`${cx + dx},${cy + dy}`)) hit = true;
        }
      }
      if (hit) covered++;
    }
    const precision = drawnCountRef.current ? onGuideCountRef.current / drawnCountRef.current : 0;
    return { coverage: covered / guidePts.length, precision };
  };

  const finish = (score) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPassed(true);
    sfxCorrect();
    setTimeout(() => onDoneRef.current?.(clamp(score, 0, 1)), 1100);
  };

  const checkAuto = () => {
    const { coverage: cov, precision } = scores();
    setCoverage(cov);
    if (cov >= AUTO_COVERAGE && precision >= AUTO_PRECISION) finish(0.4 + cov * 0.6);
  };

  const checkManual = () => {
    if (doneRef.current) return;
    attemptsRef.current++;
    const attempts = attemptsRef.current;
    const { coverage: cov, precision } = scores();
    setCoverage(cov);
    const needCov = Math.max(0.6, AUTO_COVERAGE - attempts * RELAX_PER_ATTEMPT);
    const needPrec = Math.max(0.45, AUTO_PRECISION - attempts * RELAX_PER_ATTEMPT);
    if ((cov >= needCov && precision >= needPrec) || attempts >= 3) {
      finish(attempts >= 3 ? 0.45 : 0.4 + cov * 0.6);
    } else {
      sfxWrong();
      setNudge(true);
    }
  };

  const clear = () => {
    if (doneRef.current) return;
    drawnCellsRef.current = new Set();
    drawnCountRef.current = 0;
    onGuideCountRef.current = 0;
    lastPtRef.current = null;
    setCoverage(0);
    const ctx = canvasRef.current.getContext('2d');
    drawGuide(ctx);
  };

  const toLocal = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return [
      (e.clientX - rect.left) * (W / rect.width),
      (e.clientY - rect.top) * (H / rect.height),
    ];
  };

  const addPoint = (x, y, drawFrom) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(drawFrom ? drawFrom[0] : x, drawFrom ? drawFrom[1] : y);
    ctx.lineTo(x, y);
    ctx.stroke();

    drawnCellsRef.current.add(cellKey(x, y));
    drawnCountRef.current++;
    // Precision sample: is this point on (or hugging) the glyph?
    const cx = Math.floor(x / GRID);
    const cy = Math.floor(y / GRID);
    let on = false;
    for (let dy = -1; dy <= 1 && !on; dy++) {
      for (let dx = -1; dx <= 1 && !on; dx++) {
        if (guideCellsRef.current.has(`${cx + dx},${cy + dy}`)) on = true;
      }
    }
    if (on) onGuideCountRef.current++;
  };

  const onPointerDown = (e) => {
    if (doneRef.current) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    const [x, y] = toLocal(e);
    lastPtRef.current = [x, y];
    addPoint(x, y, null);
  };

  const onPointerMove = (e) => {
    if (doneRef.current || !lastPtRef.current) return;
    const [x, y] = toLocal(e);
    const [lx, ly] = lastPtRef.current;
    if (Math.hypot(x - lx, y - ly) < 3) return;
    addPoint(x, y, lastPtRef.current);
    lastPtRef.current = [x, y];
    if (++movesSinceCheckRef.current >= 14) {
      movesSinceCheckRef.current = 0;
      checkAuto();
    }
  };

  const onPointerUp = () => {
    lastPtRef.current = null;
    if (!doneRef.current) checkAuto();
  };

  return (
    <div className={`trace ${passed ? 'trace--passed' : ''}`}>
      <div className="trace__frame">
        <canvas
          ref={canvasRef}
          className="trace__canvas"
          style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}`, touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {passed && <div className="trace__spark">✨</div>}
      </div>
      <div className="trace__meter"><div className="trace__meter-fill" style={{ width: `${Math.round(coverage * 100)}%` }} /></div>
      <div className="trace__actions">
        <button type="button" className="big-btn big-btn--ghost" onClick={clear} disabled={passed}>🧽 מוֹחֲקִים</button>
        <button
          type="button"
          className={`big-btn big-btn--primary ${nudge ? 'shake' : ''}`}
          onAnimationEnd={() => setNudge(false)}
          onClick={checkManual}
          disabled={passed}
        >
          סִיַּמְתִּי!
        </button>
      </div>
    </div>
  );
}
