import { Directive, HostListener, inject } from '@angular/core';
import { CanvasService } from '../services/canvas.service';

@Directive({
  selector: '[sfUndoRedo]',
  standalone: true,
})
export class UndoRedoDirective {

  canvasService = inject(CanvasService);

  @HostListener('window:keydown.meta.z') onCtrlZ() {
    this.canvasService.undo();
  }

  @HostListener('window:keydown.meta.shift.z') onShiftCtrlZ() {
    this.canvasService.redo();
  }

}
