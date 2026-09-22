import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideBookmark, LucideCalendar, LucideClock, LucideHeart, LucidePlay } from '@lucide/angular';
import { TmdbService } from '../../core/services/tmdb.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';
import { Credits, MovieDetails, Video } from '../../core/models';
import { TmdbImagePipe } from '../../shared/pipes/tmdb-image.pipe';
import { ReleaseYearPipe } from '../../shared/pipes/release-year.pipe';
import { RuntimePipe } from '../../shared/pipes/runtime.pipe';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { CastListComponent } from '../../shared/components/cast-list/cast-list.component';
import { VideoModalComponent } from '../../shared/components/video-modal/video-modal.component';
import { MovieRowComponent } from '../../shared/components/movie-row/movie-row.component';
import { DetailsSkeletonComponent } from '../../shared/components/loading-skeleton/details-skeleton.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard } from '../../shared/utils/media-mapper';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    RouterLink,
    TmdbImagePipe,
    ReleaseYearPipe,
    RuntimePipe,
    RatingComponent,
    CastListComponent,
    VideoModalComponent,
    MovieRowComponent,
    DetailsSkeletonComponent,
    ErrorMessageComponent,
    LucideArrowLeft,
    LucidePlay,
    LucideHeart,
    LucideBookmark,
    LucideClock,
    LucideCalendar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);

  readonly id = input.required<string>();

  protected readonly details = createLoadable<MovieDetails>(() => this.tmdb.getMovieDetails(this.id()), { auto: false });
  protected readonly credits = createLoadable<Credits>(() => this.tmdb.getMovieCredits(this.id()), { auto: false });
  protected readonly similar = createLoadable(() => this.tmdb.getSimilarMovies(this.id()), { auto: false });
  protected readonly recommended = createLoadable(() => this.tmdb.getRecommendedMovies(this.id()), { auto: false });
  private readonly videosLoadable = createLoadable(() => this.tmdb.getMovieVideos(this.id()), { auto: false });

  protected readonly activeVideoKey = signal<string | null>(null);

  protected readonly trailer = computed<Video | null>(() => {
    const videos = this.videosLoadable.data()?.results ?? [];
    return (
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
      videos.find((v) => v.site === 'YouTube') ??
      null
    );
  });

  protected readonly similarCards = computed(() => this.similar.data()?.results.map(movieToCard) ?? []);
  protected readonly recommendedCards = computed(() => this.recommended.data()?.results.map(movieToCard) ?? []);

  protected readonly isFavorite = computed(() => this.storage.isFavorite(Number(this.id()), 'movie'));
  protected readonly isInWatchlist = computed(() => this.storage.isInWatchlist(Number(this.id()), 'movie'));

  constructor() {
    effect(() => {
      this.id();
      this.details.reload();
      this.credits.reload();
      this.similar.reload();
      this.recommended.reload();
      this.videosLoadable.reload();
    });
  }

  playTrailer(): void {
    const key = this.trailer()?.key;
    if (key) {
      this.activeVideoKey.set(key);
    } else {
      this.toast.error('No trailer available for this title.');
    }
  }

  toggleFavorite(): void {
    const movie = this.details.data();
    if (!movie) return;
    const added = this.storage.toggleFavorite({
      id: movie.id,
      mediaType: 'movie',
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    });
    this.toast.success(added ? `Added "${movie.title}" to favorites` : `Removed "${movie.title}" from favorites`);
  }

  toggleWatchlist(): void {
    const movie = this.details.data();
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

  formatCurrency(value: number): string {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }
}
