import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MovieCardSkeletonComponent } from './movie-card-skeleton.component';

@Component({
  selector: 'app-movie-row-skeleton',
  standalone: true,
  imports: [MovieCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-4 overflow-hidden">
      @for (i of items(); track i) {
        <div class="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
          <app-movie-card-skeleton />
        </div>
      }
    </div>
  `,
})
export class MovieRowSkeletonComponent {
  readonly count = input(8);
  readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
