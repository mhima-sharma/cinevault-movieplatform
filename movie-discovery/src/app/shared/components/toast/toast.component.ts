import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideCheck, LucideCircleAlert, LucideInfo, LucideX } from '@lucide/angular';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideCheck, LucideCircleAlert, LucideInfo, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--color-surface)]/95 backdrop-blur-sm px-4 py-3 shadow-2xl animate-fade-in-up"
        >
          @switch (toast.type) {
            @case ('success') {
              <svg lucideCheck class="h-4 w-4 shrink-0 text-emerald-400"></svg>
            }
            @case ('error') {
              <svg lucideCircleAlert class="h-4 w-4 shrink-0 text-[var(--color-accent)]"></svg>
            }
            @default {
              <svg lucideInfo class="h-4 w-4 shrink-0 text-[var(--color-accent-2)]"></svg>
            }
          }
          <p class="flex-1 text-sm text-white">{{ toast.message }}</p>
          <button type="button" (click)="toastService.dismiss(toast.id)" class="text-gray-400 hover:text-white" aria-label="Dismiss notification">
            <svg lucideX class="h-4 w-4"></svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
