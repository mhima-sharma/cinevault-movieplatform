import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { LucideCircleAlert, LucideRefreshCw } from '@lucide/angular';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [LucideCircleAlert, LucideRefreshCw],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
      <div class="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-accent)]/10">
        <svg lucideCircleAlert class="h-7 w-7 text-[var(--color-accent)]"></svg>
      </div>
      <h3 class="text-lg font-semibold text-white">{{ title() }}</h3>
      <p class="max-w-sm text-sm text-gray-400">{{ message() }}</p>
      @if (showRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          <svg lucideRefreshCw class="h-4 w-4"></svg>
          Try Again
        </button>
      }
    </div>
  `,
})
export class ErrorMessageComponent {
  readonly title = input('Something went wrong');
  readonly message = input('We could not load this content. Please try again.');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}
