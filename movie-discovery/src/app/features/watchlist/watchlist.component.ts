import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StorageService, StoredItem } from '../../core/services/storage.service';
import { MovieCardComponent, MovieCardItem } from '../../shared/components/movie-card/movie-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [MovieCardComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './watchlist.component.html',
})
export class WatchlistComponent {
  private readonly storage = inject(StorageService);

  protected readonly watchlist = computed(() =>
    [...this.storage.watchlist()]
      .sort((a, b) => b.addedAt - a.addedAt)
      .map((item) => ({ card: this.toCard(item), mediaType: item.mediaType })),
  );

  private toCard(item: StoredItem): MovieCardItem {
    return {
      id: item.id,
      title: item.title,
      posterPath: item.posterPath,
      releaseDate: item.releaseDate,
      voteAverage: item.voteAverage,
    };
  }
}
