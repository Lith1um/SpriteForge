import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pixel } from '../../interfaces/pixel.interface';
import { PaintPixelDirective } from '../../directives/paint-pixel.directive';

@Component({
  selector: 'sf-pixel',
  standalone: true,
  imports: [PaintPixelDirective],
  template: `
    <div sfPaintPixel class="pixel" [pixel]="pixel()" [style.background]="pixel().colour"></div>
  `,
  styles: [`
    .pixel {
      user-select: none;
      pointer-events: auto;
      aspect-ratio: 1/ 1;
      background: repeating-linear-gradient(
        -45deg,
        var(--sf-bg),
        var(--sf-bg-light) 10%,
        var(--sf-bg) 10%,
        var(--sf-bg-light) 10%,
        var(--sf-bg) 10%,
        var(--sf-bg-light) 10%,
        var(--sf-bg) 10%,
        var(--sf-bg-light) 20%
      );
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PixelComponent {
  pixel = input.required<Pixel>();
}
