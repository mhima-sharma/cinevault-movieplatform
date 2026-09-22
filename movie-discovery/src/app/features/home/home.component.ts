import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideInfo, LucidePlus } from '@lucide/angular';
import { TmdbService } from '../../core/services/tmdb.service';
import { GenreService } from '../../core/services/genre.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';
import { MovieDetails } from '../../core/models';
import { TmdbImagePipe } from '../../shared/pipes/tmdb-image.pipe';
import { ReleaseYearPipe } from '../../shared/pipes/release-year.pipe';
import { MovieRowComponent } from '../../shared/components/movie-row/movie-row.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard, tvToCard } from '../../shared/utils/media-mapper';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    TmdbImagePipe,
    ReleaseYearPipe,
    MovieRowComponent,
    RatingComponent,
    ErrorMessageComponent,
    LucideInfo,
    LucidePlus,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);
  protected readonly genreService = inject(GenreService);

  protected readonly trending = createLoadable(() => this.tmdb.getTrendingMovies('day'));
  protected readonly popular = createLoadable(() => this.tmdb.getPopularMovies());
  protected readonly nowPlaying = createLoadable(() => this.tmdb.getNowPlayingMovies());
  protected readonly upcoming = createLoadable(() => this.tmdb.getUpcomingMovies());
  protected readonly topRated = createLoadable(() => this.tmdb.getTopRatedMovies());
  protected readonly popularTv = createLoadable(() => this.tmdb.getPopularTvShows());

  protected readonly hero = computed(() => this.trending.data()?.results?.[0] ?? null);
  protected readonly heroGenres = computed(() => this.genreService.movieGenreNames(this.hero()?.genre_ids));
  protected readonly heroDetails = signal<MovieDetails | null>(null);

  protected readonly popularCards = computed(() => this.popular.data()?.results.map(movieToCard) ?? []);
  protected readonly nowPlayingCards = computed(() => this.nowPlaying.data()?.results.map(movieToCard) ?? []);
  protected readonly upcomingCards = computed(() => this.upcoming.data()?.results.map(movieToCard) ?? []);
  protected readonly topRatedCards = computed(() => this.topRated.data()?.results.map(movieToCard) ?? []);
  protected readonly trendingCards = computed(() => this.trending.data()?.results.map(movieToCard) ?? []);
  protected readonly popularTvCards = computed(() => this.popularTv.data()?.results.map(tvToCard) ?? []);

  constructor() {
    this.genreService.ensureLoaded();

    effect(() => {
      const movie = this.hero();
      if (!movie) return;
      this.tmdb.getMovieDetails(movie.id).subscribe((details) => this.heroDetails.set(details));
    });
  }

  protected isInWatchlist(id: number): boolean {
    return this.storage.isInWatchlist(id, 'movie');
  }

  protected addHeroToWatchlist(): void {
    const movie = this.hero();
    if (!movie) return;
    const added = this.storage.toggleWatchlist({
      id: movie.id,
      mediaType: 'movie',
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    });
    this.toast.success(added ? `Added "${movie.title}" to watchlist` : `Removed "${movie.title}" from watchlist`);
  }
}
