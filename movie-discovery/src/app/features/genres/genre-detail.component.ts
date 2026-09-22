import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';
import { TmdbService } from '../../core/services/tmdb.service';
import { GenreService } from '../../core/services/genre.service';
import { createLoadable } from '../../shared/utils/loadable';
import { movieToCard } from '../../shared/utils/media-mapper';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieGridSkeletonComponent } from '../../shared/components/loading-skeleton/movie-grid-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-genre-detail',
  standalone: true,
  imports: [RouterLink, MovieCardComponent, MovieGridSkeletonComponent, EmptyStateComponent, ErrorMessageComponent, PaginationComponent, LucideArrowLeft],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './genre-detail.component.html',
})
export class GenreDetailComponent {
  private readonly tmdb = inject(TmdbService);
  protected readonly genreService = inject(GenreService);

  readonly id = input.required<string>();
  readonly name = input('');

  protected readonly page = signal(1);

  protected readonly movies = createLoadable(
    () => this.tmdb.discoverMovies({ page: this.page(), withGenres: this.id() }),
    { auto: false },
  );

  protected readonly cards = computed(() => this.movies.data()?.results.map(movieToCard) ?? []);
  protected readonly totalPages = computed(() => this.movies.data()?.total_pages ?? 1);

  protected readonly resolvedName = computed(() => {
    if (this.name()) return this.name();
    return this.genreService.movieGenres().find((g) => g.id === Number(this.id()))?.name ?? 'Genre';
  });

  constructor() {
    this.genreService.ensureLoaded();

    effect(
      () => {
        this.id();
        this.page.set(1);
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      this.id();
      this.page();
      this.movies.reload();
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
