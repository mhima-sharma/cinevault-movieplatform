import { Injectable, computed, inject, signal } from '@angular/core';
import { Genre } from '../models';
import { TmdbService } from './tmdb.service';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private readonly tmdb = inject(TmdbService);

  private readonly movieGenresState = signal<Genre[]>([]);
  private readonly tvGenresState = signal<Genre[]>([]);

  readonly movieGenres = this.movieGenresState.asReadonly();
  readonly tvGenres = this.tvGenresState.asReadonly();

  private readonly movieGenreMap = computed(() => new Map(this.movieGenresState().map((g) => [g.id, g.name])));
  private readonly tvGenreMap = computed(() => new Map(this.tvGenresState().map((g) => [g.id, g.name])));

  private loaded = false;

  ensureLoaded(): void {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.tmdb.getMovieGenres().subscribe((res) => this.movieGenresState.set(res.genres));
    this.tmdb.getTvGenres().subscribe((res) => this.tvGenresState.set(res.genres));
  }

  movieGenreNames(ids: number[] | undefined): string[] {
    if (!ids?.length) return [];
    const map = this.movieGenreMap();
    return ids.map((id) => map.get(id)).filter((name): name is string => !!name);
  }

  tvGenreNames(ids: number[] | undefined): string[] {
    if (!ids?.length) return [];
    const map = this.tvGenreMap();
    return ids.map((id) => map.get(id)).filter((name): name is string => !!name);
  }
}
