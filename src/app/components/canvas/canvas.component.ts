import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, computed, effect, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { PaintCanvasDirective } from '../../directives/paint-pixel.directive';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { drawCanvasPixels } from '../../shared/helpers/canvas';
import { PreviewComponent } from '../../shared/components/preview/preview.component';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [PaintCanvasDirective, PreviewComponent],
  template: `
    <div class="canvas-container inline-flex absolute center-xy">
      @if (canvasService.state.lastFrame()) {
        <sf-preview
          class="absolute inset pointers-none opacity-50"
          [pixels]="canvasService.state.lastFrame()"
          [width]="canvasService.state.width()"
          [height]="canvasService.state.height()">
        </sf-preview>
      }

      <canvas
        #canvas
        sfPaintCanvas
        id="sprite-forge-canvas"
        class="canvas relative z-1"
        [pixelGrid]="canvasService.state.canvas()"
        [canvasWidth]="canvasService.state.width()"
        [canvasHeight]="canvasService.state.height()"
        width="{{canvasService.state.width()}}"
        height="{{canvasService.state.height()}}"
        [style.width.px]="size()?.width"
        [style.height.px]="size()?.height">
      </canvas>

      @if (canvasService.state.showGrid()) {
        @for (col of cols(); let i = $index; track i) {
          <div
            class="pointers-none absolute z-2 h-100 border-dark border-r border-dashed"
            [style.left.px]="pixelWidth() * (i + 1)"></div>
        }

        @for (row of rows(); let i = $index; track i) {
          <div
            class="pointers-none absolute z-2 w-100 border-dark border-b border-dashed"
            [style.top.px]="pixelHeight() * (i + 1)"></div>
        }
      }
  
      @if (canvasService.state.mirrorVertical()) {
        <div class="pointers-none absolute z-2 h-100 center-x border-dark border-r-2 border-dashed"></div>
      }
      @if (canvasService.state.mirrorHorizontal()) {
        <div class="pointers-none absolute z-2 w-100 center-y border-dark border-b-2 border-dashed"></div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .canvas-container {
      background: repeating-linear-gradient(
        -45deg,
        var(--sf-bg),
        var(--sf-bg) 1%,
        var(--sf-bg-light) 1%,
        var(--sf-bg-light) 2%,
      );
    }
    .canvas {
      user-select: none;
      touch-action: none;
      image-rendering: pixelated;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent {
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  cols = computed(() => new Array(this.canvasService.state.width() - 1).fill(undefined));
  rows = computed(() => new Array(this.canvasService.state.height() - 1).fill(undefined));

  resize = toSignal(new Observable<{ width: number, height: number }>(subscriber => {
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      subscriber.next({ width, height });
      this.cdr.detectChanges();
    });

    ro.observe(this.host.nativeElement);
    return () => ro.unobserve(this.host.nativeElement);
  }));

  size = computed(() => {
    const resize = this.resize();
    if (!resize) {
      return;
    }

    const ratio = Math.min(
      resize.width / this.canvasService.state.width(),
      resize.height / this.canvasService.state.height()
    );

    return {
      width: this.canvasService.state.width() * ratio,
      height: this.canvasService.state.height() * ratio
    };
  });

  pixelWidth = computed(() => (this.size()?.width ?? 0) / this.canvasService.state.width());
  pixelHeight = computed(() => (this.size()?.height ?? 0) / this.canvasService.state.height());

  constructor(readonly canvasService: CanvasService, private host: ElementRef, private cdr: ChangeDetectorRef) {    
    effect(() => {
      const canvas = canvasService.state.canvas();
      const canvasElem = this.canvasRef().nativeElement;
      if (!canvas || !canvasElem) {
        return;
      }
      // needed to ensure the canvas elem is updated
      this.cdr.detectChanges();
      drawCanvasPixels(canvasElem, canvas);
    });
  }
}
