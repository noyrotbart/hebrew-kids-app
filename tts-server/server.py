#!/usr/bin/env python3
"""
Phonikud TTS server for Hebrew Kids App
========================================
Wraps phonikud-tts to provide high-quality native Hebrew speech synthesis.
Responses are cached in memory so repeated phrases are instant.

Quick start:
  cd tts-server
  pip install -r requirements.txt
  python download_models.py      # one-time model download (~200 MB)
  python server.py               # runs on http://127.0.0.1:5050
"""

import io
import hashlib
import os
import sys

from flask import Flask, request, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow the Vite dev server (and iPad) to call us

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

_phonikud = None
_piper    = None
_cache: dict[str, bytes] = {}   # md5(text) → raw WAV bytes


def load_models() -> None:
    global _phonikud, _piper

    onnx_path   = os.path.join(MODEL_DIR, "phonikud-1.0.int8.onnx")
    voice_path  = os.path.join(MODEL_DIR, "shaul.onnx")
    config_path = os.path.join(MODEL_DIR, "model.config.json")

    missing = [p for p in (onnx_path, voice_path, config_path) if not os.path.exists(p)]
    if missing:
        print("❌  Missing model file(s):")
        for p in missing:
            print(f"      {p}")
        print("\n   Run first:  python download_models.py\n")
        sys.exit(1)

    print("⏳  Loading Phonikud G2P model …", flush=True)
    from phonikud_tts import Phonikud
    _phonikud = Phonikud(onnx_path)

    print("⏳  Loading Piper voice (Shaul) …", flush=True)
    from phonikud_tts import Piper
    _piper = Piper(voice_path, config_path)

    print("✅  Ready — listening on http://127.0.0.1:5050\n", flush=True)


@app.route("/health")
def health():
    return jsonify({"status": "ok", "voice": "shaul"})


@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify({"error": "missing 'text' field"}), 400

    cache_key = hashlib.md5(text.encode("utf-8")).hexdigest()

    if cache_key not in _cache:
        try:
            from phonikud_tts import phonemize
            import soundfile as sf
            import numpy as np

            diacritics = _phonikud.add_diacritics(text)
            phonemes   = phonemize(diacritics)
            samples, sr = _piper.create(phonemes, is_phonemes=True)

            buf = io.BytesIO()
            sf.write(buf, np.array(samples), sr, format="WAV")
            _cache[cache_key] = buf.getvalue()

        except Exception as exc:
            print(f"TTS error for '{text}': {exc}", flush=True)
            return jsonify({"error": str(exc)}), 500

    return Response(
        _cache[cache_key],
        mimetype="audio/wav",
        headers={"Cache-Control": "max-age=86400"},
    )


if __name__ == "__main__":
    load_models()
    app.run(host="127.0.0.1", port=5050, debug=False)
