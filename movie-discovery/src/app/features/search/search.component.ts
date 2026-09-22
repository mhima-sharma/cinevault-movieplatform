import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { Movie, PaginatedResponse, TvShow } from '../../core/models';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard, tvToCard } from '../../shared/utils/media-mapper';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieGridSkeletonComponent } from '../../shared/components/loading-skeleton/movie-grid-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

type SearchTab = 'movie' | 'tv';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, MovieCardComponent, MovieGridSkeletonComponent, EmptyStateComponent, ErrorMessageComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);

  readonly q = input('');

  protected readonly query = signal('');
  protected readonly tab = signal<SearchTab>('movie');
  protected readonly page = signal(1);

  protected readonly results = createLoadable(() => this.fetch(), { auto: false });

  protected readonly cards = computed(() => {
    const data = this.results.data();
    if (!data) return [];
    return this.tab() === 'movie' ? (data.results as Movie[]).map(movieToCard) : (data.results as TvShow[]).map(tvToCard);
  });
  protected readonly totalPages = computed(() => this.results.data()?.total_pages ?? 1);
  protected readonly hasSearched = computed(() => this.query().trim().length > 0);

  constructor() {
    effect(
      () => {
        this.query.set(this.q());
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const query = this.query();
      this.tab();
      this.page();
      if (query.trim()) {
        this.results.reload();
      }
    });
  }

  private fetch(): Observable<PaginatedResponse<Movie | TvShow>> {
    return this.tab() === 'movie'
      ? this.tmdb.searchMovies(this.query(), this.page())
      : this.tmdb.searchTvShows(this.query(), this.page());
  }

  onSearch(value: string): void {
    this.page.set(1);
    this.query.set(value);
    this.router.navigate([], { queryParams: value ? { q: value } : {}, replaceUrl: true });
  }

  setTab(tab: SearchTab): void {
    this.tab.set(tab);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
