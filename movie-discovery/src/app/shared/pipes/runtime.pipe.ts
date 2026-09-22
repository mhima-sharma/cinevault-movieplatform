import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'runtime', standalone: true })
export class RuntimePipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (!minutes) {
      return 'N/A';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
}
