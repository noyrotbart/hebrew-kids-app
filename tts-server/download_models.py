#!/usr/bin/env python3
"""
Downloads the three model files needed by server.py.

  phonikud-1.0.int8.onnx  — Hebrew diacritisation (G2P)   ~17 MB
  shaul.onnx              — Piper TTS voice model         ~65 MB
  model.config.json       — Piper voice config            <1 KB

Total: ~82 MB.  Run once, then start server.py.
"""

import os
import sys
import urllib.request

DEST_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(DEST_DIR, exist_ok=True)

FILES = [
    (
        "phonikud-1.0.int8.onnx",
        "https://huggingface.co/thewh1teagle/phonikud-onnx/resolve/main/phonikud-1.0.int8.onnx",
    ),
    (
        "shaul.onnx",
        "https://huggingface.co/thewh1teagle/phonikud-tts-checkpoints/resolve/main/shaul.onnx",
    ),
    (
        "model.config.json",
        "https://huggingface.co/thewh1teagle/phonikud-tts-checkpoints/resolve/main/model.config.json",
    ),
]


def _progress(block_num: int, block_size: int, total_size: int) -> None:
    if total_size > 0:
        pct = min(block_num * block_size / total_size * 100, 100)
        bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
        print(f"\r    [{bar}] {pct:5.1f}%", end="", flush=True)


def main() -> None:
    all_ok = True
    for filename, url in FILES:
        dest = os.path.join(DEST_DIR, filename)
        if os.path.exists(dest):
            print(f"✅  {filename}  (already downloaded)")
            continue
        print(f"⬇️   {filename}")
        try:
            urllib.request.urlretrieve(url, dest, _progress)
            print(f"\r✅  {filename}  ({os.path.getsize(dest) // 1024 // 1024} MB)")
        except Exception as exc:
            print(f"\r❌  {filename}: {exc}")
            if os.path.exists(dest):
                os.remove(dest)
            all_ok = False

    if all_ok:
        print("\n🎉  All models ready!\n    Start the TTS server with:  python server.py\n")
    else:
        print("\n⚠️   Some downloads failed. Check your internet connection and try again.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
