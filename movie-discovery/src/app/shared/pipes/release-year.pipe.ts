import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'releaseYear', standalone: true })
export class ReleaseYearPipe implements PipeTransform {
  transform(date: string | null | undefined): string {
    if (!date) {
      return 'N/A';
    }
    const year = new Date(date).getFullYear();
    return Number.isNaN(year) ? 'N/A' : String(year);
  }
}
