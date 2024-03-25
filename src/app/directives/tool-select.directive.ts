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
  onDKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Draw);
    return false;
  }

  @HostListener('window:keydown.l')
  onLKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Line);
    return false;
  }

  @HostListener('window:keydown.e')
  onEKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Erase);
    return false;
  }

  @HostListener('window:keydown.r')
  onRKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Rectangle);
    return false;
  }

  @HostListener('window:keydown.c')
  onCKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Circle);
    return false;
  }

  @HostListener('window:keydown.f')
  onFKeydown(): boolean {
    this.canvasService.state.tool.set(CanvasTool.Fill);
    return false;
  }

}
