import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideClapperboard, LucideMenu, LucideSearch, LucideX } from '@lucide/angular';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideClapperboard, LucideSearch, LucideMenu, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-50 border-b border-white/5 transition-colors duration-300"
      [class]="scrolled() ? 'bg-[var(--color-bg)]/95 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'"
    >
      <nav class="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <a routerLink="/" class="flex items-center gap-2 text-white shrink-0" aria-label="CineVault home">
          <svg lucideClapperboard class="h-6 w-6 text-[var(--color-accent)]"></svg>
          <span class="text-lg font-extrabold tracking-tight">Cine<span class="text-[var(--color-accent)]">Vault</span></span>
        </a>

        <ul class="hidden lg:flex items-center gap-1">
          @for (link of navLinks; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive="text-white bg-white/10"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="rounded-full px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-2">
          <a
            routerLink="/search"
            aria-label="Search"
            class="grid h-10 w-10 place-items-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg lucideSearch class="h-5 w-5"></svg>
          </a>
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            (click)="mobileOpen.set(!mobileOpen())"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Toggle navigation menu"
          >
            @if (mobileOpen()) {
              <svg lucideX class="h-5 w-5"></svg>
            } @else {
              <svg lucideMenu class="h-5 w-5"></svg>
            }
          </button>
        </div>
      </nav>

      @if (mobileOpen()) {
        <div class="lg:hidden border-t border-white/5 bg-[var(--color-bg)] px-4 py-3 animate-fade-in">
          <ul class="flex flex-col gap-1">
            @for (link of navLinks; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  routerLinkActive="text-white bg-white/10"
                  [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                  (click)="mobileOpen.set(false)"
                  class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly mobileOpen = signal(false);
  readonly scrolled = signal(false);

  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv' },
    { label: 'Genres', path: '/genres' },
    { label: 'Trending', path: '/trending' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Watchlist', path: '/watchlist' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }
}
