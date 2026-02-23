/**
 * Vercel serverless function — Hebrew TTS via Phonikud HF Space
 *
 * POST /api/tts  { "text": "שלום" }
 * → audio/wav binary
 *
 * Locally: Vite proxies /api/tts → the local Flask server (tts-server/server.py).
 * On Vercel: this function calls the creator's HF Space server-side, so there
 * are no CORS issues and no extra server for you to manage.
 *
 * Cold-start note: HF Spaces sleep after ~15 min of inactivity.
 * The React app races with a 2.5 s timeout and falls back to Web Speech API
 * if this function is slow, then caches the response for subsequent calls.
 */

const HF_URL = "https://thewh1teagle-phonikud-tts.hf.space/generate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const text = req.body?.text?.trim();
  if (!text) {
    res.status(400).json({ error: "missing 'text' field" });
    return;
  }

  try {
    const fd = new FormData();
    fd.append("mode", "text");
    fd.append("text", text);

    const upstream = await fetch(HF_URL, {
      method: "POST",
      body: fd,
      signal: AbortSignal.timeout(9500), // stay under Vercel's 10 s default limit
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `HF Space responded ${upstream.status}` });
      return;
    }

    const { audio } = await upstream.json();
    // audio is "data:audio/wav;base64,<data>"
    const base64 = audio.replace(/^data:audio\/wav;base64,/, "");
    const wavBuffer = Buffer.from(base64, "base64");

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.send(wavBuffer);
  } catch (err) {
    // Timeout or network error — React will fall back to Web Speech API
    res.status(504).json({ error: err.message });
  }
}
