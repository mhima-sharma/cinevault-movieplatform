import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CastMember } from '../../../core/models';
import { TmdbImagePipe } from '../../pipes/tmdb-image.pipe';

@Component({
  selector: 'app-cast-list',
  standalone: true,
  imports: [TmdbImagePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cast().length) {
      <section>
        <h2 class="text-xl font-bold text-white mb-4">Cast</h2>
        <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          @for (member of cast().slice(0, limit()); track member.id) {
            <div class="w-[110px] shrink-0 text-center">
              <div class="aspect-[2/3] w-full overflow-hidden rounded-lg bg-[var(--color-surface)]">
                <img
                  [src]="member.profile_path | tmdbImage: 'profile' : 'w185'"
                  [alt]="member.name"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
              </div>
              <p class="mt-2 truncate text-xs font-semibold text-white">{{ member.name }}</p>
              <p class="truncate text-xs text-gray-500">{{ member.character }}</p>
            </div>
          }
        </div>
      </section>
    }
  `,
})
export class CastListComponent {
  readonly cast = input<CastMember[]>([]);
  readonly limit = input(20);
}
