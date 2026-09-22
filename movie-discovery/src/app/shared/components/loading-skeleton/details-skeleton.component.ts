import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-details-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in">
      <div class="skeleton h-[45vh] md:h-[60vh] w-full"></div>
      <div class="mx-auto max-w-7xl px-4 md:px-8 -mt-24 relative z-10">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="skeleton h-[270px] w-[180px] rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-4 pt-4">
            <div class="skeleton h-8 w-2/3 rounded"></div>
            <div class="skeleton h-4 w-1/3 rounded"></div>
            <div class="skeleton h-20 w-full rounded"></div>
            <div class="flex gap-2">
              <div class="skeleton h-8 w-24 rounded-full"></div>
              <div class="skeleton h-8 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DetailsSkeletonComponent {}
