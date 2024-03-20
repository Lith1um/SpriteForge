import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pixel } from '../../interfaces/pixel.interface';
import { PaintPixelDirective } from '../../directives/paint-pixel.directive';

@Component({
  selector: 'sf-pixel',
  standalone: true,
  imports: [PaintPixelDirective],
  template: `
    <div sfPaintPixel class="pixel" [pixel]="pixel()" [style.background]="pixel().colour" [style.--hover-colour]="colour()"></div>
  `,
  styles: [`
    .pixel {
      user-select: none;
      pointer-events: auto;
      aspect-ratio: 1/ 1;
    }

    .pixel:hover {
      background: var(--hover-colour) !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PixelComponent {
  pixel = input.required<Pixel>();

  colour = input.required<string>();
}
