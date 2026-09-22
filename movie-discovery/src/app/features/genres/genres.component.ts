import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GenreService } from '../../core/services/genre.service';

const GRADIENTS = [
  'from-red-600/40 to-red-900/10',
  'from-amber-500/40 to-amber-900/10',
  'from-emerald-500/40 to-emerald-900/10',
  'from-sky-500/40 to-sky-900/10',
  'from-violet-500/40 to-violet-900/10',
  'from-pink-500/40 to-pink-900/10',
  'from-teal-500/40 to-teal-900/10',
  'from-orange-500/40 to-orange-900/10',
];

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './genres.component.html',
})
export class GenresComponent {
  protected readonly genreService = inject(GenreService);

  constructor() {
    this.genreService.ensureLoaded();
  }

  gradientFor(index: number): string {
    return GRADIENTS[index % GRADIENTS.length];
  }
}
