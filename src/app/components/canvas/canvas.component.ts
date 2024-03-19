import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { PixelComponent } from '../pixel/pixel.component';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [PixelComponent],
  template: `
    <div
      sfPaintCanvas
      class="canvas grid p-2 rounded-lg"
      [style.gridTemplateColumns]="'repeat('+ canvasService.state.width() + ', 1fr)'">

      @for (pixel of canvasService.state.canvas(); track pixel.index) {
        <sf-pixel [pixel]="pixel"></sf-pixel>
      }

    </div>
  `,
  styles: [`
    .canvas {
      gap: 0.125rem;
      pointer-events: none;
      background-color: var(--sf-bg-light);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent {
  canvasService = inject(CanvasService);
}
