import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideClapperboard } from '@lucide/angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideClapperboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <svg lucideClapperboard class="h-14 w-14 text-[var(--color-accent)]"></svg>
      <h1 class="text-4xl font-extrabold text-white">404</h1>
      <p class="max-w-sm text-gray-400">This scene doesn't exist. Let's get you back to the main feature.</p>
      <a
        routerLink="/"
        class="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        Back to Home
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
