import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { PixelComponent } from '../pixel/pixel.component';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [PixelComponent, KeyValuePipe],
  template: `
    <div class="bg-light p-2 rounded-lg">
      <div
        class="canvas grid"
        [style.gridTemplateColumns]="'repeat('+ canvasService.state.width() + ', 1fr)'">
  
        @for (pixel of canvasService.state.canvas() | keyvalue; track pixel.key) {
          <sf-pixel [pixel]="pixel.value" [colour]="canvasService.state.colour()"></sf-pixel>
        }
  
      </div>
    </div>
  `,
  styles: [`
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
