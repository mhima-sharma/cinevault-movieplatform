import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { GenreService } from '../../core/services/genre.service';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard } from '../../shared/utils/media-mapper';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieGridSkeletonComponent } from '../../shared/components/loading-skeleton/movie-grid-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

const CATEGORY_LABELS: Record<MovieCategory, string> = {
  popular: 'Popular',
  top_rated: 'Top Rated',
  now_playing: 'Now Playing',
  upcoming: 'Upcoming',
};

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
];

const LANGUAGE_OPTIONS = [
  { value: 'hi', label: 'Hindi' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'te', label: 'Telugu' },
  { value: 'ta', label: 'Tamil' },
  { value: 'pa', label: 'Punjabi' },
];

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [MovieCardComponent, MovieGridSkeletonComponent, EmptyStateComponent, ErrorMessageComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movies.component.html',
})
export class MoviesComponent {
  private readonly tmdb = inject(TmdbService);
  protected readonly genreService = inject(GenreService);

  protected readonly categories = Object.entries(CATEGORY_LABELS) as [MovieCategory, string][];
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly languageOptions = LANGUAGE_OPTIONS;

  protected readonly activeCategory = signal<MovieCategory>('popular');
  protected readonly selectedGenre = signal<number | null>(null);
  protected readonly selectedLanguage = signal<string | null>(null);
  protected readonly sortBy = signal('popularity.desc');
  protected readonly page = signal(1);

  private readonly categoryFetchers: Record<MovieCategory, (page: number) => ReturnType<TmdbService['getPopularMovies']>> = {
    popular: (page) => this.tmdb.getPopularMovies(page),
    top_rated: (page) => this.tmdb.getTopRatedMovies(page),
    now_playing: (page) => this.tmdb.getNowPlayingMovies(page),
    upcoming: (page) => this.tmdb.getUpcomingMovies(page),
  };

  protected readonly movies = createLoadable(() => this.fetchMovies(), { auto: false });

  protected readonly cards = computed(() => this.movies.data()?.results.map(movieToCard) ?? []);
  protected readonly totalPages = computed(() => this.movies.data()?.total_pages ?? 1);
  protected readonly isFiltering = computed(() => this.selectedGenre() !== null || this.selectedLanguage() !== null);

  constructor() {
    this.genreService.ensureLoaded();

    effect(() => {
      // Re-run whenever any of these signals change.
      this.activeCategory();
      this.selectedGenre();
      this.selectedLanguage();
      this.sortBy();
      this.page();
      this.movies.reload();
    });
  }

  private fetchMovies() {
    if (this.isFiltering()) {
      return this.tmdb.discoverMovies({
        page: this.page(),
        sortBy: this.sortBy(),
        withGenres: this.selectedGenre() ?? undefined,
        withOriginalLanguage: this.selectedLanguage() ?? undefined,
      });
    }
    return this.categoryFetchers[this.activeCategory()](this.page());
  }

  selectCategory(category: MovieCategory): void {
    this.activeCategory.set(category);
    this.selectedGenre.set(null);
    this.selectedLanguage.set(null);
    this.page.set(1);
  }

  selectGenre(genreId: number | null): void {
    this.selectedGenre.set(genreId);
    this.page.set(1);
  }

  selectLanguage(language: string | null): void {
    this.selectedLanguage.set(language);
    this.page.set(1);
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
