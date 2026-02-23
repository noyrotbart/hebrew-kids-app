# Phonikud TTS Server

Local Hebrew speech synthesis using [phonikud-tts](https://github.com/thewh1teagle/phonikud-tts) —
the same engine behind the Phonikud project, which produces clear, natural-sounding Hebrew.

## Setup (one time)

```bash
cd tts-server

# 1 – Install Python packages
pip install -r requirements.txt

# 2 – Download model files (~82 MB total)
python download_models.py
```

## Run

```bash
# In one terminal – the TTS server
python tts-server/server.py

# In another terminal – the React app
npm run dev
```

The Vite dev server proxies `/api/phonikud/*` → `http://127.0.0.1:5050/*`,
so the app automatically uses Phonikud when the server is running.
If you don't start the server, the app falls back to the browser's
built-in Web Speech API (same as before).

## API

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET  | /health | — | `{"status":"ok","voice":"shaul"}` |
| POST | /tts    | `{"text":"שלום"}` | `audio/wav` |

Responses are cached in memory, so repeated phrases are instant.
