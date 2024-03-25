import { Directive, HostListener, inject } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { CanvasTool } from '../interfaces/canvas-state.interface';

@Directive({
  selector: '[sfToolSelect]',
  standalone: true,
})
export class ToolSelectDirective {

  canvasService = inject(CanvasService);

  @HostListener('window:keydown.d')
  onDKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Draw);
  }

  @HostListener('window:keydown.l')
  onLKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Line);
  }

  @HostListener('window:keydown.e')
  onEKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Erase);
  }

  @HostListener('window:keydown.r')
  onRKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Rectangle);
  }

  @HostListener('window:keydown.c')
  onCKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Circle);
  }

  @HostListener('window:keydown.f')
  onFKeydown(): void {
    this.canvasService.state.tool.set(CanvasTool.Fill);
  }

}
