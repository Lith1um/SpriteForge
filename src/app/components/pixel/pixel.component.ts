import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pixel } from '../../interfaces/pixel.interface';

@Component({
  selector: 'sf-pixel',
  standalone: true,
  template: `
    <div [id]="'pixel-'+pixel().index" class="pixel" [style.background]="pixel().colour" [style.--hover-colour]="colour()"></div>
  `,
  styles: [`
    .pixel {
      user-select: none;
      pointer-events: auto;
      aspect-ratio: 1/ 1;
    }

    .pixel:hover {
      box-shadow: inset 0px 0px 0px 1px var(--hover-colour);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PixelComponent {
  pixel = input.required<Pixel>();

  colour = input.required<string>();
}
