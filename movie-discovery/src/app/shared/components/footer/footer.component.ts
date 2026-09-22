import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideClapperboard } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideClapperboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-16 border-t border-white/5 bg-[var(--color-surface)]/40">
      <div class="mx-auto max-w-[1600px] px-4 md:px-8 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div class="flex items-center gap-2 text-white">
            <svg lucideClapperboard class="h-6 w-6 text-[var(--color-accent)]"></svg>
            <span class="text-lg font-extrabold">Cine<span class="text-[var(--color-accent)]">Vault</span></span>
          </div>
          <p class="mt-3 max-w-xs text-sm text-gray-500">
            Discover movies and TV shows, build your watchlist, and never miss what's trending.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white">Explore</h4>
          <ul class="mt-3 space-y-2 text-sm text-gray-400">
            <li><a routerLink="/movies" class="hover:text-white">Movies</a></li>
            <li><a routerLink="/tv" class="hover:text-white">TV Shows</a></li>
            <li><a routerLink="/genres" class="hover:text-white">Genres</a></li>
            <li><a routerLink="/trending" class="hover:text-white">Trending</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white">Your Library</h4>
          <ul class="mt-3 space-y-2 text-sm text-gray-400">
            <li><a routerLink="/favorites" class="hover:text-white">Favorites</a></li>
            <li><a routerLink="/watchlist" class="hover:text-white">Watchlist</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5 px-4 md:px-8 py-5 text-center text-xs text-gray-600">
        This product uses the TMDB API but is not endorsed or certified by TMDB. Built for demonstration purposes.
      </div>
    </footer>
  `,
})
export class FooterComponent {}
