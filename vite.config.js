import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, /api/tts proxies to a local Phonikud Flask server (tts-server/server.py, port 5050).
// In production on Vercel, /api/tts is served by api/tts.js which calls the Phonikud HF Space.
// The app prefers pre-generated static files in public/audio/words/, falling back to /api/tts,
// then to Web Speech API as a last resort.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/tts": {
        target: "http://127.0.0.1:5050",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, "/tts"),
      },
    },
  },
  build: {
    target: "es2020",
  },
});
