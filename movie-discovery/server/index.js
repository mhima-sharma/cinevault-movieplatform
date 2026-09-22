// Minimal backend proxy so the TMDB API key never reaches the browser.
// The Angular app calls same-origin `/api/tmdb/*`; this server attaches the
// real key server-side before forwarding to TMDB, then serves the built
// Angular app as static files in production.
require('dotenv').config();

const express = require('express');
const path = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('[server] TMDB_API_KEY is not set. Create a .env file at the project root — see .env.example.');
}

async function fetchWithRetry(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
    }
  }
}

app.use('/api/tmdb', async (req, res) => {
  const forwardedPath = req.originalUrl.replace(/^\/api\/tmdb/, '');
  const targetUrl = new URL(TMDB_BASE_URL + forwardedPath);
  targetUrl.searchParams.set('api_key', TMDB_API_KEY ?? '');

  try {
    const tmdbResponse = await fetchWithRetry(targetUrl);
    const body = await tmdbResponse.text();
    res.status(tmdbResponse.status);
    res.set('Content-Type', tmdbResponse.headers.get('content-type') ?? 'application/json');
    res.send(body);
  } catch (error) {
    console.error('[server] TMDB proxy error:', error);
    res.status(502).json({ success: false, status_message: 'Failed to reach TMDB.' });
  }
});

// Production: serve the built Angular app and fall back to index.html for client-side routes.
const distPath = path.join(__dirname, '..', 'dist', 'movie-discovery', 'browser');
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[server] TMDB proxy running on http://localhost:${PORT}`);
});
