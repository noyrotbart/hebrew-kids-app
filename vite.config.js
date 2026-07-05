import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";

// Dev-only endpoint for the in-app recording studio (open /#studio).
// POST /__studio/save?dir=words&id=aba with a WAV body writes
// public/audio/words/aba.wav. The first overwrite of a file backs the
// original up to public/audio/_backup/<dir>/<id>.wav so nothing is lost.
const studioSave = () => ({
  name: "studio-save",
  configureServer(server) {
    server.middlewares.use("/__studio/save", (req, res) => {
      if (req.method !== "POST") { res.statusCode = 405; return res.end("POST only"); }
      const url = new URL(req.url, "http://localhost");
      const dir = url.searchParams.get("dir");
      const id = url.searchParams.get("id");
      if (!/^(words|scenes|ui|letters|tales)$/.test(dir ?? "") || !/^[a-z0-9-]+$/i.test(id ?? "")) {
        res.statusCode = 400;
        return res.end("bad params");
      }
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", async () => {
        try {
          const buf = Buffer.concat(chunks);
          if (buf.length < 1000) { res.statusCode = 400; return res.end("empty recording"); }
          const dest = path.resolve(`public/audio/${dir}/${id}.wav`);
          const bakDir = path.resolve(`public/audio/_backup/${dir}`);
          const bak = path.join(bakDir, `${id}.wav`);
          const exists = (p) => fs.access(p).then(() => true, () => false);
          if (await exists(dest) && !(await exists(bak))) {
            await fs.mkdir(bakDir, { recursive: true });
            await fs.copyFile(dest, bak);
          }
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.writeFile(dest, buf);
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ ok: true, bytes: buf.length }));
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e?.message ?? e));
        }
      });
    });
  },
});

// All audio is pre-baked under public/audio/ (letters, words, scenes, ui).
// Priority per clip: parent-recorded WAV → TTS mp3/m4a → male-only Web Speech.
export default defineConfig({
  plugins: [react(), studioSave()],
  build: {
    target: "es2020",
  },
});
