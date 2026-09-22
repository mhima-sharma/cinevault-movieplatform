import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="flex items-center justify-center gap-2 py-10" aria-label="Pagination">
        <button
          type="button"
          [disabled]="page() <= 1"
          (click)="pageChange.emit(page() - 1)"
          class="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <svg lucideChevronLeft class="h-4 w-4"></svg>
        </button>

        @for (p of pagesToShow(); track p) {
          @if (p === -1) {
            <span class="px-1 text-gray-500">…</span>
          } @else {
            <button
              type="button"
              (click)="pageChange.emit(p)"
              [attr.aria-current]="p === page() ? 'page' : null"
              class="grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors"
              [class]="p === page() ? 'bg-[var(--color-accent)] text-white' : 'text-gray-300 hover:bg-white/10'"
            >
              {{ p }}
            </button>
          }
        }

        <button
          type="button"
          [disabled]="page() >= totalPages()"
          (click)="pageChange.emit(page() + 1)"
          class="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <svg lucideChevronRight class="h-4 w-4"></svg>
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();

  readonly pagesToShow = computed(() => {
    const total = Math.min(this.totalPages(), 500);
    const current = this.page();
    const pages: number[] = [];
    const windowSize = 1;

    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - current) <= windowSize) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
      }
    }
    return pages;
  });
}
