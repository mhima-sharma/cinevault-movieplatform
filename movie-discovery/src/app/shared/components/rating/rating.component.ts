import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [LucideStar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-1" [class]="'text-' + size()">
      <svg lucideStar class="text-[var(--color-accent-2)] fill-[var(--color-accent-2)]" [class.w-3.5]="size() === 'sm'" [class.h-3.5]="size() === 'sm'" [class.w-4]="size() === 'md'" [class.h-4]="size() === 'md'" [class.w-5]="size() === 'lg'" [class.h-5]="size() === 'lg'"></svg>
      <span class="font-semibold text-white">{{ displayValue() }}</span>
      @if (showOutOf()) {
        <span class="text-gray-500">/10</span>
      }
    </span>
  `,
})
export class RatingComponent {
  readonly voteAverage = input<number>(0);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly showOutOf = input(false);

  readonly displayValue = computed(() => {
    const value = this.voteAverage();
    return value ? value.toFixed(1) : 'N/A';
  });
}
