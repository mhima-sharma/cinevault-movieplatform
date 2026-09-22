import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideHeart, LucidePlus } from '@lucide/angular';
import { StorageService } from '../../../core/services/storage.service';
import { ToastService } from '../../../core/services/toast.service';
import { TmdbImagePipe } from '../../pipes/tmdb-image.pipe';
import { ReleaseYearPipe } from '../../pipes/release-year.pipe';
import { RatingComponent } from '../rating/rating.component';

export interface MovieCardItem {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, TmdbImagePipe, ReleaseYearPipe, RatingComponent, LucideHeart, LucidePlus, LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/', routeSegment(), item().id]"
      class="group relative block w-full shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
      [attr.aria-label]="item().title"
    >
      <div class="relative aspect-[2/3] overflow-hidden bg-[var(--color-surface)]">
        <img
          [src]="item().posterPath | tmdbImage: 'poster' : 'w342'"
          [alt]="item().title"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            (click)="onToggleFavorite($event)"
            class="grid h-8 w-8 place-items-center rounded-full bg-black/60 backdrop-blur-sm text-white transition-colors hover:bg-[var(--color-accent)]"
            [attr.aria-pressed]="isFavorite()"
            [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          >
            <svg lucideHeart [class]="isFavorite() ? 'h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]' : 'h-4 w-4'"></svg>
          </button>
          <button
            type="button"
            (click)="onToggleWatchlist($event)"
            class="grid h-8 w-8 place-items-center rounded-full bg-black/60 backdrop-blur-sm text-white transition-colors hover:bg-[var(--color-accent-2)] hover:text-black"
            [attr.aria-pressed]="isInWatchlist()"
            [attr.aria-label]="isInWatchlist() ? 'Remove from watchlist' : 'Add to watchlist'"
          >
            @if (isInWatchlist()) {
              <svg lucideCheck class="h-4 w-4"></svg>
            } @else {
              <svg lucidePlus class="h-4 w-4"></svg>
            }
          </button>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <app-rating [voteAverage]="item().voteAverage" size="sm" />
        </div>
      </div>

      <div class="p-3">
        <h3 class="truncate text-sm font-semibold text-white group-hover:text-[var(--color-accent-2)] transition-colors">
          {{ item().title }}
        </h3>
        <p class="mt-1 text-xs text-gray-400">{{ item().releaseDate | releaseYear }}</p>
      </div>
    </a>
  `,
})
export class MovieCardComponent {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);

  readonly item = input.required<MovieCardItem>();
  readonly mediaType = input<'movie' | 'tv'>('movie');

  readonly routeSegment = computed(() => (this.mediaType() === 'movie' ? 'movies' : 'tv'));

  readonly isFavorite = computed(() => this.storage.isFavorite(this.item().id, this.mediaType()));
  readonly isInWatchlist = computed(() => this.storage.isInWatchlist(this.item().id, this.mediaType()));

  onToggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const added = this.storage.toggleFavorite({
      id: this.item().id,
      mediaType: this.mediaType(),
      title: this.item().title,
      posterPath: this.item().posterPath,
      releaseDate: this.item().releaseDate,
      voteAverage: this.item().voteAverage,
    });
    this.toast.success(added ? `Added "${this.item().title}" to favorites` : `Removed "${this.item().title}" from favorites`);
  }

  onToggleWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const added = this.storage.toggleWatchlist({
      id: this.item().id,
      mediaType: this.mediaType(),
      title: this.item().title,
      posterPath: this.item().posterPath,
      releaseDate: this.item().releaseDate,
      voteAverage: this.item().voteAverage,
    });
    this.toast.success(added ? `Added "${this.item().title}" to watchlist` : `Removed "${this.item().title}" from watchlist`);
  }
}
