import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

export type TmdbImageType = 'poster' | 'backdrop' | 'profile';
export type TmdbImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

const FALLBACKS: Record<TmdbImageType, string> = {
  poster: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="342" height="513" viewBox="0 0 342 513"%3E%3Crect width="342" height="513" fill="%23151515"/%3E%3Ctext x="50%25" y="50%25" fill="%23555" font-family="sans-serif" font-size="18" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E',
  backdrop: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="780" height="439" viewBox="0 0 780 439"%3E%3Crect width="780" height="439" fill="%23151515"/%3E%3Ctext x="50%25" y="50%25" fill="%23555" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E',
  profile: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="185" height="278" viewBox="0 0 185 278"%3E%3Crect width="185" height="278" fill="%23151515"/%3E%3Ctext x="50%25" y="50%25" fill="%23555" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em"%3ENo Photo%3C/text%3E%3C/svg%3E',
};

@Pipe({ name: 'tmdbImage', standalone: true })
export class TmdbImagePipe implements PipeTransform {
  transform(path: string | null | undefined, type: TmdbImageType = 'poster', size: TmdbImageSize = 'w500'): string {
    if (!path) {
      return FALLBACKS[type];
    }
    return `${environment.tmdbImageUrl}/${size}${path}`;
  }
}
