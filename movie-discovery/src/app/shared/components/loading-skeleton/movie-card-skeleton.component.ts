import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-card-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/5">
      <div class="skeleton aspect-[2/3]"></div>
      <div class="p-3 space-y-2">
        <div class="skeleton h-3.5 w-4/5 rounded"></div>
        <div class="skeleton h-3 w-1/3 rounded"></div>
      </div>
    </div>
  `,
})
export class MovieCardSkeletonComponent {}
