import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideSearch, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, LucideSearch, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full">
      <svg lucideSearch class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"></svg>
      <input
        type="search"
        [formControl]="control"
        [placeholder]="placeholder()"
        [attr.aria-label]="placeholder()"
        class="w-full rounded-full border border-white/10 bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[var(--color-accent)]"
      />
      @if (control.value) {
        <button
          type="button"
          (click)="clear()"
          aria-label="Clear search"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
        >
          <svg lucideX class="h-4 w-4"></svg>
        </button>
      }
    </div>
  `,
})
export class SearchBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly placeholder = input('Search for movies, TV shows...');
  readonly initialValue = input('');
  readonly search = output<string>();

  readonly control = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.control.setValue(this.initialValue(), { emitEvent: false });

    this.control.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.search.emit(value.trim()));
  }

  clear(): void {
    this.control.setValue('');
  }
}
