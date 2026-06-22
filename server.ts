import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. TikTok oEmbed CORS bypass endpoint
  app.get("/api/import-tiktok", async (req, res) => {
    const tiktokUrl = req.query.url;
    if (!tiktokUrl || typeof tiktokUrl !== 'string') {
      res.status(400).json({ error: "Missing or invalid url query parameter." });
      return;
    }

    try {
      const oembedResponse = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`);
      if (!oembedResponse.ok) {
        res.status(oembedResponse.status).json({ error: "TikTok oEmbed API responded with an error." });
        return;
      }

      const data = await oembedResponse.json();
      res.json(data);
    } catch (error) {
      console.error("TikTok oembed proxy error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
    }
  });

  // 2. Base health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 3. Vite middleware for development vs static asset delivery for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
