import { Directive, HostListener, inject } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { ShortcutService } from '../services/shortcut.service';

@Directive({
  selector: '[sfUndoRedo]',
  standalone: true,
})
export class UndoRedoDirective {

  canvasService = inject(CanvasService);
  shortcutService = inject(ShortcutService);

  @HostListener('window:keydown.control.z') 
  @HostListener('window:keydown.meta.z') 
  onCtrlZ() {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.undo();
    return false;
  }

  @HostListener('window:keydown.control.shift.z')
  @HostListener('window:keydown.meta.shift.z')
  onShiftCtrlZ() {
    if (!this.shortcutService.enabled()) {
      return;
    }
    this.canvasService.redo();
    return false;
  }

}
