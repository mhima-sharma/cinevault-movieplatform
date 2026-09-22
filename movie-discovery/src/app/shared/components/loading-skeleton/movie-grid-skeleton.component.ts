import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MovieCardSkeletonComponent } from './movie-card-skeleton.component';

@Component({
  selector: 'app-movie-grid-skeleton',
  standalone: true,
  imports: [MovieCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      @for (i of items(); track i) {
        <app-movie-card-skeleton />
      }
    </div>
  `,
})
export class MovieGridSkeletonComponent {
  readonly count = input(12);
  readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
