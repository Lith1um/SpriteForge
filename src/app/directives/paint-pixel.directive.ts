import { Directive, ElementRef, HostListener, Renderer2, input, signal } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { Pixel } from '../interfaces/pixel.interface';
import { point2DToPixelIndex } from '../shared/helpers/pixels';
import { throttle } from '../shared/helpers/throttle';

@Directive({
  selector: '[sfPaintCanvas]',
  standalone: true
})
export class PaintCanvasDirective {

  pixelGrid = input.required<Map<number, Pixel>>();
  canvasWidth = input.required<number>();
  canvasHeight = input.required<number>();

  lastFoundPixel = signal<number | undefined>(undefined);

  private mouseupListener: () => void;
  private mousemoveListener: () => void;

  constructor(
    private el: ElementRef<HTMLCanvasElement>,
    private renderer: Renderer2,
    private canvasService: CanvasService) {}

  @HostListener('pointerdown', ['$event'])
  onMousedown(e: MouseEvent): void {
    const pixelIndex = this.parsePixel(e);

    if (pixelIndex === undefined) {
      return;
    }
    
    this.canvasService.startPainting(pixelIndex);
    this.addListeners();
  }

  private onMousemove(e: MouseEvent): void {
    const pixelIndex = this.parsePixel(e);

    if (pixelIndex === undefined) {
      return;
    }

    if (pixelIndex !== this.lastFoundPixel()) {
      this.canvasService.paint(pixelIndex);
      this.lastFoundPixel.set(pixelIndex);
    }
  }

  private onMouseup(): void {
    this.canvasService.stopPainting();
    this.removeListeners();
  }

  private addListeners(): void {
    this.mouseupListener = this.renderer.listen(window, 'pointerup', () => this.onMouseup())
    this.mousemoveListener = this.renderer.listen(this.el.nativeElement, 'pointermove', throttle((e) => this.onMousemove(e)))
  }

  private removeListeners(): void {
    this.mouseupListener?.();
    this.mousemoveListener?.();
    this.lastFoundPixel.set(undefined);
  }

  private parsePixel(e: MouseEvent): number | undefined {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xIndex = Math.floor((x / rect.width) * this.canvasWidth());
    const yIndex = Math.floor((y / rect.height) * this.canvasHeight());

    if (xIndex >= 0 && xIndex < this.canvasWidth() && yIndex >= 0 && yIndex < this.canvasHeight()) {
      return point2DToPixelIndex({ x: xIndex, y: yIndex }, this.canvasWidth());
    }
    return undefined;
  }

}