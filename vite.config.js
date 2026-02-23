import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/phonikud/* → local Phonikud TTS server (port 5050)
    // Start tts-server/server.py to enable high-quality Hebrew voice.
    // The app falls back to Web Speech API if the server isn't running.
    proxy: {
      // In dev, /api/tts is forwarded to the local Phonikud Flask server.
      // On Vercel, /api/tts is served by api/tts.js (calls HF Space instead).
      // Start tts-server/server.py for high-quality local voice;
      // the app automatically falls back to Web Speech API if it's not running.
      "/api/tts": {
        target: "http://127.0.0.1:5050",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, "/tts"),
      },
    },
  },
});
