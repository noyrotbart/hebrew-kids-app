import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/phonikud/* → local Phonikud TTS server (port 5050)
    // Start tts-server/server.py to enable high-quality Hebrew voice.
    // The app falls back to Web Speech API if the server isn't running.
    proxy: {
      "/api/phonikud": {
        target: "http://127.0.0.1:5050",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/phonikud/, ""),
      },
    },
  },
});
