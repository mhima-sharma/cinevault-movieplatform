import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideBookmark, LucideCalendar, LucideHeart, LucideLayers, LucidePlay } from '@lucide/angular';
import { TmdbService } from '../../core/services/tmdb.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';
import { Credits, TvShowDetails, Video } from '../../core/models';
import { TmdbImagePipe } from '../../shared/pipes/tmdb-image.pipe';
import { ReleaseYearPipe } from '../../shared/pipes/release-year.pipe';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { CastListComponent } from '../../shared/components/cast-list/cast-list.component';
import { VideoModalComponent } from '../../shared/components/video-modal/video-modal.component';
import { MovieRowComponent } from '../../shared/components/movie-row/movie-row.component';
import { DetailsSkeletonComponent } from '../../shared/components/loading-skeleton/details-skeleton.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { createLoadable } from '../../shared/utils/loadable';
import { tvToCard } from '../../shared/utils/media-mapper';

@Component({
  selector: 'app-tv-details',
  standalone: true,
  imports: [
    RouterLink,
    TmdbImagePipe,
    ReleaseYearPipe,
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
    LucideCalendar,
    LucideLayers,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tv-details.component.html',
})
export class TvDetailsComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);

  readonly id = input.required<string>();

  protected readonly details = createLoadable<TvShowDetails>(() => this.tmdb.getTvDetails(this.id()), { auto: false });
  protected readonly credits = createLoadable<Credits>(() => this.tmdb.getTvCredits(this.id()), { auto: false });
  protected readonly similar = createLoadable(() => this.tmdb.getSimilarTvShows(this.id()), { auto: false });
  private readonly videosLoadable = createLoadable(() => this.tmdb.getTvVideos(this.id()), { auto: false });

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

  protected readonly similarCards = computed(() => this.similar.data()?.results.map(tvToCard) ?? []);

  protected readonly isFavorite = computed(() => this.storage.isFavorite(Number(this.id()), 'tv'));
  protected readonly isInWatchlist = computed(() => this.storage.isInWatchlist(Number(this.id()), 'tv'));

  constructor() {
    effect(() => {
      this.id();
      this.details.reload();
      this.credits.reload();
      this.similar.reload();
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
    const show = this.details.data();
    if (!show) return;
    const added = this.storage.toggleFavorite({
      id: show.id,
      mediaType: 'tv',
      title: show.name,
      posterPath: show.poster_path,
      releaseDate: show.first_air_date,
      voteAverage: show.vote_average,
    });
    this.toast.success(added ? `Added "${show.name}" to favorites` : `Removed "${show.name}" from favorites`);
  }

  toggleWatchlist(): void {
    const show = this.details.data();
    if (!show) return;
    const added = this.storage.toggleWatchlist({
      id: show.id,
      mediaType: 'tv',
      title: show.name,
      posterPath: show.poster_path,
      releaseDate: show.first_air_date,
      voteAverage: show.vote_average,
    });
    this.toast.success(added ? `Added "${show.name}" to watchlist` : `Removed "${show.name}" from watchlist`);
  }
}
