import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { MovieCardComponent, MovieCardItem } from '../movie-card/movie-card.component';
import { MovieRowSkeletonComponent } from '../loading-skeleton/movie-row-skeleton.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [RouterLink, MovieCardComponent, MovieRowSkeletonComponent, EmptyStateComponent, LucideChevronLeft, LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative">
      <div class="mb-3 flex items-center justify-between px-4 md:px-8">
        <h2 class="text-lg md:text-xl font-bold text-white">{{ title() }}</h2>
        @if (viewAllLink()) {
          <a [routerLink]="viewAllLink()" class="text-sm font-medium text-gray-400 hover:text-[var(--color-accent-2)] transition-colors">
            View All
          </a>
        }
      </div>

      @if (loading()) {
        <div class="px-4 md:px-8">
          <app-movie-row-skeleton />
        </div>
      } @else if (items().length === 0) {
        <app-empty-state title="No titles found" message="Check back later for more content." />
      } @else {
        <div class="group/row relative">
          <button
            type="button"
            (click)="scrollBy(-1)"
            aria-label="Scroll left"
            class="hidden md:grid absolute left-1 top-1/2 z-10 h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-[var(--color-accent)]"
          >
            <svg lucideChevronLeft class="h-5 w-5"></svg>
          </button>

          <div #scrollContainer class="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-8 pb-2">
            @for (item of items(); track item.id) {
              <div class="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
                <app-movie-card [item]="item" [mediaType]="mediaType()" />
              </div>
            }
          </div>

          <button
            type="button"
            (click)="scrollBy(1)"
            aria-label="Scroll right"
            class="hidden md:grid absolute right-1 top-1/2 z-10 h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-[var(--color-accent)]"
          >
            <svg lucideChevronRight class="h-5 w-5"></svg>
          </button>
        </div>
      }
    </section>
  `,
})
export class MovieRowComponent {
  readonly title = input.required<string>();
  readonly items = input<MovieCardItem[]>([]);
  readonly loading = input(false);
  readonly mediaType = input<'movie' | 'tv'>('movie');
  readonly viewAllLink = input<string | null>(null);

  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scrollBy(direction: 1 | -1): void {
    const el = this.scrollContainer()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
