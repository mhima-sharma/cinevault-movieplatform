import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TmdbService, TimeWindow } from '../../core/services/tmdb.service';
import { Movie, PaginatedResponse, TvShow } from '../../core/models';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard, tvToCard } from '../../shared/utils/media-mapper';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieGridSkeletonComponent } from '../../shared/components/loading-skeleton/movie-grid-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

type MediaTab = 'movie' | 'tv';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [MovieCardComponent, MovieGridSkeletonComponent, EmptyStateComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trending.component.html',
})
export class TrendingComponent {
  private readonly tmdb = inject(TmdbService);

  protected readonly mediaTab = signal<MediaTab>('movie');
  protected readonly timeWindow = signal<TimeWindow>('day');

  protected readonly trending = createLoadable(() => this.fetch(), { auto: false });

  protected readonly cards = computed(() => {
    const data = this.trending.data();
    if (!data) return [];
    return this.mediaTab() === 'movie' ? (data.results as Movie[]).map(movieToCard) : (data.results as TvShow[]).map(tvToCard);
  });

  constructor() {
    effect(() => {
      this.mediaTab();
      this.timeWindow();
      this.trending.reload();
    });
  }

  private fetch(): Observable<PaginatedResponse<Movie | TvShow>> {
    return this.mediaTab() === 'movie'
      ? this.tmdb.getTrendingMovies(this.timeWindow())
      : this.tmdb.getTrendingTvShows(this.timeWindow());
  }

  setMediaTab(tab: MediaTab): void {
    this.mediaTab.set(tab);
  }

  setTimeWindow(window: TimeWindow): void {
    this.timeWindow.set(window);
  }
}
