// TMDB proxy. Vercel's dynamic catch-all function routing ([...path].js)
// does not reliably match multi-segment paths on this project, so the real
// TMDB path is forwarded here as a `path` query param via a vercel.json
// rewrite instead (/api/tmdb/:path* -> /api/proxy?path=:path*).
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

module.exports = async function handler(req, res) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    res.status(500).json({ success: false, status_message: 'TMDB_API_KEY is not configured.' });
    return;
  }

  const requestUrl = new URL(req.url, 'http://localhost');
  const rawPath = requestUrl.searchParams.get('path') ?? '';
  requestUrl.searchParams.delete('path');

  const targetUrl = new URL(`${TMDB_BASE_URL}/${rawPath}`);
  for (const [key, value] of requestUrl.searchParams) {
    targetUrl.searchParams.append(key, value);
  }
  targetUrl.searchParams.set('api_key', TMDB_API_KEY);

  try {
    const tmdbResponse = await fetch(targetUrl);
    const body = await tmdbResponse.text();
    res.status(tmdbResponse.status);
    res.setHeader('Content-Type', tmdbResponse.headers.get('content-type') ?? 'application/json');
    res.send(body);
  } catch (error) {
    console.error('[api/proxy] error:', error);
    res.status(502).json({ success: false, status_message: 'Failed to reach TMDB.' });
  }
};
