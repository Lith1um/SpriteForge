import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { PixelComponent } from '../pixel/pixel.component';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [PixelComponent],
  template: `
    <div class="canvas-container p-2 rounded-lg">
      <div
        class="canvas grid"
        [style.gridTemplateColumns]="'repeat('+ canvasService.canvasState.width() + ', 1fr)'">
  
        @for (pixel of canvasService.canvasState.canvas(); track pixel.index) {
          <sf-pixel [pixel]="pixel" [colour]="canvasService.canvasState.colour()"></sf-pixel>
        }
  
      </div>
    </div>
  `,
  styles: [`
    .canvas-container {
      background-color: var(--sf-bg-light);
    }
    .canvas {
      pointer-events: none;
      background: repeating-linear-gradient(
        -45deg,
        var(--sf-bg),
        var(--sf-bg) 1%,
        var(--sf-bg-light) 1%,
        var(--sf-bg-light) 2%,
      );
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent {
  canvasService = inject(CanvasService);
}
