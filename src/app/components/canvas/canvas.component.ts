import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Signal, computed, effect, input, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { PaintCanvasDirective } from '../../directives/paint-pixel.directive';
import { NextObserver, Observable, Subscriber, debounceTime, filter, fromEvent, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { drawCanvasPixels } from '../../shared/helpers/canvas';

@Component({
  selector: 'sf-canvas',
  standalone: true,
  imports: [KeyValuePipe, PaintCanvasDirective, CommonModule],
  template: `
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

    @if (mirrorY()) {
      <div class="mirror-y absolute h-100 center-x"></div>
    }
    @if (mirrorX()) {
      <div class="mirror-x absolute w-100 center-y"></div>
    }
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
    .mirror-y {
      pointer-events: none;
      border-right: 2px dashed var(--sf-primary);
    }
    .mirror-x {
      pointer-events: none;
      border-bottom: 2px dashed var(--sf-primary);
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent {
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  mirrorY = input.required<boolean>();
  mirrorX = input.required<boolean>();

  resize = toSignal(new Observable<{ width: number, height: number }>(subscriber => {
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      subscriber.next({ width, height });
      this.cdr.detectChanges();
    });

    // Observe one or multiple elements
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
      width: `${this.canvasService.state.width() * ratio}px`,
      height: `${this.canvasService.state.height() * ratio}px`
    };
  });

  constructor(readonly canvasService: CanvasService, private host: ElementRef, private cdr: ChangeDetectorRef) {    
    effect(() => {
      const canvas = canvasService.state.canvas();
      const canvasElem = this.canvasRef().nativeElement;
      if (!canvas || !canvasElem) {
        return;
      }
      // this is horrible but something about the size of the canvas changing causes this to break
      setTimeout(() => drawCanvasPixels(canvasElem, canvas), 10);
    });
  }
}
