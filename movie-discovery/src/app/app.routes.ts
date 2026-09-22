import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'CineVault — Discover Movies & TV Shows',
  },
  {
    path: 'movies',
    loadComponent: () => import('./features/movies/movies.component').then((m) => m.MoviesComponent),
    title: 'Movies — CineVault',
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./features/movie-details/movie-details.component').then((m) => m.MovieDetailsComponent),
    title: 'Movie Details — CineVault',
  },
  {
    path: 'tv',
    loadComponent: () => import('./features/tv/tv.component').then((m) => m.TvComponent),
    title: 'TV Shows — CineVault',
  },
  {
    path: 'tv/:id',
    loadComponent: () => import('./features/tv-details/tv-details.component').then((m) => m.TvDetailsComponent),
    title: 'TV Show Details — CineVault',
  },
  {
    path: 'genres',
    loadComponent: () => import('./features/genres/genres.component').then((m) => m.GenresComponent),
    title: 'Genres — CineVault',
  },
  {
    path: 'genres/:id',
    loadComponent: () => import('./features/genres/genre-detail.component').then((m) => m.GenreDetailComponent),
    title: 'Genre — CineVault',
  },
  {
    path: 'trending',
    loadComponent: () => import('./features/trending/trending.component').then((m) => m.TrendingComponent),
    title: 'Trending — CineVault',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then((m) => m.SearchComponent),
    title: 'Search — CineVault',
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'Favorites — CineVault',
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./features/watchlist/watchlist.component').then((m) => m.WatchlistComponent),
    title: 'Watchlist — CineVault',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found — CineVault',
  },
];
