import { Directive, HostListener, inject } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { CanvasTool } from '../interfaces/canvas-state.interface';
import { ShortcutService } from '../services/shortcut.service';

@Directive({
  selector: '[sfToolSelect]',
  standalone: true,
})
export class ToolSelectDirective {

  canvasService = inject(CanvasService);
  shortcutService = inject(ShortcutService);

  @HostListener('window:keydown.d')
  onDKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Draw);
  }

  @HostListener('window:keydown.l')
  onLKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Line);
  }

  @HostListener('window:keydown.e')
  onEKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Erase);
  }

  @HostListener('window:keydown.r')
  onRKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Rectangle);
  }

  @HostListener('window:keydown.c')
  onCKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Circle);
  }

  @HostListener('window:keydown.f')
  onFKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.tool.set(CanvasTool.Fill);
  }

  @HostListener('window:keydown.g')
  onGKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.showGrid.update(show => !show);
  }

  @HostListener('window:keydown.v')
  onVKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.mirrorVertical.update(mirror => !mirror);
  }

  @HostListener('window:keydown.h')
  onHKeydown(): void {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.state.mirrorHorizontal.update(mirror => !mirror);
  }

}
