import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { GenreService } from '../../core/services/genre.service';
import { createLoadable } from '../../shared/utils/loadable';
import { tvToCard } from '../../shared/utils/media-mapper';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieGridSkeletonComponent } from '../../shared/components/loading-skeleton/movie-grid-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

type TvCategory = 'popular' | 'top_rated' | 'airing_today' | 'trending';

const CATEGORY_LABELS: Record<TvCategory, string> = {
  popular: 'Popular',
  top_rated: 'Top Rated',
  airing_today: 'Airing Today',
  trending: 'Trending',
};

@Component({
  selector: 'app-tv',
  standalone: true,
  imports: [MovieCardComponent, MovieGridSkeletonComponent, EmptyStateComponent, ErrorMessageComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tv.component.html',
})
export class TvComponent {
  private readonly tmdb = inject(TmdbService);
  protected readonly genreService = inject(GenreService);

  protected readonly categories = Object.entries(CATEGORY_LABELS) as [TvCategory, string][];
  protected readonly activeCategory = signal<TvCategory>('popular');
  protected readonly selectedGenre = signal<number | null>(null);
  protected readonly page = signal(1);

  private readonly categoryFetchers: Record<TvCategory, (page: number) => ReturnType<TmdbService['getPopularTvShows']>> = {
    popular: (page) => this.tmdb.getPopularTvShows(page),
    top_rated: (page) => this.tmdb.getTopRatedTvShows(page),
    airing_today: (page) => this.tmdb.getAiringTodayTvShows(page),
    trending: (page) => this.tmdb.getTrendingTvShows('day', page),
  };

  protected readonly shows = createLoadable(() => this.categoryFetchers[this.activeCategory()](this.page()), { auto: false });

  protected readonly cards = computed(() => {
    const results = this.shows.data()?.results ?? [];
    const genre = this.selectedGenre();
    const filtered = genre === null ? results : results.filter((show) => show.genre_ids.includes(genre));
    return filtered.map(tvToCard);
  });
  protected readonly totalPages = computed(() => this.shows.data()?.total_pages ?? 1);

  constructor() {
    this.genreService.ensureLoaded();

    effect(() => {
      this.activeCategory();
      this.page();
      this.shows.reload();
    });
  }

  selectCategory(category: TvCategory): void {
    this.activeCategory.set(category);
    this.page.set(1);
  }

  selectGenre(genreId: number | null): void {
    this.selectedGenre.set(genreId);
  }

  onPageChange(page: number): void {
    this.page.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
