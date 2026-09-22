export const environment = {
  production: false,
  // No API key here — requests go to our own backend proxy (server/index.js),
  // which attaches the real TMDB key server-side. See .env.example.
  tmdbApiUrl: '/api/tmdb',
  tmdbImageUrl: 'https://image.tmdb.org/t/p',
};
