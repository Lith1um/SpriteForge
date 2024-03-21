import { Directive, HostListener, Renderer2, input } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { Pixel } from '../interfaces/pixel.interface';

@Directive({
  selector: '[sfPaintPixel]',
  standalone: true
})
export class PaintPixelDirective {

  pixel = input.required<Pixel>();

  private mouseupListener: () => void;

  constructor(
    private renderer: Renderer2,
    private canvasService: CanvasService) {}

  @HostListener('mousedown')
  onMousedown(): void {
    this.canvasService.startPainting(this.pixel().index);
    this.addMouseupListener();
  }

  @HostListener('mouseenter')
  onMouseenter(): void {
    this.canvasService.paint(this.pixel().index);
  }

  private onMouseup(): void {
    this.canvasService.stopPainting();
    this.removeMouseupListener();
  }

  private addMouseupListener(): void {
    this.mouseupListener = this.renderer.listen(window, 'mouseup', () => this.onMouseup())
  }

  private removeMouseupListener(): void {
    this.mouseupListener?.();
  }

}