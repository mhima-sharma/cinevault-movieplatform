import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Credits,
  Genre,
  Movie,
  MovieDetails,
  PaginatedResponse,
  TvShow,
  TvShowDetails,
  VideosResponse,
} from '../models';

export type TimeWindow = 'day' | 'week';

interface DiscoverOptions {
  page?: number;
  sortBy?: string;
  withGenres?: number | string;
  withOriginalLanguage?: string;
}

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbApiUrl;
  private readonly cache = new Map<string, Observable<unknown>>();

  private get<T>(path: string, params: Record<string, string | number | undefined> = {}): Observable<T> {
    const cacheKey = path + JSON.stringify(params);
    const cached = this.cache.get(cacheKey) as Observable<T> | undefined;
    if (cached) {
      return cached;
    }

    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    }

    const request$ = this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams }).pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  // ---------- Movies ----------

  getTrendingMovies(timeWindow: TimeWindow = 'day', page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`, { page });
  }

  getPopularMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/movie/popular', { page });
  }

  getNowPlayingMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/movie/now_playing', { page });
  }

  getUpcomingMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/movie/upcoming', { page });
  }

  getTopRatedMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/movie/top_rated', { page });
  }

  discoverMovies(options: DiscoverOptions = {}): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/discover/movie', {
      page: options.page ?? 1,
      sort_by: options.sortBy ?? 'popularity.desc',
      with_genres: options.withGenres,
      with_original_language: options.withOriginalLanguage,
    });
  }

  searchMovies(query: string, page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>('/search/movie', { query, page, include_adult: 'false' });
  }

  getMovieDetails(id: number | string): Observable<MovieDetails> {
    return this.get<MovieDetails>(`/movie/${id}`);
  }

  getMovieCredits(id: number | string): Observable<Credits> {
    return this.get<Credits>(`/movie/${id}/credits`);
  }

  getMovieVideos(id: number | string): Observable<VideosResponse> {
    return this.get<VideosResponse>(`/movie/${id}/videos`);
  }

  getSimilarMovies(id: number | string, page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>(`/movie/${id}/similar`, { page });
  }

  getRecommendedMovies(id: number | string, page = 1): Observable<PaginatedResponse<Movie>> {
    return this.get<PaginatedResponse<Movie>>(`/movie/${id}/recommendations`, { page });
  }

  getMovieGenres(): Observable<{ genres: Genre[] }> {
    return this.get<{ genres: Genre[] }>('/genre/movie/list');
  }

  // ---------- TV ----------

  getTrendingTvShows(timeWindow: TimeWindow = 'day', page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>(`/trending/tv/${timeWindow}`, { page });
  }

  getPopularTvShows(page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>('/tv/popular', { page });
  }

  getTopRatedTvShows(page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>('/tv/top_rated', { page });
  }

  getAiringTodayTvShows(page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>('/tv/airing_today', { page });
  }

  searchTvShows(query: string, page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>('/search/tv', { query, page, include_adult: 'false' });
  }

  getTvDetails(id: number | string): Observable<TvShowDetails> {
    return this.get<TvShowDetails>(`/tv/${id}`);
  }

  getTvCredits(id: number | string): Observable<Credits> {
    return this.get<Credits>(`/tv/${id}/credits`);
  }

  getTvVideos(id: number | string): Observable<VideosResponse> {
    return this.get<VideosResponse>(`/tv/${id}/videos`);
  }

  getSimilarTvShows(id: number | string, page = 1): Observable<PaginatedResponse<TvShow>> {
    return this.get<PaginatedResponse<TvShow>>(`/tv/${id}/similar`, { page });
  }

  getTvGenres(): Observable<{ genres: Genre[] }> {
    return this.get<{ genres: Genre[] }>('/genre/tv/list');
  }

  // ---------- Multi search (used for search suggestions) ----------

  searchMulti(query: string, page = 1): Observable<PaginatedResponse<Movie | TvShow>> {
    return this.get<PaginatedResponse<Movie | TvShow>>('/search/multi', { query, page, include_adult: 'false' });
  }
}
