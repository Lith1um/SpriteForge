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
    this.canvasService.togglePainting(true);
    this.canvasService.updatePixel(this.pixel().index);
    this.addMouseupListener();
  }

  @HostListener('mouseenter')
  onMouseenter(): void {
    if (!this.canvasService.state.painting()) {
      return;
    }
    this.canvasService.updatePixel(this.pixel().index)
  }

  private onMouseup(): void {
    this.canvasService.togglePainting(false);
    this.removeMouseupListener();
  }

  private addMouseupListener(): void {
    this.mouseupListener = this.renderer.listen(window, 'mouseup', () => this.onMouseup())
  }

  private removeMouseupListener(): void {
    this.mouseupListener?.();
  }

}