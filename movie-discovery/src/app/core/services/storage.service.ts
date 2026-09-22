import { Injectable, signal } from '@angular/core';

export interface StoredItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  addedAt: number;
}

const FAVORITES_KEY = 'md_favorites';
const WATCHLIST_KEY = 'md_watchlist';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly favorites = signal<StoredItem[]>(this.read(FAVORITES_KEY));
  readonly watchlist = signal<StoredItem[]>(this.read(WATCHLIST_KEY));

  private read(key: string): StoredItem[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredItem[]) : [];
    } catch {
      return [];
    }
  }

  private write(key: string, items: StoredItem[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private mode / quota) — fail silently, in-memory state still works
    }
  }

  isFavorite(id: number, mediaType: 'movie' | 'tv'): boolean {
    return this.favorites().some((item) => item.id === id && item.mediaType === mediaType);
  }

  isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
    return this.watchlist().some((item) => item.id === id && item.mediaType === mediaType);
  }

  toggleFavorite(item: Omit<StoredItem, 'addedAt'>): boolean {
    const exists = this.isFavorite(item.id, item.mediaType);
    const next = exists
      ? this.favorites().filter((f) => !(f.id === item.id && f.mediaType === item.mediaType))
      : [...this.favorites(), { ...item, addedAt: Date.now() }];
    this.favorites.set(next);
    this.write(FAVORITES_KEY, next);
    return !exists;
  }

  toggleWatchlist(item: Omit<StoredItem, 'addedAt'>): boolean {
    const exists = this.isInWatchlist(item.id, item.mediaType);
    const next = exists
      ? this.watchlist().filter((f) => !(f.id === item.id && f.mediaType === item.mediaType))
      : [...this.watchlist(), { ...item, addedAt: Date.now() }];
    this.watchlist.set(next);
    this.write(WATCHLIST_KEY, next);
    return !exists;
  }

  removeFavorite(id: number, mediaType: 'movie' | 'tv'): void {
    const next = this.favorites().filter((f) => !(f.id === id && f.mediaType === mediaType));
    this.favorites.set(next);
    this.write(FAVORITES_KEY, next);
  }

  removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
    const next = this.watchlist().filter((f) => !(f.id === id && f.mediaType === mediaType));
    this.watchlist.set(next);
    this.write(WATCHLIST_KEY, next);
  }
}
