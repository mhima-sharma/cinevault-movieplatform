import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (videoKey()) {
      <div
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title() || 'Video player'"
        (click)="close.emit()"
      >
        <button
          type="button"
          (click)="close.emit()"
          class="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close video"
        >
          <svg lucideX class="h-5 w-5"></svg>
        </button>

        <div class="aspect-video w-full max-w-4xl" (click)="$event.stopPropagation()">
          <iframe
            class="h-full w-full rounded-lg"
            [src]="embedUrl()"
            title="Trailer player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    }
  `,
})
export class VideoModalComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly videoKey = input<string | null>(null);
  readonly title = input<string>('');
  readonly close = output<void>();

  embedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoKey()}?autoplay=1`);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.videoKey()) {
      this.close.emit();
    }
  }
}
