import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { PaintCanvasDirective } from '../../directives/paint-pixel.directive';
import { debounceTime, fromEvent } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { drawCanvasPixels } from '../../shared/helpers/canvas';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [KeyValuePipe, PaintCanvasDirective, CommonModule],
  template: `
    <div #container class="h-100 w-100 relative">
      <canvas
        #canvas
        sfPaintCanvas
        id="sprite-forge-canvas"
        class="canvas absolute center-xy"
        [pixelGrid]="canvasService.state.canvas()"
        [canvasWidth]="canvasService.state.width()"
        [canvasHeight]="canvasService.state.height()"
        width="{{canvasService.state.width()}}"
        height="{{canvasService.state.height()}}"
        [ngStyle]="size()">
      </canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .canvas {
      user-select: none;
      touch-action: none;
      image-rendering: pixelated;
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
  container = viewChild.required<ElementRef<HTMLElement>>('container');
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  resize = toSignal(fromEvent(window, 'resize').pipe(debounceTime(10)));

  size = computed(() => {
    // re-compute on resize
    this.resize();

    const ratio = Math.min(
      this.container().nativeElement.clientWidth / this.canvasService.state.width(),
      this.container().nativeElement.clientHeight / this.canvasService.state.height()
    );

    return {
      width: `${this.canvasService.state.width() * ratio}px`,
      height: `${this.canvasService.state.height() * ratio}px`
    };
  });

  constructor(readonly canvasService: CanvasService, private host: ElementRef) {
    effect(() => {
      const canvas = canvasService.state.canvas();
      const canvasElem = this.canvasRef().nativeElement;
      if (!canvas || !canvasElem) {
        return;
      }
      drawCanvasPixels(canvasElem, canvas);
    });
  }
}
