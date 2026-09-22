import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideFilm } from '@lucide/angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideFilm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
      <div class="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-surface)]">
        <svg lucideFilm class="h-7 w-7 text-gray-500"></svg>
      </div>
      <h3 class="text-lg font-semibold text-white">{{ title() }}</h3>
      <p class="max-w-sm text-sm text-gray-400">{{ message() }}</p>
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly message = input('There is nothing to show right now.');
}
