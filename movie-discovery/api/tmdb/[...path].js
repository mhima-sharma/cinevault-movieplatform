// Vercel serverless function equivalent of server/index.js's TMDB proxy.
// The Angular app calls same-origin `/api/tmdb/*`; this attaches the real
// TMDB_API_KEY (set as a Vercel project env var) server-side before forwarding.
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

module.exports = async function handler(req, res) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    res.status(500).json({ success: false, status_message: 'TMDB_API_KEY is not configured.' });
    return;
  }

  const { path, ...query } = req.query;
  const segments = Array.isArray(path) ? path : [path].filter(Boolean);
  const targetUrl = new URL(`${TMDB_BASE_URL}/${segments.join('/')}`);

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((v) => targetUrl.searchParams.append(key, v));
    } else if (value !== undefined) {
      targetUrl.searchParams.set(key, value);
    }
  }
  targetUrl.searchParams.set('api_key', TMDB_API_KEY);

  try {
    const tmdbResponse = await fetch(targetUrl);
    const body = await tmdbResponse.text();
    res.status(tmdbResponse.status);
    res.setHeader('Content-Type', tmdbResponse.headers.get('content-type') ?? 'application/json');
    res.send(body);
  } catch (error) {
    console.error('[api/tmdb] proxy error:', error);
    res.status(502).json({ success: false, status_message: 'Failed to reach TMDB.' });
  }
};
