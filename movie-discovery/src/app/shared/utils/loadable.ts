import { Signal, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export interface Loadable<T> {
  data: Signal<T | null>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  reload: () => void;
}

/**
 * Wraps an Observable-returning fetcher in {data, loading, error} signals with a reload() escape
 * hatch, so feature components don't hand-roll the same subscribe/loading/error dance.
 */
export function createLoadable<T>(factory: () => Observable<T>, options: { auto?: boolean } = {}): Loadable<T> {
  const data = signal<T | null>(null);
  const loading = signal(false);
  const error = signal<string | null>(null);
  let sub: Subscription | undefined;

  function load(): void {
    sub?.unsubscribe();
    loading.set(true);
    error.set(null);
    sub = factory().subscribe({
      next: (value) => {
        data.set(value);
        loading.set(false);
      },
      error: () => {
        error.set('We could not load this content. Please check your connection and try again.');
        loading.set(false);
      },
    });
  }

  if (options.auto !== false) {
    load();
  }

  return { data, loading, error, reload: load };
}
