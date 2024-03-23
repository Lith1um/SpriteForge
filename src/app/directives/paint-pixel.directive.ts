import { Directive, ElementRef, HostListener, Renderer2, input, signal } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { Pixel } from '../interfaces/pixel.interface';

@Directive({
  selector: '[sfPaintCanvas]',
  standalone: true
})
export class PaintCanvasDirective {

  pixelGrid = input.required<Map<number, Pixel>>();

  lastFoundPixel = signal<number | undefined>(undefined);

  private mouseupListener: () => void;
  private mousemoveListener: () => void;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private canvasService: CanvasService) {}

  @HostListener('mousedown', ['$event'])
  onMousedown(e: MouseEvent): void {
    const pixelIndex = this.parsePixel(e);
    this.canvasService.startPainting(pixelIndex);
    this.addListeners();
  }

  private parsePixel(e: MouseEvent): number {
    return parseInt((<HTMLElement>e.target).id.split('-')[1]);
  }

  private onMousemove(e: MouseEvent): void {
    const pixelIndex = this.parsePixel(e);

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
    this.mouseupListener = this.renderer.listen(window, 'mouseup', () => this.onMouseup())
    this.mousemoveListener = this.renderer.listen(this.el.nativeElement, 'mousemove', (e) => this.onMousemove(e))
  }

  private removeListeners(): void {
    this.mouseupListener?.();
    this.mousemoveListener?.();
    this.lastFoundPixel.set(undefined);
  }

}