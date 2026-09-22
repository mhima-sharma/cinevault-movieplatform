# CineVault — Movie Discovery Platform

A movie and TV discovery app built with Angular 20 (standalone components, signals), Tailwind CSS, and the TMDB API. Browse trending/popular/top-rated titles, view details with cast and trailers, search, filter by genre and language, and save favorites/watchlist locally.

## Setup

1. Get a free TMDB v3 API key from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env` at the project root and fill in your key:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   PORT=3000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the app (starts both the backend proxy and the Angular dev server):
   ```bash
   npm start
   ```
   Open `http://localhost:4200/`.

## How requests are secured (no API key in the browser)

The Angular app **never** talks to TMDB directly and never holds the API key. Instead:

- `src/app/core/services/tmdb.service.ts` calls a same-origin path, `/api/tmdb/...` (configured in `src/environments/environment*.ts`).
- `server/index.js` is a small Express server that receives those calls, attaches the real `TMDB_API_KEY` (read from `.env`, server-side only) and forwards the request to `https://api.themoviedb.org/3/...`, then relays the response back.
- In development, `proxy.conf.json` (wired into `angular.json`'s `serve` target) forwards `/api/*` requests from the Angular dev server (port 4200) to the Express server (port 3000) — that's what `npm start` runs concurrently.
- In production, the same Express server also serves the built Angular static files, so the app and its proxy live behind one origin.

Open your browser's Network tab while using the app: every TMDB-bound request goes to `localhost:4200/api/tmdb/...` — the key itself is never sent to or visible in the browser. `.env` is git-ignored, so the real key never gets committed either.

## Architecture

- `core/` — `TmdbService` (all HTTP calls, via the proxy), `StorageService` (favorites/watchlist via localStorage), `GenreService`, `ToastService`, models.
- `shared/` — reusable UI (`movie-card`, `movie-row`, `rating`, `pagination`, skeletons, empty/error states, video modal, cast list), pipes (`tmdbImage`, `releaseYear`, `runtime`), and the `createLoadable` signal-based data-fetching helper.
- `features/` — one folder per route, each lazy-loaded via `loadComponent` in `app.routes.ts`.
- `server/` — the Express TMDB proxy + static file server for production.

## Development

```bash
npm start          # runs the proxy server (3000) + `ng serve` (4200) together
npm run server     # just the proxy server, if you want to run `ng serve` separately
```

## Building & running in production

```bash
npm run build                # ng build --configuration production
npm run server                # serves dist/movie-discovery/browser + the TMDB proxy, both from server/index.js
```

or in one step:

```bash
npm run serve:prod
```

Whichever host you deploy to, make sure `TMDB_API_KEY` is set as a server-side environment variable there (not committed, not in the Angular bundle).

## Running unit tests

```bash
ng test
```
